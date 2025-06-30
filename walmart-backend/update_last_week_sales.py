import sqlite3

# Connect to your SQLite DB
conn = sqlite3.connect("instance/products.db")
cursor = conn.cursor()

# Step 1.1: Add the new column to the Product table
try:
    cursor.execute("ALTER TABLE Product ADD COLUMN last_week_sales INTEGER;")
    print("✅ Column added.")
except sqlite3.OperationalError:
    print("⚠️ Column already exists.")

# Step 1.2: Populate last_week_sales with dummy data (90% of total sales as a placeholder)
cursor.execute("UPDATE Product SET last_week_sales = CAST(sales * 0.9 AS INTEGER);")

# Commit and close
conn.commit()
conn.close()

print("✅ last_week_sales values populated.")
