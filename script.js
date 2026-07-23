/* =========================================================================
   1. WEB AUDIO DYNAMIC MUSIC & SFX ENGINE
   ========================================================================= */
class DynamicSoundEngine {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.masterGain = null;
        this.musicInterval = null;
        this.musicIntensity = 1;
    }

    init() {
        if (this.ctx) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        this.startAmbientMusic();
        this.isPlaying = true;
    }

    startAmbientMusic() {
        // Ebmaj9 -> Cm9 -> Abmaj7 -> Bb11 progression
        const chordsBase = [
            [155.56, 196.00, 233.08, 293.66, 349.23],
            [130.81, 155.56, 196.00, 233.08, 293.66],
            [103.83, 130.81, 155.56, 207.65, 261.63],
            [116.54, 146.83, 174.61, 233.08, 311.13]
        ];
        let index = 0;

        const playNote = (freq, delay, vol = 0.08, type = 'sine') => {
            if (!this.ctx || !this.isPlaying) return;
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(this.musicIntensity === 1 ? 700 : 1300, this.ctx.currentTime);

            const startTime = this.ctx.currentTime + delay;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(vol, startTime + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 3.8);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime);
            osc.stop(startTime + 4.0);
        };

        const loop = () => {
            if (!this.isPlaying) return;
            const chord = chordsBase[index];

            chord.forEach((freq, i) => {
                playNote(freq, i * 0.24, 0.08, 'sine');
            });

            if (this.musicIntensity >= 2) {
                chord.forEach((freq, i) => {
                    playNote(freq * 2, i * 0.24 + 0.12, 0.035, 'triangle');
                });
            }

            index = (index + 1) % chordsBase.length;
        };

        loop();
        this.musicInterval = setInterval(loop, 3800);
    }

    swellMusic() {
        this.musicIntensity = 2;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.linearRampToValueAtTime(0.28, this.ctx.currentTime + 3.0);
        }
    }

    playSparkle() {
        if (!this.ctx) return;
        const freqs = [1046.50, 1318.51, 1567.98, 2093.00];
        freqs.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.04);
            gain.gain.setValueAtTime(0.03, this.ctx.currentTime + i * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.04 + 0.5);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(this.ctx.currentTime + i * 0.04);
            osc.stop(this.ctx.currentTime + i * 0.04 + 0.5);
        });
    }

    playLightChime() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200 + Math.random() * 400, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playHeartbeat() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.35);
    }

    // Synthesizes "Happy Birthday To You" melody
    playBirthdayMelody() {
        if (!this.ctx) return;
        const notes = [
            { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.3 }, { f: 293.66, d: 0.6 }, { f: 261.63, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 329.63, d: 1.0 },
            { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.3 }, { f: 293.66, d: 0.6 }, { f: 261.63, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.0 },
            { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.3 }, { f: 523.25, d: 0.6 }, { f: 440.00, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 329.63, d: 0.6 }, { f: 293.66, d: 0.8 },
            { f: 466.16, d: 0.3 }, { f: 466.16, d: 0.3 }, { f: 440.00, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.2 }
        ];

        let timeOffset = 0;
        notes.forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(n.f, this.ctx.currentTime + timeOffset);

            gain.gain.setValueAtTime(0, this.ctx.currentTime + timeOffset);
            gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + timeOffset + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + timeOffset + n.d);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(this.ctx.currentTime + timeOffset);
            osc.stop(this.ctx.currentTime + timeOffset + n.d);

            timeOffset += n.d * 0.85;
        });
    }

    toggle() {
        if (!this.ctx) return;
        if (this.isPlaying) {
            this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
            this.isPlaying = false;
        } else {
            this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            this.isPlaying = true;
        }
    }
}

const sound = new DynamicSoundEngine();

function playBirthdayVoice() {
    sound.playBirthdayMelody();
    confetti({ particleCount: 35, spread: 70, origin: { y: 0.6 } });
}

