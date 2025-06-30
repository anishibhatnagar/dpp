import os
import json
import random
from faker import Faker
from datetime import datetime, timedelta
from app import create_app
from extensions import db
from models import Product

fake = Faker()
app = create_app()

CATEGORIES = ["Wearables", "Home Appliances", "Electronics", "Toys", "Furniture"]
BRANDS = ["FitWear", "TechNova", "GadgetPro", "SmartHome", "PlayTime"]
SUPPLIERS = ["SmartTech Ltd.", "NovaSupply", "GlobalTraders", "EcoMakers", "UrbanEdge"]
CERTIFICATIONS = ["ISO9001", "ISO14001", "RoHS", "CE"]
SENTIMENTS = ["Positive", "Neutral", "Negative"]
REGIONS = ["California", "Texas", "New York", "Florida", "Illinois"]
INFLUENCERS = ["TechGuruYT", "GadgetQueen", "HomeHero", "ToyMaster", "FitFanatic"]


def random_tracking():
    stages = [
        {"stage": "Left factory", "timestamp": (datetime.now() - timedelta(days=10)).strftime("%Y-%m-%d")},
        {"stage": "In transit", "timestamp": (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d")},
        {"stage": "Arrived at DC", "timestamp": datetime.now().strftime("%Y-%m-%d")}
    ]
    return json.dumps(stages)


def generate_product(index):
    category = random.choice(CATEGORIES)
    brand = random.choice(BRANDS)
    supplier = random.choice(SUPPLIERS)
    certifications = random.choice(CERTIFICATIONS)
    regions = ", ".join(random.sample(REGIONS, 2))
    influencers = ", ".join(random.sample(INFLUENCERS, 2))

    return Product(
        product_id=f"PROD-2025-{str(index).zfill(5)}",
        name=fake.word().capitalize() + " " + category,
        category=category,
        brand=brand,
        supplier_name=supplier,
        supplier_origin=fake.country(),
        supplier_certifications=certifications,
        manufacture_date=fake.date_between(start_date='-3y', end_date='-1y').strftime("%Y-%m-%d"),
        expiry_date=fake.date_between(start_date='+1y', end_date='+3y').strftime("%Y-%m-%d"),
        stock=random.randint(0, 200),
        next_restock_date=fake.future_date(end_date='+30d').strftime("%Y-%m-%d"),
        last_restocked_date=fake.date_between(start_date='-60d', end_date='-1d').strftime("%Y-%m-%d"),
        sales=random.randint(0, 500),
        last_week_sales=random.randint(0, 100),
        return_count=random.randint(0, 30),
        rating=round(random.uniform(1.5, 5.0), 1),
        avg_margin=round(random.uniform(10.0, 60.0), 2),
        reorder_prediction=random.choice(["Likely reorder soon", "No reorder needed", "Reorder in 1 week"]),
        compliance_docs=f"{certifications}.pdf",
        restock_tracking=random_tracking(),
        batch_number=fake.bothify(text='BATCH-####'),
        size=random.choice(["Small", "Medium", "Large"]),
        box_dimensions=f"{random.randint(10,30)}x{random.randint(10,30)}x{random.randint(5,15)} cm",
        recyclable=random.choice(["Yes", "No"]),
        reusable=random.choice(["Yes", "No"]),
        reuse_info="Battery removable" if random.random() > 0.5 else "Parts replaceable",
        brand_sentiment=random.choice(SENTIMENTS),
        recent_influencers=influencers,
        market_position=random.choice(["Top 5", "Mid-range", "Low performer"]),
        production_cost=round(random.uniform(30.0, 150.0), 2),
        retail_price=round(random.uniform(50.0, 200.0), 2),
        top_regions=regions
    )


if __name__ == '__main__':
    with app.app_context():
        print("📦 Inserting 10,000 sample products...")
        db.create_all()

        for i in range(1, 10001):
            product = generate_product(i)
            db.session.add(product)
            if i % 500 == 0:
                db.session.commit()
                print(f"✅ Inserted {i} products")

        db.session.commit()
        print("🎉 Done inserting 10k sample products!")
