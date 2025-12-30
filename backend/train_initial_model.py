from app.utils.sentiment_trainer import sentiment_analyzer

if __name__ == "__main__":
    print("Starting initial model training...")
    success = sentiment_analyzer.train(use_seed=True)
    if success:
        print("Initial model training completed successfully.")
    else:
        print("Initial model training failed.")