/* =========================================================================
   2. BACKGROUND CANVAS (Silver Moon, Mist, Stars & Flying Hearts)
   ========================================================================= */
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');

let width, height;
let particles = [];
let flyingHearts = [];

function resizeCanvas() {
    width = bgCanvas.width = window.innerWidth;
    height = bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

for (let i = 0; i < 140; i++) {
    particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
    });
}

for (let i = 0; i < 35; i++) {
    flyingHearts.push({
        x: Math.random() * width,
        y: height + Math.random() * height,
        size: Math.random() * 12 + 8,
        speedY: Math.random() * 1.2 + 0.6,
        speedX: Math.random() * 0.6 - 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        color: Math.random() > 0.4 ? '#f43f5e' : '#ffffff'
    });
}

function drawHeart(ctx, x, y, size, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 20, size / 20);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-10, -10, -20, 5, 0, 20);
    ctx.bezierCurveTo(20, 5, 10, -10, 0, 0);
    ctx.fill();
    ctx.restore();
}

function renderBg() {
    bgCtx.clearRect(0, 0, width, height);

    // Silver Moon Glow
    const moonX = width * 0.3;
    const moonY = height * 0.28;
    const moonGlow = bgCtx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 260);
    moonGlow.addColorStop(0, 'rgba(255, 240, 245, 0.3)');
    moonGlow.addColorStop(0.5, 'rgba(244, 63, 94, 0.08)');
    moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    bgCtx.fillStyle = moonGlow;
    bgCtx.beginPath();
    bgCtx.arc(moonX, moonY, 260, 0, Math.PI * 2);
    bgCtx.fill();

    // Stars
    particles.forEach(p => {
        p.alpha += p.speed;
        if (p.alpha > 1 || p.alpha < 0) p.speed = -p.speed;
        bgCtx.fillStyle = `rgba(255, 255, 255, ${Math.abs(p.alpha)})`;
        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        bgCtx.fill();
    });

    // Flying Hearts
    flyingHearts.forEach(p => {
        p.y -= p.speedY;
        p.x += Math.sin(p.y * 0.015) + p.speedX;

        if (p.y < -30) {
            p.y = height + 20;
            p.x = Math.random() * width;
        }

        drawHeart(bgCtx, p.x, p.y, p.size, p.color, p.alpha);
    });

    requestAnimationFrame(renderBg);
}
renderBg();

/* =========================================================================
   3. THREE.JS 3D SCENE (3D Arch, Couple, Bouquet & Butterflies)
   ========================================================================= */
const container = document.getElementById('threeCanvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Lighting
const ambientLight = new THREE.AmbientLight(0xfff0f5, 0.7);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1.4);
mainLight.position.set(5, 8, 5);
mainLight.castShadow = true;
scene.add(mainLight);

const centerGlowSpot = new THREE.PointLight(0xfacc15, 0, 8);
centerGlowSpot.position.set(0, 0.5, 1);
scene.add(centerGlowSpot);

function createGlowTexture(colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, colorHex);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
}

const flareMat = new THREE.SpriteMaterial({
    map: createGlowTexture('rgba(250, 204, 21, 0.8)'),
    transparent: true,
    blending: THREE.AdditiveBlending,
    opacity: 0
});
const lensFlareSprite = new THREE.Sprite(flareMat);
lensFlareSprite.scale.set(5, 5, 1);
lensFlareSprite.position.set(0, 0.2, 0);
scene.add(lensFlareSprite);

// Vortex Particles
const vortexCount = 180;
const vortexGeom = new THREE.BufferGeometry();
const vortexPos = new Float32Array(vortexCount * 3);
for (let i = 0; i < vortexCount * 3; i += 3) {
    vortexPos[i] = (Math.random() - 0.5) * 8;
    vortexPos[i+1] = (Math.random() - 0.5) * 8;
    vortexPos[i+2] = (Math.random() - 0.5) * 8;
}
vortexGeom.setAttribute('position', new THREE.BufferAttribute(vortexPos, 3));
const vortexMat = new THREE.PointsMaterial({
    size: 0.12,
    map: createGlowTexture('rgba(244, 63, 94, 0.9)'),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
});
const vortexParticles = new THREE.Points(vortexGeom, vortexMat);
scene.add(vortexParticles);

