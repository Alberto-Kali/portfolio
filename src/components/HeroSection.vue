<!-- components/HeroSection.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

const heroRef = ref<HTMLElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let model: THREE.Group
let controls: OrbitControls
let snowParticles: THREE.Points
let mouseX = 0
let mouseY = 0

// Текст для анимации
const greetings = [
  "Hello World!",
  "Привет мир!",
  "Hola Mundo!",
  "Bonjour le monde!",
  "Ciao mondo!",
  "Hallo Welt!"
]

const currentGreetingIndex = ref(0)
const isAnimating = ref(false)
const titleRef = ref<HTMLElement | null>(null)

onMounted(() => {
  initThree()
  loadModel()
  createSnow()
  setupLights()
  setupControls()
  animate()
  initTextAnimations()
  
  window.addEventListener('resize', onWindowResize)
  window.addEventListener('mousemove', onMouseMove)
  
  // Запускаем циклическую анимацию текста
  startTextAnimation()
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  window.removeEventListener('mousemove', onMouseMove)
  renderer.dispose()
})

// Функция для анимации текста
const startTextAnimation = () => {
  setInterval(() => {
    if (!isAnimating.value) {
      animateTextChange()
    }
  }, 3000)
}


const animateTextChange = () => {
  if (!titleRef.value || isAnimating.value) return
  
  isAnimating.value = true
  
  // Сохраняем ссылку на элемент
  const element = titleRef.value
  
  // Исчезаем вниз
  gsap.to(element, {
    y: 50,
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      // Меняем текст
      currentGreetingIndex.value = (currentGreetingIndex.value + 1) % greetings.length      
      // Даем Vue обновить DOM
      setTimeout(() => {
        // Убеждаемся что элемент все еще существует
        if (element) {
          // Сначала устанавливаем начальные значения
          gsap.set(element, {
            y: -50,
            opacity: 0
          })
          
          // Затем анимируем появление
          gsap.to(element, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
            clearProps: "y",
            onComplete: () => {
              isAnimating.value = false
            }
          })
        }
      }, 50) // Небольшая задержка для гарантии обновления DOM
    }
  })
}

// Функция для прокрутки к секции about
const scrollToAbout = (event: Event) => {
  event.preventDefault()
  const aboutSection = document.querySelector('.about-section')
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// Остальные функции Three.js остаются без изменений...
const initThree = () => {
  // Scene setup with winter colors
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a1a2a)
  scene.fog = new THREE.Fog(0x0a1a2a, 20, 50)
  
  // Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(8, 3, 12)
  camera.lookAt(0, 0, 0)
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  heroRef.value?.appendChild(renderer.domElement)
}

const setupLights = () => {
  // Ambient light for base illumination
  const ambientLight = new THREE.AmbientLight(0x404060)
  scene.add(ambientLight)
  
  // Main directional light (like winter sun)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
  directionalLight.position.set(5, 10, 7)
  directionalLight.castShadow = true
  directionalLight.receiveShadow = true
  directionalLight.shadow.mapSize.width = 1024
  directionalLight.shadow.mapSize.height = 1024
  const d = 15
  directionalLight.shadow.camera.left = -d
  directionalLight.shadow.camera.right = d
  directionalLight.shadow.camera.top = d
  directionalLight.shadow.camera.bottom = -d
  directionalLight.shadow.camera.near = 1
  directionalLight.shadow.camera.far = 25
  scene.add(directionalLight)
  
  // Blue accent lights for winter mood
  const blueLight1 = new THREE.PointLight(0x4466ff, 2, 20)
  blueLight1.position.set(-3, 2, 3)
  scene.add(blueLight1)
  
  const blueLight2 = new THREE.PointLight(0x88aaff, 1.5, 20)
  blueLight2.position.set(4, 1, -2)
  scene.add(blueLight2)
  
  // Back light for rim lighting
  const backLight = new THREE.PointLight(0x88ccff, 1, 15)
  backLight.position.set(0, 2, -5)
  scene.add(backLight)
}

const setupControls = () => {
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.autoRotate = true
  controls.autoRotateSpeed = 1.5
  controls.enableZoom = true
  controls.enablePan = false
  controls.maxPolarAngle = Math.PI / 2.5
  controls.minDistance = 8
  controls.maxDistance = 20
  controls.target.set(0, 0.8, 0)
}

