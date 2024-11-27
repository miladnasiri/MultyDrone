const DroneVisualization = ({ drones, path }) => {
    const containerRef = React.useRef(null);
    const [scene, setScene] = React.useState(null);
    const [camera, setCamera] = React.useState(null);
    const [renderer, setRenderer] = React.useState(null);

    React.useEffect(() => {
        if (!containerRef.current) return;

        // Setup
        const newScene = new THREE.Scene();
        const newCamera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
        const newRenderer = new THREE.WebGLRenderer({ antialias: true });
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        newScene.add(ambientLight);
        newScene.add(directionalLight);

        // Setup scene
        newScene.background = new THREE.Color(0x1a1a1a);
        newRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.appendChild(newRenderer.domElement);

        // Add grid
        const grid = new THREE.GridHelper(100, 10, 0x888888, 0x444444);
        newScene.add(grid);

        // Position camera
        newCamera.position.set(50, 50, 50);
        newCamera.lookAt(0, 0, 0);

        // Add OrbitControls
        const controls = new THREE.OrbitControls(newCamera, newRenderer.domElement);
        controls.enableDamping = true;

        setScene(newScene);
        setCamera(newCamera);
        setRenderer(newRenderer);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            newRenderer.render(newScene, newCamera);
        };
        animate();

        return () => {
            containerRef.current?.removeChild(newRenderer.domElement);
        };
    }, []);

    // Update drone positions
    React.useEffect(() => {
        if (!scene || !camera || !renderer || !drones) return;

        // Clear previous drones
        scene.children = scene.children.filter(child => 
            child.type === 'GridHelper' || 
            child.type === 'AmbientLight' || 
            child.type === 'DirectionalLight'
        );

        // Add drones
        Object.entries(drones).forEach(([id, drone]) => {
            const droneGeometry = new THREE.BoxGeometry(5, 2, 5);
            const droneMaterial = new THREE.MeshPhongMaterial({ 
                color: id === 'main' ? 0x4285f4 : 0xff4444,
                shininess: 100
            });
            const droneMesh = new THREE.Mesh(droneGeometry, droneMaterial);
            droneMesh.position.set(
                drone.position.x,
                drone.position.z,
                drone.position.y
            );
            scene.add(droneMesh);
        });

        // Add path
        if (path && path.length > 1) {
            const pathGeometry = new THREE.BufferGeometry().setFromPoints(
                path.map(point => new THREE.Vector3(point.x, point.z, point.y))
            );
            const pathMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
            const pathLine = new THREE.Line(pathGeometry, pathMaterial);
            scene.add(pathLine);
        }
    }, [scene, camera, renderer, drones, path]);

    return (
        <div 
            ref={containerRef} 
            className="visualization-container"
            style={{ height: '400px', width: '100%' }} 
        />
    );
};
