const createDroneScene = (container) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x1a1a1a);
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(ambientLight);
    scene.add(directionalLight);
    
    // Grid
    const grid = new THREE.GridHelper(200, 20, 0x888888, 0x444444);
    scene.add(grid);
    
    // Camera position
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);
    
    // Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    return {
        scene,
        camera,
        renderer,
        controls,
        container,
        dispose: () => {
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
        }
    };
};

const createDroneMesh = (color) => {
    const group = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(5, 2, 5);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color,
        shininess: 100,
        specular: 0x666666
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);
    
    // Propellers
    const propGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 8);
    const propMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
        shininess: 100
    });
    
    const positions = [
        { x: -2.5, z: -2.5 },
        { x: -2.5, z: 2.5 },
        { x: 2.5, z: -2.5 },
        { x: 2.5, z: 2.5 }
    ];
    
    positions.forEach(pos => {
        const prop = new THREE.Mesh(propGeometry, propMaterial);
        prop.position.set(pos.x, 1, pos.z);
        group.add(prop);
    });
    
    return group;
};

const createPathLine = (points) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, p.z, p.y))
    );
    const material = new THREE.LineBasicMaterial({
        color: 0x00ff00,
        linewidth: 2
    });
    return new THREE.Line(geometry, material);
};
