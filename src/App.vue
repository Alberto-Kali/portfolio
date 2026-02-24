<template>
  <div>
    <!-- 3D-сцена всегда присутствует, но может быть скрыта визуально после завершения -->
    <ThreeSceneManager
      ref="threeManager"
      :style="{ opacity: isThreeVisible ? 1 : 0, pointerEvents: isThreeVisible ? 'none' : 'none' }"
    />

    <!-- Обёртка для всего контента после сферы. Она всегда в потоке, но видима только когда надо -->
    <div ref="afterSphereWrapper" class="after-sphere-wrapper" :class="{ 'visible': showHorizontal }">
      <!-- Горизонтальный блок (About + Skills) -->
      <HorizontalSections :sections="sections">
        <AboutSection />
        <SkillsSection />
      </HorizontalSections>

      <!-- Вертикальные секции -->
      <ProjectsSection />
      <ContactSection />
    </div>

    <!-- Отладка -->
    <div class="debug-info">
      threeProgress: {{ threeProgress.toFixed(3) }} | horizProgress: {{ horizProgress.toFixed(3) }} | showHorizontal: {{ showHorizontal }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ThreeSceneManager from './components/ThreeSceneManager.vue'
import HorizontalSections from './components/HorizontalSections.vue'
import AboutSection from './components/AboutSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'

gsap.registerPlugin(ScrollTrigger)

const threeManager = ref<InstanceType<typeof ThreeSceneManager> | null>(null)
const afterSphereWrapper = ref<HTMLElement | null>(null)

const threeProgress = ref(0)
const horizProgress = ref(0)
const isThreeVisible = ref(true)
const showHorizontal = ref(false)

const sections = [
  { id: 'about', title: 'Обо мне' },
  { id: 'skills', title: 'Навыки' }
]

// Высоты (в vh)
const threeJsHeight = 700 // подберите под желаемую скорость
let horizontalHeight = 0   // будет вычислено
let totalHeight = 0

let mainTrigger: ScrollTrigger

onMounted(async () => {
  // Даём отрендериться, чтобы измерить горизонтальный контейнер
  await nextTick()

  // Измеряем ширину горизонтального контента
  const container = document.querySelector('.horizontal-container') as HTMLElement
  if (container) {
    const totalWidth = container.scrollWidth - window.innerWidth
    horizontalHeight = (totalWidth / window.innerHeight) * 100
  } else {
    horizontalHeight = 200 // запас
  }

  totalHeight = threeJsHeight + horizontalHeight
  document.body.style.minHeight = totalHeight + 'vh'

  // Создаём единый ScrollTrigger
  mainTrigger = ScrollTrigger.create({
    trigger: document.body,
    start: 0,
    end: totalHeight + 'vh',
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress
      const threePart = threeJsHeight / totalHeight

      if (progress <= threePart) {
        // Фаза 1: камера
        const p = progress / threePart
        threeProgress.value = p
        threeManager.value?.updateProgress(p)

        // Показываем трёхмерную сцену, скрываем горизонтальный контент
        if (!isThreeVisible.value) isThreeVisible.value = true
        if (showHorizontal.value) showHorizontal.value = false
      } else {
        // Фаза 2: горизонтальный скролл
        const p = (progress - threePart) / (horizontalHeight / totalHeight)
        horizProgress.value = p

        if (!showHorizontal.value) {
          showHorizontal.value = true
          isThreeVisible.value = false
          // При первом входе позиционируем обёртку правильно (она уже в потоке)
          // Можно добавить плавное появление
          gsap.fromTo(afterSphereWrapper.value, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.5, overwrite: true }
          )
        }

        // Двигаем горизонтальный контейнер
        updateHorizontalProgress(p)
      }
    }
  })
})

function updateHorizontalProgress(p: number) {
  const container = document.querySelector('.horizontal-container') as HTMLElement
  if (!container) return
  const totalWidth = container.scrollWidth - window.innerWidth
  // Применяем трансформацию к контейнеру
  gsap.set(container, { x: -totalWidth * p })
}

onUnmounted(() => {
  mainTrigger?.kill()
})
</script>

<style>
body {
  margin: 0;
  background: #0a1a2a;
}

.after-sphere-wrapper {
  opacity: 0; /* изначально скрыт */
  transition: opacity 0.5s;
}

.after-sphere-wrapper.visible {
  opacity: 1;
}

.debug-info {
  position: fixed;
  bottom: 20px;
  right: 20px;
  color: white;
  background: rgba(0,0,0,0.7);
  padding: 8px 12px;
  border-radius: 8px;
  z-index: 1000;
  font-family: monospace;
}
</style>