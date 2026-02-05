const coinMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFFD700, 
    roughness: 0.4, 
    metalness: 0.8,
    flatShading: true 
});

let handvollCount = localStorage.getItem('handvoll') ? parseInt(localStorage.getItem('handvoll')) : 0;
let bagCount = localStorage.getItem('beutel') ? parseInt(localStorage.getItem('beutel')) : 0;
let chestCount = localStorage.getItem('kisten') ? parseInt(localStorage.getItem('kisten')) : 0;


class Money3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.container = canvas.parentElement;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
        this.coins = [];
        this.gravity = -0.015;
        this.floorY = -2;
        
        this.init();
    }

    init() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        
        if (width === 0 || height === 0) {
            // Container not visible yet, skip initialization
            return;
        }
        
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.camera.position.set(0, 1, 6);
        this.camera.lookAt(0, 0, 0);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        // Create floor
        const floorGeometry = new THREE.PlaneGeometry(10, 10);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8b7355, 
            roughness: 0.8,
            metalness: 0.2,
            transparent: true,
            opacity: 0
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = this.floorY;
        this.scene.add(floor);

        // Create multiple coins
        
        let coinCount = handvollCount * 5 + bagCount * 50 + chestCount * 500;


        for (let i = 0; i < coinCount; i++) {
            const geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.08, 16);
            const coin = new THREE.Mesh(geometry, coinMaterial);
            
            // Start coins above the floor in random positions
            coin.position.x = (Math.random() - 0.5) * 4;
            coin.position.y = 3 + Math.random() * 2;
            coin.position.z = (Math.random() - 0.5) * 4;
            
            // Give coins random rotation
            coin.rotation.x = Math.random() * Math.PI;
            coin.rotation.z = Math.random() * Math.PI;
            
            const edges = new THREE.EdgesGeometry(geometry);
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0x8B7500, linewidth: 2 });
            const wireframe = new THREE.LineSegments(edges, lineMaterial);
            coin.add(wireframe);
            
            // Add physics properties
            coin.userData = {
                velocityY: 0,
                velocityX: (Math.random() - 0.5) * 0.02,
                velocityZ: (Math.random() - 0.5) * 0.02,
                rotationSpeedX: (Math.random() - 0.5) * 0.1,
                rotationSpeedY: (Math.random() - 0.5) * 0.1,
                rotationSpeedZ: (Math.random() - 0.5) * 0.1,
                bounciness: 0.4 + Math.random() * 0.2,
                settled: false
            };
            
            this.scene.add(coin);
            this.coins.push(coin);
        }

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Apply physics to coins
        this.coins.forEach((coin) => {
            if (!coin.userData.settled) {
                // Apply gravity
                coin.userData.velocityY += this.gravity;
                
                // Update position
                coin.position.y += coin.userData.velocityY;
                coin.position.x += coin.userData.velocityX;
                coin.position.z += coin.userData.velocityZ;
                
                // Update rotation
                coin.rotation.x += coin.userData.rotationSpeedX;
                coin.rotation.y += coin.userData.rotationSpeedY;
                coin.rotation.z += coin.userData.rotationSpeedZ;
                
                // Check collision with floor - account for coin radius and rotation
                const coinRadius = 0.3;
                const coinHeight = 0.04; // half height
                
                // Calculate how much the coin extends below its center based on orientation
                // When coin is flat (rotation.x/z = 0), it extends coinHeight below center
                // When coin is on edge (rotation.x/z = 90°), it extends coinRadius below center
                const tiltX = Math.abs(Math.sin(coin.rotation.x));
                const tiltZ = Math.abs(Math.sin(coin.rotation.z));
                const maxTilt = Math.max(tiltX, tiltZ);
                const lowestPoint = coinHeight + maxTilt * (coinRadius - coinHeight);
                
                if (coin.position.y - lowestPoint <= this.floorY) {
                    coin.position.y = this.floorY + lowestPoint;
                    coin.userData.velocityY *= -coin.userData.bounciness;
                    coin.userData.velocityX *= 0.9;
                    coin.userData.velocityZ *= 0.9;
                    coin.userData.rotationSpeedX *= 0.8;
                    coin.userData.rotationSpeedY *= 0.8;
                    coin.userData.rotationSpeedZ *= 0.8;
                    
                    // Mark as settled if barely moving
                    if (Math.abs(coin.userData.velocityY) < 0.001 && 
                        Math.abs(coin.userData.velocityX) < 0.001 &&
                        Math.abs(coin.userData.velocityZ) < 0.001) {
                        coin.userData.settled = true;
                        coin.userData.velocityY = 0;
                        coin.userData.velocityX = 0;
                        coin.userData.velocityZ = 0;
                        coin.userData.rotationSpeedX = 0;
                        coin.userData.rotationSpeedY = 0;
                        coin.userData.rotationSpeedZ = 0;
                    }
                }
            }
        });
        
        
        // Check coin-to-coin collisions
        const coinRadius = 0.3;
        for (let i = 0; i < this.coins.length; i++) {
            for (let j = i + 1; j < this.coins.length; j++) {
                const coin1 = this.coins[i];
                const coin2 = this.coins[j];
                
                const dx = coin2.position.x - coin1.position.x;
                const dy = coin2.position.y - coin1.position.y;
                const dz = coin2.position.z - coin1.position.z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                const minDistance = coinRadius * 2;
                
                if (distance < minDistance) {
                    // Coins are overlapping, separate them
                    const overlap = minDistance - distance;
                    const separationX = (dx / distance) * overlap * 0.5;
                    const separationY = (dy / distance) * overlap * 0.5;
                    const separationZ = (dz / distance) * overlap * 0.5;
                    
                    coin1.position.x -= separationX;
                    coin1.position.y -= separationY;
                    coin1.position.z -= separationZ;
                    
                    coin2.position.x += separationX;
                    coin2.position.y += separationY;
                    coin2.position.z += separationZ;
                    
                    // Apply collision response to velocities
                    if (!coin1.userData.settled || !coin2.userData.settled) {
                        const impactSpeed = 0.01;
                        coin1.userData.velocityX -= (dx / distance) * impactSpeed;
                        coin1.userData.velocityZ -= (dz / distance) * impactSpeed;
                        
                        coin2.userData.velocityX += (dx / distance) * impactSpeed;
                        coin2.userData.velocityZ += (dz / distance) * impactSpeed;
                        
                        coin1.userData.settled = false;
                        coin2.userData.settled = false;
                    }
                }
            }
        }
        
        
        this.renderer.render(this.scene, this.camera);
    }

    addCoins(count) {
        for (let i = 0; i < count; i++) {
            const geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.08, 16);
            const coin = new THREE.Mesh(geometry, coinMaterial);
            
            // Start coins above the floor in random positions
            coin.position.x = (Math.random() - 0.5) * 4;
            coin.position.y = 3 + Math.random() * 2;
            coin.position.z = (Math.random() - 0.5) * 4;
            
            // Give coins random rotation
            coin.rotation.x = Math.random() * Math.PI;
            coin.rotation.z = Math.random() * Math.PI;
            
            const edges = new THREE.EdgesGeometry(geometry);
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0x8B7500, linewidth: 2 });
            const wireframe = new THREE.LineSegments(edges, lineMaterial);
            coin.add(wireframe);
            
            // Add physics properties
            coin.userData = {
                velocityY: 0,
                velocityX: (Math.random() - 0.5) * 0.02,
                velocityZ: (Math.random() - 0.5) * 0.02,
                rotationSpeedX: (Math.random() - 0.5) * 0.1,
                rotationSpeedY: (Math.random() - 0.5) * 0.1,
                rotationSpeedZ: (Math.random() - 0.5) * 0.1,
                bounciness: 0.4 + Math.random() * 0.2,
                settled: false
            };
            
            this.scene.add(coin);
            this.coins.push(coin);
        }
    }

    removeCoins(count) {
        for (let i = 0; i < count && this.coins.length > 0; i++) {
            const coin = this.coins.shift();
            this.scene.remove(coin);
            if (coin.geometry) coin.geometry.dispose();
            coin.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('moneyCanvas');
    let money3DInstance = null;
    
    // Initialize when money tab is clicked
    const moneyTab = document.querySelector('[data-tab="money"]');
    if (moneyTab) {
        moneyTab.addEventListener('click', () => {
            if (!money3DInstance && canvas) {
                setTimeout(() => {
                    money3DInstance = new Money3D(canvas);
                }, 50);
            }
        });
    }

    // Handle coin addition/removal
    const plusHandvollBtn = document.querySelector('.plusHandvoll');
    const minusHandvollBtn = document.querySelector('.minusHandvoll');
    const plusBeutelBtn = document.querySelector('.plusBeutel');
    const minusBeutelBtn = document.querySelector('.minusBeutel');
    const plusKistenBtn = document.querySelector('.plusKisten');
    const minusKistenBtn = document.querySelector('.minusKisten');
    
    const handleMoneyChange = () => {
        if (!money3DInstance) return;
        
        setTimeout(() => {
            const newHandvoll = localStorage.getItem('handvoll') ? parseInt(localStorage.getItem('handvoll')) : 0;
            const newBag = localStorage.getItem('beutel') ? parseInt(localStorage.getItem('beutel')) : 0;
            const newChest = localStorage.getItem('kisten') ? parseInt(localStorage.getItem('kisten')) : 0;
            
            const oldTotal = handvollCount * 5 + bagCount * 50 + chestCount * 500;
            const newTotal = newHandvoll * 5 + newBag * 50 + newChest * 500;
            const difference = newTotal - oldTotal;
            
            if (difference > 0) {
                money3DInstance.addCoins(difference);
            } else if (difference < 0) {
                money3DInstance.removeCoins(Math.abs(difference));
            }
            
            handvollCount = newHandvoll;
            bagCount = newBag;
            chestCount = newChest;
        }, 110);
    };
    
    if (plusHandvollBtn) plusHandvollBtn.addEventListener('click', handleMoneyChange);
    if (minusHandvollBtn) minusHandvollBtn.addEventListener('click', handleMoneyChange);
    if (plusBeutelBtn) plusBeutelBtn.addEventListener('click', handleMoneyChange);
    if (minusBeutelBtn) minusBeutelBtn.addEventListener('click', handleMoneyChange);
    if (plusKistenBtn) plusKistenBtn.addEventListener('click', handleMoneyChange);
    if (minusKistenBtn) minusKistenBtn.addEventListener('click', handleMoneyChange);
});

