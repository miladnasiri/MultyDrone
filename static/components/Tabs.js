const Tabs = ({ children, value, onChange }) => {
    return (
        <div className="border-b border-gray-200">
            <div className="flex space-x-4">
                {React.Children.map(children, child => 
                    React.cloneElement(child, { 
                        selected: child.props.value === value, 
                        onClick: () => onChange(child.props.value) 
                    })
                )}
            </div>
        </div>
    );
};

const Tab = ({ children, selected, onClick }) => {
    return (
        <button
            className={`py-2 px-4 border-b-2 ${selected ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
