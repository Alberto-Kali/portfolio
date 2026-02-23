<template>
  <canvas ref="canvasRef" class="three-canvas-fixed"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'

const props = defineProps<{
  progress: number // от 0 до 1
}>()

const emit = defineEmits<{
  (e: 'onBlackSphereCover'): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let model: THREE.Group
let snowParticles: THREE.Points
let blackSphere: THREE.Mesh

// Ключевые точки для камеры
const startPos = new THREE.Vector3(8, 3, 12)
const startTarget = new THREE.Vector3(0, 0.8, 0)

const closePos = new THREE.Vector3(2, 1, 3)
const closeTarget = new THREE.Vector3(0, 0.8, 0)

const verticalPos = new THREE.Vector3(0, 10, 0)
const verticalTarget = new THREE.Vector3(0, 20, 0) // смотрим вверх

const spherePos = new THREE.Vector3(0, 19, 0)    // почти у сферы
const sphereTarget = new THREE.Vector3(0, 20, 0) // сфера в (0,20,0)

// Текущие значения для интерполяции
const currentPos = new THREE.Vector3()
const currentTarget = new THREE.Vector3()

// Обновление камеры в зависимости от прогресса
function updateCamera(progress: number) {
  let p: number
  let from: THREE.Vector3, to: THREE.Vector3
  let targetFrom: THREE.Vector3, targetTo: THREE.Vector3

  if (progress < 0.4) {
    // Этап 0 → 1: приближение
    p = progress / 0.4
    from = startPos
    to = closePos
    targetFrom = startTarget
    targetTo = closeTarget
  } else if (progress < 0.7) {
    // Этап 1 → 2: переход к вертикальному обзору
    p = (progress - 0.4) / 0.3
    from = closePos
    to = verticalPos
    targetFrom = closeTarget
    targetTo = verticalTarget
  } else {
    // Этап 2 → 3: движение к чёрной сфере
    p = (progress - 0.7) / 0.3
    from = verticalPos
    to = spherePos
    targetFrom = verticalTarget
    targetTo = sphereTarget
  }

  currentPos.lerpVectors(from, to, p)
  currentTarget.lerpVectors(targetFrom, targetTo, p)

  camera.position.copy(currentPos)
  camera.lookAt(currentTarget)

  // При достижении конца анимации сообщаем родителю
  if (progress >= 0.99) {
    emit('onBlackSphereCover')
  }
}

// Инициализация Three.js
function initThree() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a1a2a)
  scene.fog = new THREE.Fog(0x0a1a2a, 20, 50)

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.copy(startPos)
  camera.lookAt(startTarget)

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value!, antialias: true, alpha: false })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2

  setupLights()
  createGround()
  createSnow()
  loadModel()
  createBlackSphere()
}

// Освещение (зимняя атмосфера)
function setupLights() {
  const ambientLight = new THREE.AmbientLight(0x404060)
  scene.add(ambientLight)

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

  const blueLight1 = new THREE.PointLight(0x4466ff, 2, 20)
  blueLight1.position.set(-3, 2, 3)
  scene.add(blueLight1)

  const blueLight2 = new THREE.PointLight(0x88aaff, 1.5, 20)
  blueLight2.position.set(4, 1, -2)
  scene.add(blueLight2)

  const backLight = new THREE.PointLight(0x88ccff, 1, 15)
  backLight.position.set(0, 2, -5)
  scene.add(backLight)
}

// Земля и сугробы
function createGround() {
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

// Снег и ледяные частицы
function createSnow() {
  const snowGeometry = new THREE.BufferGeometry()
  const snowCount = 1500
  const positions = new Float32Array(snowCount * 3)
  const colors = new Float32Array(snowCount * 3)

  for (let i = 0; i < snowCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20 + 5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40

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

function createSnowflakeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')!
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
  return new THREE.CanvasTexture(canvas)
}

// Загрузка модели Porsche (или fallback)
function loadModel() {
  const loader = new GLTFLoader()
  loader.load(
    '/src/assets/porsche.glb',
    (gltf) => {
      model = gltf.scene
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
      })

      scene.add(model)

      // Анимация появления модели
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
    undefined,
    (error) => {
      console.error('Error loading model:', error)
      createFallbackModel()
    }
  )
}

// Запасная модель (куб с колёсами)
function createFallbackModel() {
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
  const positions = [[-1, 0.3, 1.2], [1, 0.3, 1.2], [-1, 0.3, -1.2], [1, 0.3, -1.2]]
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

// Чёрная сфера
function createBlackSphere() {
  const sphereGeo = new THREE.SphereGeometry(5, 64, 64)
  const sphereMat = new THREE.MeshBasicMaterial({ color: 0x000000 })
  blackSphere = new THREE.Mesh(sphereGeo, sphereMat)
  blackSphere.position.set(0, 20, 0)
  scene.add(blackSphere)
}

// Анимационный цикл
function animate() {
  requestAnimationFrame(animate)

  // Движение снега
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

  renderer.render(scene, camera)
}

// Resize handler
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// Жизненный цикл
onMounted(() => {
  initThree()
  animate()
  window.addEventListener('resize', onWindowResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  renderer.dispose()
})

// Следим за изменением прогресса
watch(() => props.progress, (val) => {
  updateCamera(val)
}, { immediate: true })
</script>

<style scoped>
.three-canvas-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: block;
  z-index: 1;
  pointer-events: none; /* Чтобы клики проходили сквозь canvas (например, по ссылке "here") */
}
</style>