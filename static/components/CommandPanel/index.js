const CommandPanel = ({ onCommand, selectedDrone, isConnected }) => {
    const [sequence, setSequence] = React.useState([]);
    const [speed, setSpeed] = React.useState(50);

    const commands = [
        { id: 'takeoff', label: '⬆️ Take Off', color: 'bg-blue-500' },
        { id: 'land', label: '⬇️ Land', color: 'bg-red-500' },
        { id: 'forward', label: '↑ Forward', color: 'bg-gray-200' },
        { id: 'back', label: '↓ Back', color: 'bg-gray-200' },
        { id: 'left', label: '← Left', color: 'bg-gray-200' },
        { id: 'right', label: '→ Right', color: 'bg-gray-200' },
        { id: 'up', label: '⤴️ Up', color: 'bg-gray-200' },
        { id: 'down', label: '⤵️ Down', color: 'bg-gray-200' }
    ];

    const handleCommand = (cmd) => {
        if (!isConnected) return;
        onCommand(selectedDrone, cmd, { speed });
    };

    const handleSequence = () => {
        sequence.forEach((cmd, index) => {
            setTimeout(() => handleCommand(cmd), index * 1000);
        });
        setSequence([]);
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Flight Controls - Drone {selectedDrone}</h2>
                <div className="flex items-center gap-2">
                    <label className="text-sm">Speed</label>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-24"
                    />
                    <span className="text-sm font-mono">{speed}cm/s</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
                {commands.map(cmd => (
                    <button
                        key={cmd.id}
                        onClick={() => handleCommand(cmd.id)}
                        disabled={!isConnected}
                        className={`${cmd.color} command-button ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {cmd.label}
                    </button>
                ))}
            </div>

            <div className="mt-4">
                <h3 className="font-semibold mb-2">Command Sequence</h3>
                <div className="flex gap-2 flex-wrap mb-2">
                    {commands.map(cmd => (
                        <button
                            key={`seq-${cmd.id}`}
                            onClick={() => setSequence([...sequence, cmd.id])}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                        >
                            {cmd.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 p-2 rounded min-h-[40px]">
                        {sequence.map((cmd, idx) => {
                            const command = commands.find(c => c.id === cmd);
                            return command ? (
                                <span key={idx} className="inline-block px-2 py-1 bg-blue-500 text-white rounded mr-1 mb-1">
                                    {command.label}
                                </span>
                            ) : null;
                        })}
                    </div>
                    <button
                        onClick={handleSequence}
                        disabled={sequence.length === 0 || !isConnected}
                        className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        Execute
                    </button>
                    <button
                        onClick={() => setSequence([])}
                        disabled={sequence.length === 0}
                        className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};
