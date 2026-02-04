// Universal 3D Dice System
// D10 geometry based on: https://aqandrew.com/blog/10-sided-die-react/
// Pentagonal Trapezohedron (D10) Geometry
function createD10Geometry(radius = 1) {
    const sides = 10;
    const vertices = [0, 0, 1, 0, 0, -1];
    for (let i = 0; i < sides; i++) {
        const b = (i * Math.PI * 2) / sides;
        vertices.push(-Math.cos(b) * radius, -Math.sin(b) * radius, 0.105 * radius * (i % 2 ? 1 : -1));
    }
    const faces = [
        0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 7,
        0, 7, 8, 0, 8, 9, 0, 9, 10, 0, 10, 11, 0, 11, 2,
        1, 3, 2, 1, 4, 3, 1, 5, 4, 1, 6, 5, 1, 7, 6,
        1, 8, 7, 1, 9, 8, 1, 10, 9, 1, 11, 10, 1, 2, 11,
    ];
    
    return new THREE.PolyhedronGeometry(vertices, faces, radius, 0);
}

class Dice3D {
    constructor(canvasId, containerClass, diceType, color = 0xc85a3a) {
        this.canvas = document.getElementById(canvasId);
        this.container = document.querySelector(containerClass);
        this.diceType = diceType;
        this.color = color;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        
        this.mesh = null;
        this.isSpinning = false;
        this.spinSpeed = 0;
        
        this.init();
    }
    
    getGeometry() {
        switch(this.diceType) {
            case 'd2': return new THREE.CylinderGeometry(0.8, 0.8, 0.2, 16);
            case 'd4': return new THREE.TetrahedronGeometry(1, 0);
            case 'd6': return new THREE.BoxGeometry(1, 1, 1);
            case 'd8': return new THREE.OctahedronGeometry(1, 0);
            case 'd10': return createD10Geometry(1);
            case 'd12': return new THREE.DodecahedronGeometry(1, 0);
            case 'd20': return new THREE.IcosahedronGeometry(1, 0);
            case 'd100': return new THREE.IcosahedronGeometry(1, 2);
            default: return new THREE.TetrahedronGeometry(1, 0);
        }
    }
    
    init() {
        const size = this.container.offsetHeight;
        this.renderer.setSize(size * 0.9, size * 0.9);
        
        const geometry = this.getGeometry();
        const material = new THREE.MeshStandardMaterial({
            color: this.color,
            roughness: 0.5,
            metalness: 0.3,
            flatShading: true
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
        
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x2a1510, linewidth: 2 });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);
        this.mesh.add(wireframe);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        this.camera.position.z = 3;
        
        this.container.addEventListener('click', () => this.startSpin());
        
        window.addEventListener('resize', () => {
            const size = this.container.offsetHeight;
            this.renderer.setSize(size * 0.9, size * 0.9);
        });
    
        this.animate();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.isSpinning) {
            //this.mesh.rotation.x += 0.002;
            //this.mesh.rotation.y += 0.002;
            //this.mesh.rotation.z += 0.002;
        } else {
            this.mesh.rotation.x += this.spinSpeed;
            this.mesh.rotation.y += this.spinSpeed * 1.3;
            this.spinSpeed *= 0.95; 
            
            if (this.spinSpeed < 0.01) {
                this.isSpinning = false;
                this.spinSpeed = 0;
            }
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    startSpin() {
        this.isSpinning = true;
        this.spinSpeed = 0.3;
    }
    
    resize() {
        const size = this.container.offsetHeight;
        this.renderer.setSize(size * 0.9, size * 0.9);
    }
}

let diceInstances = [];
document.addEventListener('DOMContentLoaded', () => {
    const savedColors = JSON.parse(localStorage.getItem('diceColors') || '{}');
    const defaultColors = {
        duality1: 0x9370DB,  
        duality2: 0xFFD700 
    };
    
    const diceColors = { ...defaultColors, ...savedColors };
    
    const diceConfigs = [
        { canvas: 'd2Canvas', container: '.addD2', type: 'd2'},
        { canvas: 'd4Canvas', container: '.addD4', type: 'd4'},
        { canvas: 'd6Canvas', container: '.addD6', type: 'd6'},
        { canvas: 'd8Canvas', container: '.addD8', type: 'd8'},
        { canvas: 'd10Canvas', container: '.addD10', type: 'd10'},
        { canvas: 'd12Canvas', container: '.addD12', type: 'd12'},
        { canvas: 'd20Canvas', container: '.addD20', type: 'd20'},
        { canvas: 'd100Canvas', container: '.addD100', type: 'd100'},
        { canvas: '2d12Canvas1', container: '.addDuality', type: 'd12', color: diceColors.duality1 },
        { canvas: '2d12Canvas2', container: '.addDuality', type: 'd12', color: diceColors.duality2 }
    ];
    
    setTimeout(() => {
        diceConfigs.forEach(config => {
            if (document.getElementById(config.canvas)) {
                const dice = new Dice3D(config.canvas, config.container, config.type, config.color);
                diceInstances.push(dice);
            }
        });
    }, 100);
});

