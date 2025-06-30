from flask import Blueprint, request, jsonify, current_app
from models import Product
import pandas as pd
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import re

bp = Blueprint('api', __name__)
FEATURE_COLUMNS = ["stock", "sales", "return_count", "rating", "avg_margin"]

# -----------------------------------------------
# SOCIAL MEDIA TREND FETCHER
# -----------------------------------------------
def fetch_social_trend(product_name):
    keyword = product_name.split()[0]
    hashtag = f"#{keyword}"
    url = f"https://nitter.net/search?f=tweets&q={hashtag}"
    try:
        resp = requests.get(url, timeout=5)
        soup = BeautifulSoup(resp.text, 'html.parser')
        tweets = soup.select('.timeline-item .tweet-content')
        if not tweets:
            fallback = [
                "Everyone’s talking about sustainability lately! #EcoFriendly",
                "Top trending eco brand this week!",
                "Great results from our latest skincare drop 🌿",
                "Influencers are loving these new launches!"
            ]
            import random
            return {
                "hashtag": hashtag,
                "platform": "Twitter",
                "score": random.randint(60, 90),
                "sample": random.choice(fallback),
                "description": "No recent tweets found. Generated fallback trend data."
            }
        sample = tweets[0].get_text(strip=True)
        return {
            "hashtag": hashtag,
            "platform": "Twitter",
            "score": min(len(tweets) * 10, 100),
            "sample": sample[:140],
            "description": "This score is derived from current mentions on social media for the given product hashtag. Higher score means more trending."
        }
    except Exception:
        return {
            "hashtag": hashtag,
            "platform": "Twitter",
            "score": 0,
            "sample": "Unable to fetch trend due to server issue.",
            "description": "Unable to determine trend due to a fetching error."
        }

# -----------------------------------------------
# BRAND ADVICE LOGIC
# -----------------------------------------------
def extract_rank_number(rank):
    try:
        if isinstance(rank, str):
            match = re.search(r'\d+', rank)
            if match:
                return int(match.group())
        elif isinstance(rank, (int, float)):
            return int(rank)
    except:
        pass
    return None

def generate_brand_advice(sentiment, influencers, rank):
    rank_number = extract_rank_number(rank)
    if sentiment and sentiment.lower() == "positive" and rank_number and rank_number <= 5:
        return "👍 Strong brand presence. Continue influencer campaigns and capitalize on top ranking."
    elif sentiment and sentiment.lower() == "negative":
        return "⚠️ Brand reputation is poor. Monitor reviews, improve customer engagement, or consider PR efforts."
    elif rank_number and rank_number > 10:
        return "📉 Market rank low. Improve visibility via marketing, SEO, and influencer tie-ups."
    return "🧐 Monitor brand dynamics closely."

# -----------------------------------------------
# SOCIAL MEDIA STOCK ESTIMATION
# -----------------------------------------------
def generate_trend_stock_note(score, last_week_sales, stock):
    note = None
    extra_units = None
    if score >= 85:
        boost = int(last_week_sales * 1.5)
        if stock < boost:
            extra_units = boost - stock
            note = f"📈 Social trend is high. Recommend stocking at least {boost} units."
    elif score >= 70:
        boost = int(last_week_sales * 1.2)
        if stock < boost:
            extra_units = boost - stock
            note = f"🚀 Trending! Consider increasing stock to ~{boost} units."
    elif score < 40 and stock > 150:
        note = "📉 Trend is low with high stock. Consider slowing restocking."

    return note, extra_units

