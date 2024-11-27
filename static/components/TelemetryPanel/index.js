const TelemetryPanel = ({ drone }) => {
    const renderMetric = (label, value, unit) => (
        <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="telemetry-value">
                {value}{unit}
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">Live Telemetry</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {renderMetric('Height', drone.position.z, 'cm')}
                {renderMetric('Speed', drone.speed || 0, 'cm/s')}
                {renderMetric('Battery', drone.battery, '%')}
                {renderMetric('Temperature', drone.temperature || 25, '°C')}
            </div>

            <div className="mt-4">
                <h3 className="font-semibold mb-2">Status</h3>
                <div className="flex gap-4">
                    <div className={`px-2 py-1 rounded-full text-sm ${
                        drone.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                        Ready
                    </div>
                    <div className={`px-2 py-1 rounded-full text-sm ${
                        drone.status === 'flying' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                        Flying
                    </div>
                    <div className={`px-2 py-1 rounded-full text-sm ${
                        drone.battery < 20 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                        Battery
                    </div>
                </div>
            </div>
        </div>
    );
};
