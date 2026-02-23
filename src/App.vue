<template>
  <div ref="appRef">
    <ThreeSceneManager
      :progress="scrollProgress"
      @onBlackSphereCover="handleBlackSphereCover"
      v-if="showThree"
    />

    <!-- Пустой блок для создания вертикального пространства скролла -->
    <div :style="{ height: scrollHeight + 'px' }"></div>

    <!-- Горизонтальный контейнер с секциями (изначально скрыт) -->
    <div v-show="showHorizontal" class="horizontal-wrapper">
      <HorizontalSections :sections="sections">
        <AboutSection />
        <SkillsSection />
      </HorizontalSections>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ThreeSceneManager from './components/ThreeSceneManager.vue'
import HorizontalSections from './components/HorizontalSections.vue'
import AboutSection from './components/AboutSection.vue'
import SkillsSection from './components/SkillsSection.vue'

gsap.registerPlugin(ScrollTrigger)

const appRef = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
const showThree = ref(true)
const showHorizontal = ref(false)

const sections = [
  { id: 'about', title: 'Обо мне' },
  { id: 'skills', title: 'Навыки' }
]

const scrollHeight = ref(0)
let scrollTrigger: ScrollTrigger

onMounted(() => {
  // Вычисляем высоту анимации (3 экрана)
  scrollHeight.value = window.innerHeight * 4

  scrollTrigger = ScrollTrigger.create({
    trigger: document.body,
    start: 0,
    end: scrollHeight.value,
    scrub: true,
    onUpdate: (self) => {
      // progress от 0 до 1 (ограничиваем)
      scrollProgress.value = Math.min(self.progress, 1)
    }
  })
})

const handleBlackSphereCover = () => {
  // Плавно скрываем canvas и показываем горизонтальный блок
  gsap.to('.three-canvas-fixed', {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      showThree.value = false
      showHorizontal.value = true
      // Плавное появление горизонтального контейнера
      gsap.from('.horizontal-wrapper', { opacity: 0, duration: 1 })
    }
  })
}

onUnmounted(() => {
  scrollTrigger?.kill()
})
</script>

<style>
body {
  margin: 0;
  overflow-x: hidden;
  background: #0a1a2a; /* соответствует фону сцены */
}

.horizontal-wrapper {
  min-height: 100vh;
  position: relative;
  z-index: 2;
  background: transparent;
}
</style>