# -----------------------------------------------
# PRODUCT DETAIL API WITH ANOMALY, TREND, INSIGHTS
# -----------------------------------------------
@bp.route('/product/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.filter_by(product_id=product_id).first()
        if not product:
            return jsonify({"error": "Product not found"}), 404

        model = current_app.config['ANOMALY_MODEL']
        trend_data = fetch_social_trend(product.name)

        if None in (product.stock, product.sales, product.return_count, product.rating, product.avg_margin):
            return jsonify({"error": "Incomplete product data"}), 400

        input_df = pd.DataFrame([[product.stock, product.sales, product.return_count,
                                  product.rating, product.avg_margin]], columns=FEATURE_COLUMNS)

        anomaly_score = model.decision_function(input_df)[0]
        is_anomaly = model.predict(input_df)[0] == -1

        insights = []
        anomaly_tags = []

        if product.last_week_sales:
            if product.sales < product.last_week_sales * 0.85:
                insights.append("⚠️ Sales dropped >15% vs last week.")
                anomaly_tags.append("sales_drop")
            elif product.sales > product.last_week_sales * 1.25:
                insights.append("📈 Sales spiked >25% vs last week.")
                anomaly_tags.append("sales_spike")

        if product.stock <= 1 and product.next_restock_date:
            next_restock = pd.to_datetime(product.next_restock_date)
            days_left = (next_restock - pd.Timestamp.today()).days
            if days_left > 30:
                insights.append(f"🕒 Long restock delay: {days_left} days.")
                anomaly_tags.append("long_restock_delay")

        if product.last_restocked_date:
            days_since_restock = (pd.Timestamp.today() - pd.to_datetime(product.last_restocked_date)).days
            if days_since_restock > 45:
                insights.append(f"⚠️ Product hasn't been restocked in {days_since_restock} days.")
                anomaly_tags.append("not_restocked_recently")

        if product.stock < 5 and product.return_count > product.sales * 0.3 and product.rating < 3:
            insights.append("❌ Critical alert: Low stock, high returns, and poor rating!")
            anomaly_tags.append("critical_quality_issue")

        if is_anomaly and not insights:
            insights.append("⚠️ Detected statistical anomaly.")
            anomaly_tags.append("statistical")

        anomaly_description = (
            "Anomaly detected. " + " ".join(insights)
            if is_anomaly or insights
            else "✅ This product is behaving normally."
        )

        trend_score = trend_data.get("score", 0)
        trend_stock_note, recommended_extra_units = generate_trend_stock_note(trend_score, product.last_week_sales, product.stock)

        estimated_next_restock = None
        tracking = json.loads(product.restock_tracking) if product.restock_tracking else []
        if tracking:
            for stage in tracking:
                if stage.get("expected_arrival"):
                    estimated_next_restock = f"📦 ETA to customer: {stage['expected_arrival']}"
                    break

        supplier_score = 0
        return_ratio = 0
        if product.sales > 0:
            return_ratio = round(product.return_count / product.sales, 2)
            if return_ratio > 0.2:
                supplier_score -= 1
        if product.rating < 3:
            supplier_score -= 1
        if product.stock == 0:
            supplier_score -= 1

        supplier_change_msg = (
            "🔄 Consider changing supplier due to high returns, low rating, or stockouts."
            if supplier_score <= -2 else "✅ Supplier performance acceptable."
        )

        brand_advice = generate_brand_advice(product.brand_sentiment, product.recent_influencers, product.market_position)

        return jsonify({
            "product_id": product.product_id,
            "name": product.name,
            "category": product.category,
            "brand": product.brand,
            "supplier_name": product.supplier_name,
            "supplier_origin": product.supplier_origin,
            "supplier_certifications": product.supplier_certifications,
            "manufacture_date": str(product.manufacture_date),
            "expiry_date": str(product.expiry_date),
            "stock": product.stock,
            "next_restock_date": str(product.next_restock_date),
            "rating": product.rating,
            "return_count": product.return_count,
            "compliance_docs": product.compliance_docs,
            "size": product.size,
            "box_dimensions": product.box_dimensions,
            "sales": product.sales,
            "top_regions": product.top_regions,
            "recyclable": product.recyclable,
            "reusable": product.reusable,
            "reuse_info": product.reuse_info,
            "batch_number": product.batch_number,
            "brand_sentiment": product.brand_sentiment,
            "recent_influencers": product.recent_influencers,
            "market_position": product.market_position,
            "production_cost": product.production_cost,
            "retail_price": product.retail_price,
            "avg_margin": product.avg_margin,
            "reorder_prediction": product.reorder_prediction,
            "last_week_sales": product.last_week_sales,
            "anomaly_score": round(anomaly_score, 4),
            "is_anomalous": bool(is_anomaly),
            "anomaly_description": anomaly_description,
            "anomaly_tags": anomaly_tags,
            "trend_stock_note": trend_stock_note,
            "recommended_extra_units": recommended_extra_units,
            "estimated_next_restock": estimated_next_restock,
            "social_trend": trend_data,
            "restock_tracking": tracking,
            "supplier_analysis": {
                "score": supplier_score,
                "return_ratio": return_ratio,
                "change_recommendation": supplier_change_msg
            },
            "brand_dynamics": {
                "sentiment": product.brand_sentiment,
                "influencers": product.recent_influencers,
                "rank": product.market_position,
                "advice": brand_advice
            }
        })

    except Exception as e:
        print(f"❌ Error in get_product: {e}")
        return jsonify({"error": "Server error", "message": str(e)}), 500

# -----------------------------------------------
# TOP 5 RISKY PRODUCTS API
# -----------------------------------------------
@bp.route('/top-risky-products', methods=['GET'])
def top_risky_products():
    try:
        model = current_app.config['ANOMALY_MODEL']
        products = Product.query.all()
        risky = []

        for product in products:
            if None in (product.stock, product.sales, product.return_count, product.rating, product.avg_margin):
                continue

            input_df = pd.DataFrame(
                [[product.stock, product.sales, product.return_count, product.rating, product.avg_margin]],
                columns=FEATURE_COLUMNS
            )
            anomaly_score = model.decision_function(input_df)[0]
            is_anomaly = model.predict(input_df)[0] == -1

            if is_anomaly:
                risky.append({
                    "product_id": product.product_id,
                    "name": product.name,
                    "anomaly_score": round(anomaly_score, 4)
                })

        risky_sorted = sorted(risky, key=lambda x: x['anomaly_score'])
        top_5 = risky_sorted[:5]
        print("[DEBUG] Top risky products:", top_5)

        return jsonify(top_5)

    except Exception as e:
        print(f"❌ Error in top_risky_products: {e}")
        return jsonify({"error": "Server error", "message": str(e)}), 500
