const App = () => {
    const [drones, setDrones] = React.useState({
        main: {
            id: 'main',
            position: { x: 0, y: 0, z: 0 },
            battery: 100,
            status: 'ready',
            isReal: true
        }
    });
    
    const [selectedDrone, setSelectedDrone] = React.useState('main');
    const [connected, setConnected] = React.useState(false);
    const [flightData, setFlightData] = React.useState([]);

    // Create digital twin for each drone
    React.useEffect(() => {
        const twins = {};
        Object.keys(drones).forEach(droneId => {
            if (drones[droneId].isReal) {
                twins[`${droneId}-twin`] = {
                    id: `${droneId}-twin`,
                    position: { ...drones[droneId].position },
                    battery: drones[droneId].battery,
                    status: drones[droneId].status,
                    isReal: false
                };
            }
        });
        setDrones(prev => ({ ...prev, ...twins }));
    }, []);

    const handleCommand = (droneId, command, params = {}) => {
        setDrones(prev => {
            const newDrones = { ...prev };
            const drone = newDrones[droneId];
            const twin = newDrones[`${droneId}-twin`];
            
            // Update real drone position
            switch(command) {
                case 'takeoff':
                    drone.position.z = 50;
                    drone.status = 'flying';
                    break;
                case 'land':
                    drone.position.z = 0;
                    drone.status = 'ready';
                    break;
                case 'forward':
                    drone.position.y += 10;
                    break;
                case 'back':
                    drone.position.y -= 10;
                    break;
                case 'left':
                    drone.position.x -= 10;
                    break;
                case 'right':
                    drone.position.x += 10;
                    break;
                case 'up':
                    drone.position.z += 10;
                    break;
                case 'down':
                    drone.position.z = Math.max(0, drone.position.z - 10);
                    break;
            }

            // Update digital twin with slight delay and error
            if (twin) {
                setTimeout(() => {
                    setDrones(prev => {
                        const newDrones = { ...prev };
                        const error = (Math.random() - 0.5) * 2; // Random error ±1cm
                        newDrones[`${droneId}-twin`].position = {
                            x: drone.position.x + error,
                            y: drone.position.y + error,
                            z: drone.position.z + error
                        };
                        return newDrones;
                    });
                }, 100);
            }

            return newDrones;
        });

        // Update flight data
        setFlightData(prev => [...prev, {
            timestamp: new Date().toLocaleTimeString(),
            droneId,
            command,
            position: drones[droneId].position,
            battery: drones[droneId].battery,
            status: drones[droneId].status
        }]);
    };

    const addDrone = () => {
        const droneId = `drone-${Object.keys(drones).filter(id => !id.includes('twin')).length}`;
        setDrones(prev => ({
            ...prev,
            [droneId]: {
                id: droneId,
                position: { x: Math.random() * 50, y: Math.random() * 50, z: 0 },
                battery: 100,
                status: 'ready',
                isReal: true
            }
        }));
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tello Drone Control</h1>
                <div className="flex gap-4">
                    <select 
                        value={selectedDrone}
                        onChange={(e) => setSelectedDrone(e.target.value)}
                        className="px-4 py-2 rounded border"
                    >
                        {Object.keys(drones)
                            .filter(id => drones[id].isReal)
                            .map(id => (
                                <option key={id} value={id}>Drone {id}</option>
                            ))
                        }
                    </select>
                    <button 
                        onClick={() => setConnected(!connected)}
                        className={`px-4 py-2 rounded ${connected ? 'bg-green-500' : 'bg-blue-500'} text-white`}
                    >
                        {connected ? 'Connected' : 'Connect'}
                    </button>
                    <button 
                        onClick={addDrone}
                        className="px-4 py-2 rounded bg-purple-500 text-white"
                    >
                        Add Drone
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <CommandPanel 
                    onCommand={handleCommand}
                    selectedDrone={selectedDrone}
                    isConnected={connected}
                />
                
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Visualization</h2>
                    <DroneVisualization drones={drones} selectedDrone={selectedDrone} />
                </div>
            </div>

            <div className="mt-6">
                <FlightData data={flightData} selectedDrone={selectedDrone} />
            </div>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