/* =========================================================================
   4. 3D HEART ROSE ARCH & PROPOSAL COUPLE
   ========================================================================= */
const proposalSceneGroup = new THREE.Group();
scene.add(proposalSceneGroup);

function createMiniRoseMesh(colorHex) {
    const roseGroup = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.3 });
    const bud = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 8), mat);
    bud.rotation.x = Math.PI;
    roseGroup.add(bud);
    return roseGroup;
}

const heartArchRoseCount = 75;
const heartArchMat = new THREE.MeshBasicMaterial({ color: 0xfff0aa });
const lightSphereGeom = new THREE.SphereGeometry(0.03, 8, 8);

for (let i = 0; i < heartArchRoseCount; i++) {
    const t = (i / heartArchRoseCount) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3) * 0.14;
    const y = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * 0.14 + 0.6;
    const z = -1.2;

    const rose = createMiniRoseMesh(i % 2 === 0 ? 0xe11d48 : 0xf43f5e);
    rose.position.set(x, y, z);
    rose.rotation.set(Math.random(), Math.random(), Math.random());
    proposalSceneGroup.add(rose);

    if (i % 2 === 0) {
        const fairyLight = new THREE.Mesh(lightSphereGeom, heartArchMat);
        fairyLight.position.set(x * 1.05, y * 1.02, z + 0.05);
        proposalSceneGroup.add(fairyLight);
    }
}

// Couple Group
const coupleGroup = new THREE.Group();
proposalSceneGroup.add(coupleGroup);
coupleGroup.position.set(0, -0.6, -1.1);

const suitMat = new THREE.MeshStandardMaterial({ color: 0x111118, roughness: 0.3 });
const dressMat = new THREE.MeshStandardMaterial({ color: 0xbe123c, roughness: 0.2 });
const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.5 });

// Man Kneeling
const manHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), skinMat);
manHead.position.set(-0.35, 0.45, 0);
coupleGroup.add(manHead);

const manSuitTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.4), suitMat);
manSuitTorso.position.set(-0.35, 0.2, 0);
coupleGroup.add(manSuitTorso);

// Woman Standing
const womanHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), skinMat);
womanHead.position.set(0.35, 0.65, 0);
coupleGroup.add(womanHead);

const womanGown = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.7, 16), dressMat);
womanGown.position.set(0.35, 0.25, 0);
coupleGroup.add(womanGown);

/* =========================================================================
   5. GLOWING GIFT CRYSTAL & REALISTIC 3D BOUQUET
   ========================================================================= */
const giftCrystalGroup = new THREE.Group();
const crystalMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0x9f1239,
    roughness: 0.1,
    metalness: 0.8,
    wireframe: true
});
const crystalMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 1), crystalMat);
giftCrystalGroup.add(crystalMesh);
giftCrystalGroup.position.set(-1.2, 0.3, 0);
scene.add(giftCrystalGroup);

const bouquetGroup = new THREE.Group();
scene.add(bouquetGroup);

bouquetGroup.position.set(-1.2, -4, 0);
bouquetGroup.scale.set(0.001, 0.001, 0.001);

const interactiveFlowers = [];
const flowerHeadMeshes = [];

function createPetalGeometry() {
    const geom = new THREE.SphereGeometry(0.3, 16, 16);
    geom.scale(1, 1.5, 0.2);
    return geom;
}