const loadModel = () => {
  const loader = new GLTFLoader()
  
  loader.load(
    '/src/assets/porsche.glb',
    (gltf) => {
      model = gltf.scene
      
      // Центрируем и масштабируем модель
      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      
      model.position.sub(center)
      model.position.y = 0
      
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 3 / maxDim
      model.scale.setScalar(scale)
      
      model.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true
          node.receiveShadow = true
          
          if (node.material) {
            if (Array.isArray(node.material)) {
              node.material.forEach(mat => {
                mat.roughness = Math.min(mat.roughness || 0.5, 0.3)
                mat.metalness = Math.max(mat.metalness || 0.5, 0.7)
                mat.emissive = new THREE.Color(0x112233)
                mat.emissiveIntensity = 0.2
              })
            } else {
              node.material.roughness = Math.min(node.material.roughness || 0.5, 0.3)
              node.material.metalness = Math.max(node.material.metalness || 0.5, 0.7)
              node.material.emissive = new THREE.Color(0x112233)
              node.material.emissiveIntensity = 0.2
            }
          }
        }
      })
      
      scene.add(model)
      
      model.scale.set(0, 0, 0)
      gsap.to(model.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: 2,
        ease: "elastic.out(1, 0.5)",
        delay: 0.5
      })
    },
    (progress) => {
      console.log('Loading model:', (progress.loaded / progress.total * 100) + '%')
    },
    (error) => {
      console.error('Error loading model:', error)
      createFallbackModel()
    }
  )
}

const createFallbackModel = () => {
  const carGroup = new THREE.Group()
  
  const bodyGeo = new THREE.BoxGeometry(2, 0.5, 4)
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4466ff, metalness: 0.8, roughness: 0.2 })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.position.y = 0.5
  body.castShadow = true
  body.receiveShadow = true
  carGroup.add(body)
  
  const cabinGeo = new THREE.BoxGeometry(1.5, 0.5, 1.5)
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0x88aaff, metalness: 0.3, roughness: 0.4 })
  const cabin = new THREE.Mesh(cabinGeo, cabinMat)
  cabin.position.set(0, 1, -0.5)
  cabin.castShadow = true
  cabin.receiveShadow = true
  carGroup.add(cabin)
  
  const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16)
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.5 })
  
  const positions = [
    [-1, 0.3, 1.2],
    [1, 0.3, 1.2],
    [-1, 0.3, -1.2],
    [1, 0.3, -1.2]
  ]
  
  positions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat)
    wheel.position.set(pos[0], pos[1], pos[2])
    wheel.rotation.z = Math.PI / 2
    wheel.castShadow = true
    wheel.receiveShadow = true
    carGroup.add(wheel)
  })
  
  scene.add(carGroup)
  model = carGroup
}

const createSnow = () => {
  const snowGeometry = new THREE.BufferGeometry()
  const snowCount = 1500
  const positions = new Float32Array(snowCount * 3)
  const colors = new Float32Array(snowCount * 3)
  
  for (let i = 0; i < snowCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20 + 5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40
    
    const blueTint = Math.random() * 0.3
    colors[i * 3] = 0.9 + Math.random() * 0.1
    colors[i * 3 + 1] = 0.9 + Math.random() * 0.1
    colors[i * 3 + 2] = 1.0
  }
  
  snowGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  snowGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  
  const snowMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    map: createSnowflakeTexture()
  })
  
  snowParticles = new THREE.Points(snowGeometry, snowMaterial)
  scene.add(snowParticles)
  
  const iceGeometry = new THREE.BufferGeometry()
  const icePositions = new Float32Array(500 * 3)
  
  for (let i = 0; i < 500; i++) {
    icePositions[i * 3] = (Math.random() - 0.5) * 30
    icePositions[i * 3 + 1] = (Math.random() - 0.5) * 15
    icePositions[i * 3 + 2] = (Math.random() - 0.5) * 30
  }
  
  iceGeometry.setAttribute('position', new THREE.BufferAttribute(icePositions, 3))
  
  const iceMaterial = new THREE.PointsMaterial({
    size: 0.08,
    color: 0x88aaff,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  })
  
  const iceParticles = new THREE.Points(iceGeometry, iceMaterial)
  scene.add(iceParticles)
}

const createSnowflakeTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  
  if (ctx) {
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(16, 16, 6, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 2
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const x = 16 + Math.cos(angle) * 10
      const y = 16 + Math.sin(angle) * 10
      ctx.beginPath()
      ctx.moveTo(16, 16)
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

const createGround = () => {
  const groundGeometry = new THREE.CircleGeometry(30, 32)
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a2a3a,
    roughness: 0.8,
    metalness: 0.1,
    emissive: new THREE.Color(0x112233)
  })
  
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.1
  ground.receiveShadow = true
  scene.add(ground)
  
  for (let i = 0; i < 20; i++) {
    const moundGeo = new THREE.SphereGeometry(0.5 + Math.random() * 0.5, 8)
    const moundMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: new THREE.Color(0x112233),
      emissiveIntensity: 0.2
    })
    const mound = new THREE.Mesh(moundGeo, moundMat)
    mound.position.set(
      (Math.random() - 0.5) * 15,
      0,
      (Math.random() - 0.5) * 15
    )
    mound.scale.y = 0.3
    mound.castShadow = true
    mound.receiveShadow = true
    scene.add(mound)
  }
}

// Добавляем создание земли после инициализации
onMounted(() => {
  createGround()
})

const animate = () => {
  requestAnimationFrame(animate)
  
  if (controls) {
    controls.update()
  }
  
  if (snowParticles) {
    const positions = snowParticles.geometry.attributes.position.array
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] -= 0.02
      
      if (positions[i] < -5) {
        positions[i] = 15
        positions[i - 1] = (Math.random() - 0.5) * 40
        positions[i + 1] = (Math.random() - 0.5) * 40
      }
    }
    snowParticles.geometry.attributes.position.needsUpdate = true
  }
  
  if (model) {
    model.rotation.y += 0.001
  }
  
  renderer.render(scene, camera)
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const onMouseMove = (event: MouseEvent) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1
  
  if (camera && !controls.autoRotate) {
    gsap.to(camera.position, {
      x: 8 + mouseX * 2,
      y: 3 + mouseY * 0.5,
      duration: 1,
      ease: "power2.out"
    })
  }
}

const initTextAnimations = () => {
  const title = document.querySelector('.hero-title')
  if (title) {
    gsap.from(title, {
      y: 100,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out'
    })
  }
}
</script>

<template>
  <section ref="heroRef" class="hero">
    <div class="hero-content">
      <!-- Анимированный заголовок -->
      <div class="hero-title-wrapper">
        <span ref="titleRef" class="hero-title">{{ greetings[currentGreetingIndex] }}</span>
      </div>
      
      <!-- Кликабельный сабтайтл - только слово "here" кликабельно -->
      <p class="hero-subtitle">
        Click 
        <a 
          href="#about" 
          @click="scrollToAbout"
          class="clickable-link"
        >
          here
        </a> 
        to see more
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #0a1a2a;
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  color: white;
  text-shadow: 0 0 30px rgba(68, 102, 255, 0.5);
  width: 100%;
  padding: 0 2rem;
}

.hero-title-wrapper {
  display: block;
  margin-bottom: 1rem;
  height: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* Важно для анимации */
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  background: linear-gradient(135deg, #fff, #88aaff, #4466ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
  animation: titleGlow 3s ease-in-out infinite;
  display: inline-block;
  will-change: transform, opacity;
  white-space: nowrap; /* Предотвращает перенос текста */
}

@keyframes titleGlow {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(68, 102, 255, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 40px rgba(68, 102, 255, 0.6));
  }
}

.hero-subtitle {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 1px;
  margin-bottom: 2rem;
  display: flex;
  gap: 0.3rem;
  justify-content: center;
  flex-wrap: wrap;
}

.clickable-link {
  color: #88aaff;
  text-decoration: none;
  position: relative;
  display: inline-block;
  cursor: pointer;
  pointer-events: auto;
  padding: 0 0.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.clickable-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #4466ff, #88aaff);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.clickable-link:hover {
  color: #fff;
  text-shadow: 0 0 20px rgba(68, 102, 255, 0.8);
}

.clickable-link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

@keyframes scrollDown {
  0% {
    opacity: 0;
    transform: rotate(45deg) translate(-20px, -20px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(45deg) translate(20px, 20px);
  }
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background: radial-gradient(circle at 20% 30%, rgba(68, 102, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(136, 170, 255, 0.1) 0%, transparent 50%);
  z-index: 5;
}

.hero::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 20px,
    rgba(68, 102, 255, 0.02) 20px,
    rgba(68, 102, 255, 0.02) 40px
  );
  pointer-events: none;
  z-index: 5;
}
</style>