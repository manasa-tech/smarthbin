
from flask import Flask, jsonify
from flask_cors import CORS

from database import init_db
from routes.bins import bins_bp
from routes.dashboard import dashboard_bp
from routes.reports import reports_bp
from routes.assistant import assistant_bp

app = Flask(__name__)

# Allow requests from your React + Vite frontend
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            ]
        }
    }
)

# Register API routes
app.register_blueprint(bins_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(reports_bp)
app.register_blueprint(assistant_bp)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "name": "Automated Smart Bin API",
        "status": "running"
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy"
    })


if __name__ == "__main__":
    init_db()
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
