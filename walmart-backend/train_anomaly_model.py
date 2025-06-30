import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
from sqlalchemy import create_engine

# Load DB
engine = create_engine('sqlite:///instance/products.db')
df = pd.read_sql('SELECT * FROM product', con=engine)

# Filter for relevant features
FEATURE_COLUMNS = ['stock', 'sales', 'return_count', 'rating', 'avg_margin']
df = df[FEATURE_COLUMNS].dropna()

# Train Isolation Forest
model = IsolationForest(contamination=0.05, random_state=42)
model.fit(df)

# ✅ Save both model and feature names
model.feature_names_in_ = FEATURE_COLUMNS  # <--- ADD THIS LINE

# Save model
joblib.dump(model, 'anomaly_detector.pkl')
print("✅ Isolation Forest model trained and saved.")
