from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import threading
import time
import math

app = Flask(__name__, 
    static_folder='../static',
    template_folder='../templates')
CORS(app)

class MockDrone:
    def __init__(self):
        self.position = {'x': 0, 'y': 0, 'z': 0}
        self.battery = 100
        self.temperature = 25
        self.connected = False
        self.flying = False

    def connect(self):
        self.connected = True
        return True

    def takeoff(self):
        self.flying = True
        self.position['z'] = 100
        return True

    def land(self):
        self.flying = False
        self.position['z'] = 0
        return True

    def move(self, direction, distance):
        if not self.flying:
            return False
        if direction in ['up', 'down']:
            self.position['z'] += distance if direction == 'up' else -distance
        elif direction in ['left', 'right']:
            self.position['x'] += distance if direction == 'right' else -distance
        elif direction in ['forward', 'back']:
            self.position['y'] += distance if direction == 'forward' else -distance
        return True

    def get_position(self):
        return self.position

    def get_battery(self):
        # Simulate battery drain
        self.battery = max(0, self.battery - 0.1)
        return self.battery

    def get_temperature(self):
        return self.temperature

# Initialize Mock Drone
mock_drone = MockDrone()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/connect', methods=['POST'])
def connect():
    try:
        mock_drone.connect()
        return jsonify({
            'status': 'connected',
            'message': 'Successfully connected to simulated drone'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/command', methods=['POST'])
def command():
    cmd = request.json.get('command')
    try:
        if cmd == 'takeoff':
            mock_drone.takeoff()
        elif cmd == 'land':
            mock_drone.land()
        elif cmd in ['up', 'down', 'left', 'right', 'forward', 'back']:
            mock_drone.move(cmd, 20)
        
        position = mock_drone.get_position()
        return jsonify({
            'status': 'success',
            'position': position,
            'battery': mock_drone.get_battery()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/state', methods=['GET'])
def get_state():
    return jsonify({
        'position': mock_drone.get_position(),
        'battery': mock_drone.get_battery(),
        'temperature': mock_drone.get_temperature(),
        'connected': mock_drone.connected,
        'flying': mock_drone.flying
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
