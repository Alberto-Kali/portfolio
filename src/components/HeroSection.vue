<!-- components/HeroSection.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'

const heroRef = ref<HTMLElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let particles: THREE.Points
let mouseX = 0
let mouseY = 0

onMounted(() => {
  initThree()
  animateThree()
  initTextAnimations()
  window.addEventListener('mousemove', onMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  renderer.dispose()
})

const initThree = () => {
  // Scene setup
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x050510)
  
  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 15
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  heroRef.value?.appendChild(renderer.domElement)
  
  // Create floating particles
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 2000
  const posArray = new Float32Array(particlesCount * 3)
  const colorArray = new Float32Array(particlesCount * 3)
  
  for(let i = 0; i < particlesCount * 3; i += 3) {
    // Positions
    posArray[i] = (Math.random() - 0.5) * 50
    posArray[i+1] = (Math.random() - 0.5) * 50
    posArray[i+2] = (Math.random() - 0.5) * 50
    
    // Colors - gradient from blue to purple
    const color = new THREE.Color()
    const hue = 0.2 + Math.random() * 0.2 // Blue to purple range
    color.setHSL(hue, 0.8, 0.5)
    colorArray[i] = color.r
    colorArray[i+1] = color.g
    colorArray[i+2] = color.b
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))
  
  // Material
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true
  })
  
  // Points
  particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)
  
  // Add a central glow sphere
  //const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
  //const sphereMaterial = new THREE.MeshBasicMaterial({
  //  color: 0xf43333,
  //  transparent: true,
  //  opacity: 0.2
  //})
  //const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  //scene.add(sphere)
  
  // Add some orbiting particles
  //const orbitGeometry = new THREE.BufferGeometry()
  //const orbitCount = 100
  //const orbitPositions = new Float32Array(orbitCount * 3)
  
  //for(let i = 0; i < orbitCount; i++) {
  //  const angle = (i / orbitCount) * Math.PI * 2
  //  orbitPositions[i*3] = Math.cos(angle) * 3
  //  orbitPositions[i*3+1] = Math.sin(angle) * 3
  //  orbitPositions[i*3+2] = 0
  //}
  
  //orbitGeometry.setAttribute('position', new THREE.BufferAttribute(orbitPositions, 3))
  //const orbitMaterial = new THREE.PointsMaterial({
  //  size: 0.05,
  //  color: 0xf43333
  //})
  //const orbitPoints = new THREE.Points(orbitGeometry, orbitMaterial)
  //scene.add(orbitPoints)
}

const animateThree = () => {
  requestAnimationFrame(animateThree)
  
  // Rotate particles based on mouse position
  if(particles) {
    particles.rotation.y += 0.0002
    particles.rotation.x += 0.0001
    
    // Interactive movement based on mouse
    particles.rotation.y += mouseX * 0.0005
    particles.rotation.x += mouseY * 0.0005
  }
  
  renderer.render(scene, camera)
}

const onMouseMove = (event: MouseEvent) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1
}

const initTextAnimations = () => {
  // Title animation
  gsap.from('.hero-title', {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: 'power4.out'
  })
  
  // Subtitle animation with character splitting
  const subtitle = document.querySelector('.hero-subtitle')
  if(subtitle) {
    const text = subtitle.textContent || ''
    subtitle.innerHTML = ''
    
    // Split text into characters
    text.split('').forEach((char, index) => {
      const span = document.createElement('span')
      span.textContent = char
      span.style.display = 'inline-block'
      span.style.opacity = '0'
      span.style.transform = 'translateY(20px)'
      subtitle.appendChild(span)
      
      // Animate each character
      gsap.to(span, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: 1 + index * 0.05,
        ease: 'back.out(1.7)'
      })
    })
  }
}
</script>

<template>
  <section ref="heroRef" class="hero">
    <div class="hero-content">
      <h1 class="hero-title">Hello World!</h1>
      <p class="hero-subtitle">Creative Developer & Designer</p>
    </div>
    

  </section>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #050510;
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  color: white;
  pointer-events: none;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 0 20px rgba(255, 68, 68, 0.5);
  background: linear-gradient(45deg, #656565, #754040);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
}

.hero-subtitle {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 1px;
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
</style>