from extensions import db

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.String, unique=True, nullable=False)
    name = db.Column(db.String)
    category = db.Column(db.String)
    brand = db.Column(db.String)

    # Supplier Info
    supplier_name = db.Column(db.String)
    supplier_origin = db.Column(db.String)
    supplier_certifications = db.Column(db.String)

    # Manufacturing & Expiry
    manufacture_date = db.Column(db.String)
    expiry_date = db.Column(db.String)

    # Inventory & Sales
    stock = db.Column(db.Integer)
    next_restock_date = db.Column(db.String)
    sales = db.Column(db.Integer)
    last_week_sales = db.Column(db.Integer)
    return_count = db.Column(db.Integer)
    rating = db.Column(db.Float)
    avg_margin = db.Column(db.Float)
    reorder_prediction = db.Column(db.String)

    # Logistics & Compliance
    compliance_docs = db.Column(db.String)
    restock_tracking = db.Column(db.Text)  # Stored as JSON string
    batch_number = db.Column(db.String)
    size = db.Column(db.String)
    box_dimensions = db.Column(db.String)

    # Sustainability
    recyclable = db.Column(db.String)
    reusable = db.Column(db.String)
    reuse_info = db.Column(db.String)
    last_restocked_date = db.Column(db.String)  # or db.Date if you want proper dates


    # Brand Dynamics
    brand_sentiment = db.Column(db.String)
    recent_influencers = db.Column(db.String)
    market_position = db.Column(db.String)

    # Cost Info
    production_cost = db.Column(db.Float)
    retail_price = db.Column(db.Float)

    # Region Popularity
    top_regions = db.Column(db.String)

    def __repr__(self):
        return f"<Product {self.product_id} - {self.name}>"
