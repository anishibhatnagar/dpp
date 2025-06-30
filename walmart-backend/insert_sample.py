# insert_sample.py

from app import create_app
from extensions import db
from models import Product
import json

app = create_app()

with app.app_context():
    db.create_all()

    sample = Product(
        product_id="PROD-2025-00009",
        name="Sample Smartwatch",
        category="Wearables",
        brand="FitWear",
        supplier_name="SmartTech Ltd.",
        supplier_origin="USA",
        supplier_certifications="ISO14001",
        manufacture_date="2025-01-15",
        expiry_date="2027-01-15",
        stock=50,
        sales=120,
        last_week_sales=150,
        return_count=12,
        rating=3.8,
        avg_margin=22.5,
        reorder_prediction="Likely reorder in 1 week",
        restock_tracking=json.dumps([
            {"stage": "Left factory", "timestamp": "2025-06-22"},
            {"stage": "In transit", "timestamp": "2025-06-25"}
        ]),
        next_restock_date="2025-07-02",
        last_restocked_date="2025-06-01",
        compliance_docs="ISO.pdf",
        batch_number="BWX-2025-09",
        size="Medium",
        box_dimensions="10x10x4 cm",
        recyclable="Yes",
        reusable="Yes",
        reuse_info="Battery removable and rechargeable",
        brand_sentiment="Positive",
        recent_influencers="TechGuruYT, GadgetQueen",
        market_position="Top 5 in wearables",
        production_cost=70.0,
        retail_price=99.99,
        top_regions="California, Texas, New York"
    )

    db.session.add(sample)
    db.session.commit()
    print("✅ Sample product inserted successfully!")
