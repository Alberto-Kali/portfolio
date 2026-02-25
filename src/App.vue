<template>
  <div>
    <!-- 3D-сцена (всегда видима) -->
    <ThreeSceneManager ref="threeManager" />

    <!-- Триггерный блок для анимации камеры (высота = 200vh) -->
    <div class="camera-trigger" ref="triggerRef"></div>

    <!-- Контейнер с контентом после сферы -->
    <div ref="contentContainer" class="content-after-sphere">
      <AboutSection />
      <SkillsSection />
      <!-- Добавьте другие секции по мере необходимости -->
    </div>

    <!-- Отладка (можно убрать) -->
    <div class="debug-info">
      scrollY: {{ scrollY.toFixed(0) }} | progress: {{ cameraProgress.toFixed(3) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ThreeSceneManager from './components/ThreeSceneManager.vue'
import AboutSection from './components/AboutSection.vue'
import SkillsSection from './components/SkillsSection.vue'

gsap.registerPlugin(ScrollTrigger)

const threeManager = ref<InstanceType<typeof ThreeSceneManager> | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const contentContainer = ref<HTMLElement | null>(null)

const cameraProgress = ref(0)
const scrollY = ref(0)

let scrollTrigger: ScrollTrigger
let triggerHeight = 0       // высота триггерного блока в пикселях
let contentHeight = 0       // общая высота контента
let totalHeight = 0         // общая высота прокрутки

// Функция обновления размеров и пересоздания ScrollTrigger
async function updateDimensions() {
  if (!triggerRef.value || !contentContainer.value) return

  // Даём время на отрисовку
  await nextTick()

  // Вычисляем высоту триггерного блока (200vh)
  triggerHeight = window.innerHeight * 2
  triggerRef.value.style.height = triggerHeight + 'px'

  // Вычисляем высоту контента
  contentHeight = contentContainer.value.offsetHeight

  totalHeight = triggerHeight + contentHeight

  // Убиваем старый ScrollTrigger, если есть
  if (scrollTrigger) {
    scrollTrigger.kill()
  }

  // Создаём новый ScrollTrigger на всё тело
  scrollTrigger = ScrollTrigger.create({
    trigger: document.body,
    start: 0,
    end: totalHeight,
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress // от 0 до 1
      const triggerPart = triggerHeight / totalHeight

      if (progress <= triggerPart) {
        // Фаза анимации камеры
        const camProgress = progress / triggerPart
        cameraProgress.value = camProgress
        threeManager.value?.updateProgress(camProgress)
      } else {
        // Камера остаётся в конечной точке (прогресс = 1)
        cameraProgress.value = 1
        threeManager.value?.updateProgress(1)
      }

      // Для отладки сохраняем scrollY
      scrollY.value = window.scrollY
    }
  })

  // Обновляем ScrollTrigger, чтобы применить новый end
  ScrollTrigger.refresh()
}

onMounted(async () => {
  await updateDimensions()

  // Обновляем при ресайзе окна
  window.addEventListener('resize', () => {
    updateDimensions()
  })
})

onUnmounted(() => {
  scrollTrigger?.kill()
  window.removeEventListener('resize', updateDimensions)
})
</script>

<style scoped>
.camera-trigger {
  width: 100%;
  pointer-events: none; /* чтобы не мешать кликам */
}

.content-after-sphere {
  position: relative;
  z-index: 10;            /* выше canvas */
  background-color: rgba(10, 20, 30, 0.7); /* полупрозрачный фон */
  color: white;
  backdrop-filter: blur(2px); /* лёгкое размытие для читаемости */
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