function createRose(colorHex, name, meaning) {
    const roseGroup = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4, metalness: 0.1 });

    const flowerHead = new THREE.Group();
    roseGroup.add(flowerHead);
    flowerHeadMeshes.push(flowerHead);

    const bud = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 12), mat);
    bud.rotation.x = Math.PI;
    flowerHead.add(bud);

    const petalGeom = createPetalGeometry();
    for (let i = 0; i < 14; i++) {
        const petal = new THREE.Mesh(petalGeom, mat);
        const angle = (i / 14) * Math.PI * 4;
        const radius = 0.15 + (i * 0.015);
        petal.position.set(Math.cos(angle) * radius, i * 0.02 - 0.1, Math.sin(angle) * radius);
        petal.rotation.y = -angle;
        petal.rotation.x = 0.2 + (i * 0.04);
        flowerHead.add(petal);
    }

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.5), new THREE.MeshStandardMaterial({ color: 0x2e5a27 }));
    stem.position.y = -1.25;
    roseGroup.add(stem);

    roseGroup.userData = { name, meaning, type: 'flower' };
    interactiveFlowers.push(roseGroup);
    return roseGroup;
}

function createTulip(colorHex, name, meaning) {
    const tulipGroup = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.3 });
    
    const flowerHead = new THREE.Group();
    tulipGroup.add(flowerHead);
    flowerHeadMeshes.push(flowerHead);

    const petalGeom = new THREE.SphereGeometry(0.25, 16, 16);
    petalGeom.scale(0.7, 1.4, 0.3);

    for (let i = 0; i < 6; i++) {
        const petal = new THREE.Mesh(petalGeom, mat);
        const angle = (i / 6) * Math.PI * 2;
        petal.position.set(Math.cos(angle) * 0.12, 0, Math.sin(angle) * 0.12);
        petal.rotation.y = -angle;
        petal.rotation.x = 0.2;
        flowerHead.add(petal);
    }

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.5), new THREE.MeshStandardMaterial({ color: 0x3a6b32 }));
    stem.position.y = -1.25;
    tulipGroup.add(stem);

    tulipGroup.userData = { name, meaning, type: 'flower' };
    interactiveFlowers.push(tulipGroup);
    return tulipGroup;
}

function createLavender(name, meaning) {
    const lavGroup = new THREE.Group();
    const flowerHead = new THREE.Group();
    lavGroup.add(flowerHead);
    flowerHeadMeshes.push(flowerHead);

    const flowerMat = new THREE.MeshStandardMaterial({ color: 0x8a2be2, roughness: 0.5 });
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.8), new THREE.MeshStandardMaterial({ color: 0x3a6b32 }));
    stem.position.y = -1.4;
    lavGroup.add(stem);

    for (let i = 0; i < 20; i++) {
        const floret = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), flowerMat);
        const angle = i * 0.8;
        floret.position.set(Math.cos(angle) * 0.06, i * 0.05 - 0.2, Math.sin(angle) * 0.06);
        flowerHead.add(floret);
    }

    lavGroup.userData = { name, meaning, type: 'flower' };
    interactiveFlowers.push(lavGroup);
    return lavGroup;
}

// Assemble Bouquet
const flowerConfig = [
    { mesh: createRose(0xe11d48, "Red Rose", "I Love You ❤️"), pos: [0, 1.2, 0.2], rot: [0, 0, 0] },
    { mesh: createRose(0xbe123c, "Deep Red Rose", "My Love Belongs To You"), pos: [-0.4, 1.1, 0.4], rot: [0.2, -0.3, -0.2] },
    { mesh: createRose(0xf43f5e, "Pink Rose", "Thank You For Being You"), pos: [0.4, 1.0, 0.3], rot: [0.2, 0.4, 0.1] },
    { mesh: createRose(0xffffff, "White Rose", "Forever & Always"), pos: [-0.6, 0.8, 0.1], rot: [0.3, -0.5, -0.3] },
    { mesh: createRose(0xfff1f2, "Blush Rose", "You Make Days Magical"), pos: [0.6, 0.8, 0.1], rot: [0.3, 0.5, 0.3] },
    { mesh: createTulip(0xfacc15, "Golden Tulip", "My Heart Is Yours"), pos: [0, 0.9, 0.6], rot: [0.4, 0, 0] },
    { mesh: createTulip(0xf472b6, "Pink Tulip", "Caring & Gentle"), pos: [-0.3, 0.7, 0.6], rot: [0.5, -0.2, 0] },
    { mesh: createLavender("Lavender", "Peace & Serenity"), pos: [-0.8, 0.9, -0.1], rot: [0.1, 0, -0.4] },
    { mesh: createLavender("Lavender", "Peace & Serenity"), pos: [0.8, 0.9, -0.1], rot: [0.1, 0, 0.4] }
];

