# Use a lightweight Python base image instead of the full Playwright image
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies required for Playwright and general build
# We clean up apt lists to save space
RUN apt-get update && apt-get install -y \
    wget \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install ONLY Chromium browser for Playwright (saves space vs full install)
# and its system dependencies
RUN playwright install chromium --with-deps

# Install NLTK data (minimal)
RUN python -m nltk.downloader stopwords punkt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
