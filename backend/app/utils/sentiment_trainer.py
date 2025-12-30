import pandas as pd
import joblib
import os
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from app.utils.text_cleaner import clean_text

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_PATH = os.path.join(DATA_DIR, "sentiment_model.pkl")
SEED_DATA_PATH = os.path.join(DATA_DIR, "sentiment_seed.csv")

class SentimentModel:
    def __init__(self):
        self.model = None
        self.is_loaded = False

    def load_model(self):
        """Load the trained model from disk."""
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                self.is_loaded = True
                print(f"Model loaded successfully from {MODEL_PATH}")
                return True
            except Exception as e:
                print(f"Error loading model: {e}")
                return False
        else:
            print("Model file not found. Please train the model first.")
            return False

    def train(self, use_seed=True, extra_data=None):
        """
        Train the Logistic Regression model with TF-IDF.
        
        Args:
            use_seed (bool): Whether to use the seed CSV data.
            extra_data (list of dict): Optional list of {'text': str, 'label': str} to add to training.
        """
        df_list = []

        # 1. Load Seed Data
        if use_seed and os.path.exists(SEED_DATA_PATH):
            try:
                seed_df = pd.read_csv(SEED_DATA_PATH)
                df_list.append(seed_df)
                print(f"Loaded {len(seed_df)} records from seed data.")
            except Exception as e:
                print(f"Error loading seed data: {e}")

        # 2. Add Extra Data (from DB or other sources)
        if extra_data:
            extra_df = pd.DataFrame(extra_data)
            if 'text' in extra_df.columns and 'label' in extra_df.columns:
                df_list.append(extra_df)
                print(f"Added {len(extra_df)} records from extra data.")

        if not df_list:
            print("No training data available.")
            return False

        # Combine Data
        full_df = pd.concat(df_list, ignore_index=True)
        
        # Preprocessing
        print("Preprocessing training data...")
        full_df['clean_text'] = full_df['text'].apply(lambda x: clean_text(str(x)))
        
        # Split Data (for validation metric)
        X_train, X_test, y_train, y_test = train_test_split(
            full_df['clean_text'], 
            full_df['label'], 
            test_size=0.2, 
            random_state=42,
            stratify=full_df['label']  # Ensure balanced split
        )

        # Create Pipeline
        # TF-IDF: 
        # - ngram_range=(1,2) captures unigrams and bigrams (good for "tidak bagus")
        # - min_df=1 ensures we keep terms even if they appear once (small dataset)
        pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2), min_df=1, max_features=5000)),
            ('clf', LogisticRegression(solver='lbfgs', max_iter=1000, random_state=42))
        ])

        # Train
        print("Training model...")
        pipeline.fit(X_train, y_train)

        # Validate
        preds = pipeline.predict(X_test)
        acc = accuracy_score(y_test, preds)
        print(f"Model Accuracy on Test Set: {acc:.4f}")
        print(classification_report(y_test, preds))

        # Save Model
        try:
            joblib.dump(pipeline, MODEL_PATH)
            self.model = pipeline
            self.is_loaded = True
            print(f"Model saved to {MODEL_PATH}")
            return True
        except Exception as e:
            print(f"Error saving model: {e}")
            return False

    def predict(self, text):
        """
        Predict sentiment for a single text.
        Returns dict with label, score (probability), and confidence.
        """
        if not self.is_loaded:
            if not self.load_model():
                return None

        cleaned = clean_text(text)
        if not cleaned:
             return {
                "label": "Neutral",
                "score": 0.5,
                "confidence": "Low"
            }

        try:
            # Get probabilities
            probs = self.model.predict_proba([cleaned])[0]
            classes = self.model.classes_
            
            # Find max probability
            max_prob = max(probs)
            max_index = probs.argmax()
            label = classes[max_index]

            # Determine confidence
            confidence = "Low"
            if max_prob > 0.8:
                confidence = "High"
            elif max_prob > 0.6:
                confidence = "Medium"

            return {
                "label": label,
                "score": float(max_prob), # Return the probability of the winning class
                "confidence": confidence
            }
        except Exception as e:
            print(f"Prediction error: {e}")
            return None

# Singleton instance
sentiment_analyzer = SentimentModel()