flowerConfig.forEach(f => {
    f.mesh.position.set(...f.pos);
    f.mesh.rotation.set(...f.rot);
    bouquetGroup.add(f.mesh);
});

// Wrapping Paper & Ribbon
const wrapMesh = new THREE.Mesh(
    new THREE.ConeGeometry(0.9, 2.0, 16, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xf7e7ce, roughness: 0.6, side: THREE.DoubleSide })
);
wrapMesh.position.set(0, -0.4, 0);
wrapMesh.rotation.x = Math.PI;
bouquetGroup.add(wrapMesh);

const ribbonMesh = new THREE.Mesh(
    new THREE.TorusGeometry(0.26, 0.06, 12, 30),
    new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.3 })
);
ribbonMesh.position.set(0, 0.2, 0.6);
bouquetGroup.add(ribbonMesh);

// Fairy Lights
const fairyLights = [];
for (let i = 0; i < 22; i++) {
    const lightMesh = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfff0aa }));
    const angle = i * 0.65;
    const r = 0.65 + Math.sin(i) * 0.2;
    lightMesh.position.set(Math.cos(angle) * r, i * 0.08, Math.sin(angle) * r);
    lightMesh.scale.set(0, 0, 0);
    bouquetGroup.add(lightMesh);
    fairyLights.push(lightMesh);
}

