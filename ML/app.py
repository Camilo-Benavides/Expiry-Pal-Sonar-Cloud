"""
ExpiryPalNext ML Service - Object Detection and Comparison
"""
from flask import Flask

app = Flask(__name__)

@app.route('/')
def health_check():
    return {'status': 'ok', 'service': 'ExpiryPalNext ML Service'}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)