import * as THREE from 'three';

export function initHeroScene(): void {

let scene, camera, renderer, agentModel, phone, human;

function initHeroScene() {
    const canvas = document.createElement('canvas');
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;
    
    heroVisual.appendChild(canvas);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.borderRadius = '20px';
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4ecdc4, 0.8, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xff6b6b, 0.6, 100);
    pointLight2.position.set(5, -5, 5);
    scene.add(pointLight2);

    // Create human character (young man)
    const humanGroup = new THREE.Group();
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xfdbcb4,
        shininess: 30
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.5;
    humanGroup.add(head);

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2196F3,
        shininess: 50
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.3;
    humanGroup.add(body);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.8, 8);
    const armMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xfdbcb4,
        shininess: 30
    });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.5, 0.3, 0);
    leftArm.rotation.z = 0.3;
    humanGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.8, 0.1, 0);
    rightArm.rotation.z = -0.5;
    humanGroup.add(rightArm);

    // Hand (for handshake)
    const handGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const hand = new THREE.Mesh(handGeometry, armMaterial);
    hand.position.set(1.2, -0.2, 0);
    humanGroup.add(hand);

    // Eyes (simple smile)
    const eyeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 1.6, 0.4);
    humanGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 1.6, 0.4);
    humanGroup.add(rightEye);

    // Smile
    const smileGeometry = new THREE.TorusGeometry(0.15, 0.02, 8, 16, Math.PI);
    const smileMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const smile = new THREE.Mesh(smileGeometry, smileMaterial);
    smile.position.set(0, 1.35, 0.4);
    smile.rotation.z = Math.PI;
    humanGroup.add(smile);

    humanGroup.position.set(-2, -1, 0);
    scene.add(humanGroup);
    human = humanGroup;

    // Create mobile phone
    const phoneGroup = new THREE.Group();
    
    // Phone body
    const phoneGeometry = new THREE.BoxGeometry(1, 1.8, 0.1);
    const phoneMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x222222,
        shininess: 100
    });
    const phoneBody = new THREE.Mesh(phoneGeometry, phoneMaterial);
    phoneGroup.add(phoneBody);

    // Screen
    const screenGeometry = new THREE.BoxGeometry(0.9, 1.6, 0.11);
    const screenMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000066,
        emissive: 0x001122
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    phoneGroup.add(screen);

    // Screen glow effect
    const glowGeometry = new THREE.BoxGeometry(0.95, 1.65, 0.12);
    const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4ecdc4,
        transparent: true,
        opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    phoneGroup.add(glow);

    phoneGroup.position.set(1.5, 0, 0);
    phoneGroup.scale.set(1.5, 1.5, 1.5);
    scene.add(phoneGroup);
    phone = phoneGroup;

    // Create AI Agent (holographic figure)
    const agentGroup = new THREE.Group();
    
    // Agent body (more futuristic)
    const agentBodyGeometry = new THREE.CylinderGeometry(0.25, 0.3, 1, 6);
    const agentBodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4ecdc4,
        transparent: true,
        opacity: 0.8,
        emissive: 0x002020
    });
    const agentBody = new THREE.Mesh(agentBodyGeometry, agentBodyMaterial);
    agentBody.position.y = 0.2;
    agentGroup.add(agentBody);

    // Agent head (geometric)
    const agentHeadGeometry = new THREE.OctahedronGeometry(0.3);
    const agentHeadMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.9,
        emissive: 0x200000
    });
    const agentHead = new THREE.Mesh(agentHeadGeometry, agentHeadMaterial);
    agentHead.position.y = 1;
    agentGroup.add(agentHead);

    // Agent arms
    const agentArmGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.6, 6);
    const agentArmMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4ecdc4,
        transparent: true,
        opacity: 0.7
    });
    
    const agentLeftArm = new THREE.Mesh(agentArmGeometry, agentArmMaterial);
    agentLeftArm.position.set(-0.4, 0.2, 0);
    agentLeftArm.rotation.z = 0.3;
    agentGroup.add(agentLeftArm);

    const agentRightArm = new THREE.Mesh(agentArmGeometry, agentArmMaterial);
    agentRightArm.position.set(0.4, 0.2, 0);
    agentRightArm.rotation.z = -0.3;
    agentGroup.add(agentRightArm);

    // Agent hand (for handshake)
    const agentHandGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const agentHand = new THREE.Mesh(agentHandGeometry, agentArmMaterial);
    agentHand.position.set(0.65, -0.1, 0);
    agentGroup.add(agentHand);

    // Digital effects around agent
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const positions = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 3;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x4ecdc4,
        size: 0.02,
        transparent: true,
        opacity: 0.6
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    agentGroup.add(particles);

    agentGroup.position.set(1.5, -1, 0);
    agentGroup.scale.set(0.8, 0.8, 0.8);
    scene.add(agentGroup);
    agentModel = agentGroup;

    // Position camera
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    // Animation loop
    animate();

    // Handle window resize
    window.addEventListener('resize', handleResize);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate elements
    if (agentModel) {
        agentModel.rotation.y += 0.01;
        agentModel.children[4].rotation.y += 0.02; // particles
        
        // Floating animation
        agentModel.position.y = -1 + Math.sin(Date.now() * 0.002) * 0.2;
    }

    if (phone) {
        phone.rotation.y += 0.005;
        // Screen glow pulse
        if (phone.children[2]) {
            phone.children[2].material.opacity = 0.3 + Math.sin(Date.now() * 0.003) * 0.1;
        }
    }

    if (human) {
        // Slight breathing animation
        human.scale.y = 1 + Math.sin(Date.now() * 0.001) * 0.02;
    }

    // Camera gentle movement
    camera.position.x = Math.sin(Date.now() * 0.0005) * 0.5;
    camera.position.y = Math.cos(Date.now() * 0.0003) * 0.3;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

function handleResize() {
    const canvas = renderer.domElement;
    if (canvas && camera && renderer) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initHeroScene, 100); // Small delay to ensure canvas is ready
});
}