// Butterflies
const butterflies = [];
function createButterfly() {
    const group = new THREE.Group();
    const wingMat = new THREE.MeshBasicMaterial({ color: 0xffb6c1, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
    const wingGeom = new THREE.PlaneGeometry(0.22, 0.32);

    const leftWing = new THREE.Mesh(wingGeom, wingMat);
    leftWing.position.x = -0.11;
    const rightWing = new THREE.Mesh(wingGeom, wingMat);
    rightWing.position.x = 0.11;

    group.add(leftWing, rightWing);
    group.userData = { leftWing, rightWing, speed: 0.02 + Math.random() * 0.02, offset: Math.random() * 100 };
    return group;
}

for (let i = 0; i < 5; i++) {
    const b = createButterfly();
    b.position.set(-1.2, -2, 0);
    b.scale.set(0, 0, 0);
    scene.add(b);
    butterflies.push(b);
}

// Grand Finale 3D Heart Group
const heartGroup = new THREE.Group();
const heartPetalMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
for (let i = 0; i < 65; i++) {
    const t = (i / 65) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    const p = new THREE.Mesh(createPetalGeometry(), heartPetalMat);
    p.position.set(x * 0.055, y * 0.055 + 0.3, (Math.random() - 0.5) * 0.15);
    p.scale.set(0.65, 0.65, 0.65);
    heartGroup.add(p);
}
heartGroup.visible = false;
scene.add(heartGroup);

// Responsive 3D Layout Adapter
function updateLayout() {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    if (aspect > 1.1) {
        // Desktop / Laptop: Offset 3D objects to Left so Right Side Panel is 100% unblocked
        bouquetGroup.position.x = -1.3;
        giftCrystalGroup.position.x = -1.3;
        proposalSceneGroup.position.x = -1.3;
        camera.position.set(0, 0.5, 6.5);
    } else {
        // Mobile / Portrait: Center 3D objects at Top Half
        bouquetGroup.position.x = 0;
        giftCrystalGroup.position.x = 0;
        proposalSceneGroup.position.x = 0;
        camera.position.set(0, 0.8, 8.5);
    }
    camera.updateProjectionMatrix();
}
updateLayout();

/* =========================================================================
   6. UNBOXING REVEAL ANIMATION
   ========================================================================= */
document.getElementById('startBtn').addEventListener('click', () => {
    sound.init();
    sound.swellMusic();
    document.getElementById('audioToggleBtn').classList.remove('hidden');
    document.getElementById('birthdayVoiceBtn').classList.remove('hidden');

    gsap.to('#startScreen', {
        opacity: 0, scale: 0.85, duration: 0.8, ease: "power2.in", onComplete: () => {
            document.getElementById('startScreen').classList.add('hidden');
        }
    });

    gsap.to(giftCrystalGroup.scale, { x: 2.5, y: 2.5, z: 2.5, duration: 1.2, ease: "power2.in" });
    gsap.to(crystalMat, { opacity: 0, transparent: true, duration: 1.2, onComplete: () => {
        giftCrystalGroup.visible = false;
    }});

    gsap.to(vortexMat, { opacity: 0.8, duration: 1.5 });
    gsap.to(flareMat, { opacity: 0.9, duration: 2.0, yoyo: true, repeat: 1 });
    gsap.to(centerGlowSpot, { intensity: 2.5, duration: 2.0 });

    gsap.to(bouquetGroup.position, { y: -0.3, duration: 3.0, ease: "back.out(1.2)", delay: 0.4 });
    gsap.to(bouquetGroup.scale, { x: 1, y: 1, z: 1, duration: 3.0, ease: "back.out(1.2)", delay: 0.4 });

    flowerHeadMeshes.forEach((fHead, idx) => {
        fHead.scale.set(0.01, 0.01, 0.01);
        gsap.to(fHead.scale, {
            x: 1, y: 1, z: 1,
            duration: 1.8,
            delay: 1.0 + idx * 0.15,
            ease: "elastic.out(1, 0.5)",
            onStart: () => sound.playLightChime()
        });
    });

    gsap.fromTo(ribbonMesh.rotation, 
        { y: -Math.PI * 2, x: Math.PI }, 
        { y: 0, x: 0, duration: 2.5, delay: 1.5, ease: "power2.out" }
    );

    fairyLights.forEach((light, idx) => {
        gsap.to(light.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.4,
            delay: 2.0 + idx * 0.08,
            ease: "back.out(2)"
        });
    });

    butterflies.forEach((b, idx) => {
        gsap.to(b.scale, { x: 1, y: 1, z: 1, duration: 1, delay: 2.6 + idx * 0.1 });
        gsap.to(b.position, {
            x: bouquetGroup.position.x + (Math.random() - 0.5) * 3,
            y: 0.5 + Math.random() * 1.5,
            z: (Math.random() - 0.5) * 2,
            duration: 2.5,
            delay: 2.6 + idx * 0.1,
            ease: "power2.out"
        });
    });

    setTimeout(() => {
        goToScene(1);
    }, 3600);
});

/* =========================================================================
   7. TOUCH / MOUSE DRAG & RAYCASTING
   ========================================================================= */
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('flowerTooltip');
const tooltipName = document.getElementById('tooltipName');
const tooltipMeaning = document.getElementById('tooltipMeaning');
let hoveredFlower = null;

function onPointerDown(e) {
    isDragging = true;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    previousMousePosition = { x, y };
}

function onPointerMove(e) {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    if (isDragging && bouquetGroup.scale.x > 0.5) {
        const deltaX = x - previousMousePosition.x;
        bouquetGroup.rotation.y += deltaX * 0.008;
        previousMousePosition = { x, y };
    }

    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    if (Math.random() > 0.65) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = particle.style.height = `${Math.random() * 8 + 4}px`;
        particle.style.setProperty('--dx', `${(Math.random() - 0.5) * 30}px`);
        particle.style.setProperty('--dy', `${(Math.random() - 0.5) * 30}px`);
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveFlowers, true);

    if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj.parent && !obj.userData.type) {
            obj = obj.parent;
        }

        if (obj && obj.userData.type === 'flower') {
            if (hoveredFlower !== obj) {
                if (hoveredFlower) gsap.to(hoveredFlower.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
                hoveredFlower = obj;
                gsap.to(hoveredFlower.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.3 });
                sound.playSparkle();
            }

            tooltipName.textContent = obj.userData.name;
            tooltipMeaning.textContent = `"${obj.userData.meaning}"`;
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
            tooltip.style.opacity = '1';
            return;
        }
    }

    if (hoveredFlower) {
        gsap.to(hoveredFlower.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
        hoveredFlower = null;
    }
    tooltip.style.opacity = '0';
}

