from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

PAIR_PIP_VALUES = {
    "EURUSD": 10,
    "GBPUSD": 10,
    "USDJPY": 9.13,
    "USDCHF": 10,
    "AUDUSD": 10,
    "USDCAD": 10,
    "NZDUSD": 10,
    "EURGBP": 8.6,
}

def to_number(v):
    try:
        return float(str(v).replace(",", "."))
    except:
        return 0.0

@app.route("/api/calc", methods=["POST"])
def calc():
    data = request.json or {}
    balance = to_number(data.get("balance", 0))
    risk_percent = to_number(data.get("risk_percent", 0))
    stop_loss = to_number(data.get("stop_loss", 0))
    pair = (data.get("pair") or "").upper()
    custom_pip = to_number(data.get("custom_pip", 0))
    lot_step = to_number(data.get("lot_step", 0.01)) or 0.01

    money_risk = balance * (risk_percent / 100.0)
    pip_value = custom_pip if custom_pip > 0 else PAIR_PIP_VALUES.get(pair, 10)

    if stop_loss <= 0 or pip_value <= 0:
        return jsonify({"error": "stop_loss and pip_value must be > 0"}), 400

    raw_lots = money_risk / (stop_loss * pip_value)
    # floor to nearest step
    factor = int(1 / lot_step)
    floored = (int(raw_lots * factor)) / factor

    pip_value_for_position = pip_value * floored

    return jsonify({
        "balance": balance,
        "risk_percent": risk_percent,
        "money_risk": round(money_risk, 4),
        "stop_loss": stop_loss,
        "pair": pair,
        "pip_value_per_lot": pip_value,
        "lot_step": lot_step,
        "recommended_lot": round(floored, 5),
        "pip_value_position": round(pip_value_for_position, 5)
    })

if __name__ == "__main__":
    app.run(debug=True, port=5003)
