import csv
from app import create_app
from extensions import db
from models import Product

app = create_app()

def to_bool(val):
    return val.strip().upper() == 'TRUE'

def to_int_safe(val):
    try:
        return int(val)
    except:
        return 0

def to_float_safe(val):
    try:
        return float(val)
    except:
        return 0.0

with app.app_context():
    db.drop_all()
    db.create_all()

    with open('products.csv', 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                product = Product(
                    product_id=row['Product ID'],
                    name=row['Name'],
                    category=row['Category'],
                    brand=row['Brand'],
                    supplier_name=row['Supplier Name'],
                    supplier_origin=row['Supplier Origin'],
                    supplier_certifications=row['Supplier Certifications'],
                    manufacture_date=row['Manufacture Date'],
                    expiry_date=row['Expiry Date'],
                    stock=1 if row['In Stock'].strip().upper() == 'TRUE' else 0,
                    next_restock_date=row['Next Restock Date'],
                    rating=to_float_safe(row['Rating']),
                    return_count=to_int_safe(row['Return Count']),
                    compliance_docs=row['Compliance Docs'],
                    size=row['Size'],
                    box_dimensions=row['Box Dimensions'],
                    sales=to_int_safe(row['Total Units Sold']),
                    top_regions=row['Top Regions'],
                    recyclable=row['Recyclable'],
                    reusable=row['Reusable'],
                    reuse_info=row['Reuse Info'],
                    batch_number=row['Batch Number'],
                    brand_sentiment=row['Brand Sentiment'],
                    recent_influencers=row['Recent Influencers'],
                    market_position=row['Market Position'],
                    production_cost=to_float_safe(row['Production Cost per Unit']),
                    retail_price=to_float_safe(row['Retail Price']),
                    avg_margin=to_float_safe(row['Average Margin (%)']),
                    reorder_prediction = row['Reorder Prediction']

                )
                db.session.add(product)
            except Exception as e:
                print(f"⚠️ Skipped row due to error: {e}")

        db.session.commit()
        print("✅ Products loaded successfully.")