function onPointerUp() {
    isDragging = false;
}

window.addEventListener('mousedown', onPointerDown);
window.addEventListener('mousemove', onPointerMove);
window.addEventListener('mouseup', onPointerUp);

window.addEventListener('touchstart', onPointerDown, { passive: true });
window.addEventListener('touchmove', onPointerMove, { passive: true });
window.addEventListener('touchend', onPointerUp);

window.addEventListener('click', () => {
    if (hoveredFlower) {
        sound.playSparkle();
        gsap.to(hoveredFlower.rotation, { y: hoveredFlower.rotation.y + Math.PI, duration: 0.8, ease: "back.out(1.7)" });
        confetti({
            particleCount: 20,
            spread: 50,
            origin: { x: (mouse.x + 1) / 2, y: (-mouse.y + 1) / 2 },
            colors: ['#f43f5e', '#facc15', '#ffffff']
        });
    }
});

/* =========================================================================
   8. ANIMATION LOOP (60 FPS Cap)
   ========================================================================= */
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (giftCrystalGroup.visible) {
        giftCrystalGroup.rotation.y = elapsedTime * 0.8;
        giftCrystalGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.3;
    }

    if (bouquetGroup.position.y > -2 && !isDragging) {
        bouquetGroup.rotation.y += 0.002;
        bouquetGroup.position.y = -0.3 + Math.sin(elapsedTime * 1.2) * 0.04;
    }

    vortexParticles.rotation.y = elapsedTime * 0.1;

    butterflies.forEach(b => {
        const t = elapsedTime + b.userData.offset;
        b.position.x += Math.sin(t) * b.userData.speed;
        b.position.y += Math.cos(t * 1.5) * b.userData.speed;
        b.userData.leftWing.rotation.y = Math.sin(t * 16) * 0.6;
        b.userData.rightWing.rotation.y = -Math.sin(t * 16) * 0.6;
    });

    fairyLights.forEach((l, idx) => {
        l.material.opacity = 0.6 + Math.sin(elapsedTime * 4 + idx) * 0.4;
    });

    if (heartGroup.visible) {
        heartGroup.rotation.y = elapsedTime * 0.3;
    }

    renderer.render(scene, camera);
}
animate();

/* =========================================================================
   9. STORY NAVIGATION & REQUIRED LOVE NOTES TRACKER
   ========================================================================= */
const loveLetters = [
    "I smile every time I think of you.",
    "You make ordinary days feel like magic.",
    "You are my favorite notification.",
    "My heart chose you long before I knew it.",
    "I wish I could give you these flowers in person today.",
    "I hope these flowers bring a beautiful smile to your face."
];

let openedLetterIndices = new Set();

document.getElementById('audioToggleBtn').addEventListener('click', () => sound.toggle());

