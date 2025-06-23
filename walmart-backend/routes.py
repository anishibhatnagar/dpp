from flask import Blueprint, jsonify
from models import Product

bp = Blueprint('api', __name__)

@bp.route('/api/product/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.filter_by(product_id=product_id).first()
        if not product:
            return jsonify({"error": "Product not found"}), 404

        # Return all fields in dictionary format
        return jsonify({
            "product_id": product.product_id,
            "name": product.name,
            "category": product.category,
            "brand": product.brand,
            "supplier_name": product.supplier_name,
            "supplier_origin": product.supplier_origin,
            "supplier_certifications": product.supplier_certifications,
            "manufacture_date": product.manufacture_date,
            "expiry_date": product.expiry_date,
            "stock": product.stock,
            "next_restock_date": product.next_restock_date,
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
            "reorder_prediction": product.reorder_prediction
        })
    except Exception as e:
        return jsonify({"error": "Server error", "message": str(e)}), 500
