const canvas = document.getElementById('d4Canvas');
const container = document.querySelector('.addD4');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

let d4Mesh;
let isSpinning = false;
let spinSpeed = 0;

function init() {
    const size = container.offsetHeight;
    renderer.setSize(size * 0.9, size * 0.9);
    
    const geometry = new THREE.TetrahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({
        color: 0xc85a3a,
        roughness: 0.5,
        metalness: 0.3,
        flatShading: true
    });
    
    d4Mesh = new THREE.Mesh(geometry, material);
    scene.add(d4Mesh);
    
    // Add edges for better visibility
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x2a1510, linewidth: 2 });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    d4Mesh.add(wireframe);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Camera position
    camera.position.z = 3;
    
    // Start animation
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    if (!isSpinning) {
    } else {
        // Spin animation
        d4Mesh.rotation.x += spinSpeed;
        d4Mesh.rotation.y += spinSpeed * 1.3;
        spinSpeed *= 0.95; 
        
        if (spinSpeed < 0.01) {
            isSpinning = false;
            spinSpeed = 0;
        }
    }
    
    renderer.render(scene, camera);
}

function startSpin() {
    isSpinning = true;
    spinSpeed = 0.3;
}

container.addEventListener('click', () => {
    startSpin();
});

// Handle window resize
window.addEventListener('resize', () => {
    const size = container.offsetHeight;
    renderer.setSize(size * 0.9, size * 0.9);
});

// Initialize when DOM is ready
init();
