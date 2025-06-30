import sqlite3
import json
from datetime import datetime, timedelta

# Path to your products.db
db_path = 'instance/products.db'

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Mock restock tracking generator
def generate_tracking(index):
    base_date = datetime(2025, 6, 25) + timedelta(days=(index % 10))
    tracking = [
        {"stage": "Warehouse", "status": "Dispatched", "timestamp": (base_date).strftime("%Y-%m-%d")},
        {"stage": "In Transit", "status": "On the way to Walmart DC", "timestamp": (base_date + timedelta(days=1)).strftime("%Y-%m-%d")},
        {"stage": "Walmart DC", "status": "Arrived", "timestamp": (base_date + timedelta(days=2)).strftime("%Y-%m-%d")},
        {"stage": "Store", "status": "Stocked", "timestamp": (base_date + timedelta(days=3)).strftime("%Y-%m-%d")}
    ]
    return json.dumps(tracking)

# Get all product_ids
cursor.execute("SELECT product_id FROM Product")
product_ids = [row[0] for row in cursor.fetchall()]

# Update each record
for idx, pid in enumerate(product_ids):
    tracking_json = generate_tracking(idx)
    cursor.execute("UPDATE Product SET restock_tracking = ? WHERE product_id = ?", (tracking_json, pid))

# Save changes
conn.commit()
conn.close()

print(f"✅ Updated restock_tracking for {len(product_ids)} products.")
