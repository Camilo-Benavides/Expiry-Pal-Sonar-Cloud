# ExpiryPalNext ML Service

Machine Learning module for object detection and comparison in smart refrigerators.

## Structure

```
ML/
├── app.py                    # Main Flask application
├── requirements.txt          # Python dependencies
├── env.example              # Environment variables
├── templates/
│   └── index_dynamic.html   # Web interface
├── picture/                 # Test images
├── results/                 # Processing results
├── extracted_items.json     # Extracted items cache
└── items_storage.json       # Local storage
```

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables:
```bash
cp env.example .env
# Edit .env with your configurations
```

3. Run the service:
```bash
python app.py
```

The service will be available at `http://localhost:5001`

## Development

This module will be developed during the project sprints. ML functionalities will be implemented according to the Product Backlog.