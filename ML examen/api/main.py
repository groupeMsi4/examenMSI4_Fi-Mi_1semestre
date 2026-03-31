from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app) # Autorise les requêtes depuis le navigateur

# Charger les modèles au démarrage
model_win = pickle.load(open('models/model_x_wins.pkl', 'rb'))
model_draw = pickle.load(open('models/model_is_draw.pkl', 'rb'))

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json['vector']
    # Probabilités [P(0), P(1)] -> on prend P(1)
    p_win = model_win.predict_proba([data])[0][1]
    p_draw = model_draw.predict_proba([data])[0][1]
    
    return jsonify({
        'prob_win': float(p_win),
        'prob_draw': float(p_draw)
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)