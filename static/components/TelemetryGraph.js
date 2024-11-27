const TelemetryGraph = ({ data }) => {
    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = Recharts;
    
    return (
        <LineChart width={800} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="height" stroke="#8884d8" name="Height (cm)" />
            <Line type="monotone" dataKey="speed" stroke="#82ca9d" name="Speed (cm/s)" />
            <Line type="monotone" dataKey="error" stroke="#ff7300" name="Error (cm)" />
        </LineChart>
    );
};
