const DroneVisualization = ({ drones, path, selectedDrone }) => {
    const containerRef = React.useRef(null);
    const sceneRef = React.useRef(null);
    const frameRef = React.useRef(null);

    React.useEffect(() => {
        if (!containerRef.current) return;

        // Initialize scene
        sceneRef.current = createDroneScene(containerRef.current);
        
        // Animation loop
        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);
            sceneRef.current.controls.update();
            sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
        };
        animate();

        // Cleanup
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
            if (sceneRef.current) {
                sceneRef.current.dispose();
            }
        };
    }, []);

    // Update drone positions and paths
    React.useEffect(() => {
        if (!sceneRef.current) return;

        const { scene } = sceneRef.current;

        // Clear previous drones and paths
        scene.children = scene.children.filter(child => 
            child.type === 'GridHelper' || 
            child.type === 'AmbientLight' || 
            child.type === 'DirectionalLight'
        );

        // Add drones
        Object.entries(drones).forEach(([id, drone]) => {
            const droneMesh = createDroneMesh(
                id === selectedDrone ? 0x4285f4 : 0xff4444
            );
            
            droneMesh.position.set(
                drone.position.x,
                drone.position.z,
                drone.position.y
            );
            
            // Add highlight for selected drone
            if (id === selectedDrone) {
                const highlightGeometry = new THREE.RingGeometry(6, 7, 32);
                const highlightMaterial = new THREE.MeshBasicMaterial({
                    color: 0x4285f4,
                    side: THREE.DoubleSide
                });
                const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
                highlight.rotation.x = -Math.PI / 2;
                highlight.position.copy(droneMesh.position);
                scene.add(highlight);
            }

            scene.add(droneMesh);
        });

        // Add flight paths
        if (path && path.length > 1) {
            const pathLine = createPathLine(path);
            scene.add(pathLine);
        }
    }, [drones, path, selectedDrone]);

    // Handle window resize
    React.useEffect(() => {
        const handleResize = () => {
            if (!sceneRef.current || !containerRef.current) return;

            const { camera, renderer } = sceneRef.current;
            const container = containerRef.current;

            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="visualization-container">
            <div 
                ref={containerRef}
                className="w-full h-96 rounded-lg overflow-hidden"
            />
            <div className="mt-2 flex justify-between text-sm text-gray-600">
                <div>Use mouse to rotate • Scroll to zoom</div>
                <div>{Object.keys(drones).length} drones active</div>
            </div>
        </div>
    );
};