function goToScene(sceneNum) {
    sound.playLightChime();
    
    gsap.to('.scene-card', { opacity: 0, y: 15, duration: 0.35, onComplete: () => {
        document.querySelectorAll('.scene-card').forEach(el => el.classList.add('hidden'));
        
        const targetScene = document.getElementById(`scene${sceneNum}`);
        if (targetScene) {
            targetScene.classList.remove('hidden');
            gsap.fromTo(targetScene, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.5 });
        }
    }});

    if (sceneNum === 3) {
        triggerLoveLetterSpawn();
    }
}

function triggerLoveLetterSpawn() {
    document.querySelectorAll('.love-letter-btn').forEach(e => e.remove());

    loveLetters.forEach((msg, idx) => {
        setTimeout(() => {
            const letterEl = document.createElement('div');
            letterEl.className = 'love-letter-btn fixed z-30 cursor-pointer pointer-events-auto glass-panel w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-rose-300 hover:scale-125 transition-transform shadow-lg border-amber-300/50 animate-bounce';
            
            const posX = 10 + Math.random() * 40;
            const posY = 15 + Math.random() * 50;
            letterEl.style.left = `${posX}%`;
            letterEl.style.top = `${posY}%`;
            letterEl.innerHTML = '<i class="fa-solid fa-envelope text-xs sm:text-sm"></i>';

            letterEl.onclick = () => openLetterModal(msg, idx, letterEl);
            document.body.appendChild(letterEl);
        }, idx * 350);
    });
}

function openLetterModal(text, index, element) {
    sound.playSparkle();
    const modal = document.getElementById('letterModal');
    const card = document.getElementById('letterCard');
    document.getElementById('letterContent').textContent = `"${text}"`;

    modal.classList.remove('hidden');
    gsap.to(card, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" });

    if (element) {
        gsap.to(element, { scale: 0, opacity: 0, duration: 0.3, onComplete: () => element.remove() });
    }

    openedLetterIndices.add(index);
    const total = loveLetters.length;
    const current = openedLetterIndices.size;
    const scene3Btn = document.getElementById('scene3NextBtn');

    if (current < total) {
        scene3Btn.textContent = `Open all message notes (${current}/${total})`;
    } else {
        scene3Btn.disabled = false;
        scene3Btn.innerHTML = '<span>Next Whisper ❤️</span>';
        scene3Btn.classList.add('animate-pulse');
    }
}

function closeLetterModal() {
    const card = document.getElementById('letterCard');
    gsap.to(card, { scale: 0.8, opacity: 0, duration: 0.3, onComplete: () => {
        document.getElementById('letterModal').classList.add('hidden');
    }});
}

/* =========================================================================
   10. GRAND FINALE
   ========================================================================= */
function triggerGrandFinale() {
    sound.playHeartbeat();

    gsap.to('#scene5', { opacity: 0, y: 20, duration: 0.5, onComplete: () => {
        document.getElementById('scene5').classList.add('hidden');
    }});

    gsap.to(camera.position, { x: 0, y: 0.5, z: 2.8, duration: 2.5, ease: "power3.inOut" });

    setTimeout(() => {
        sound.playSparkle();

        gsap.to(bouquetGroup.scale, { x: 0, y: 0, z: 0, duration: 1 });
        heartGroup.position.x = 0;
        heartGroup.visible = true;
        gsap.fromTo(heartGroup.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 1.5, ease: "back.out(1.7)" });

        const duration = 5 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#f43f5e', '#facc15', '#ffffff'] });
            confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#f43f5e', '#facc15', '#ffffff'] });

            if (Date.now() < end) requestAnimationFrame(frame);
        })();

        const finaleScreen = document.getElementById('finaleScreen');
        finaleScreen.classList.remove('hidden');

        gsap.to('#finaleTitle', { opacity: 1, scale: 1, duration: 1.2, delay: 0.5 });
        gsap.to('#finaleMessages', { opacity: 1, y: 0, duration: 1.2, delay: 1.5 });
        gsap.to('#finaleSignature', { opacity: 1, y: 0, duration: 1.5, delay: 2.8 });

    }, 2000);
}

window.addEventListener('resize', () => {
    updateLayout();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
