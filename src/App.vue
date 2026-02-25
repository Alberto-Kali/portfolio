<template>
  <div>
    <!-- Режим 1: Three.js сцена -->
    <div v-if="mode === 'scene'" class="scene-mode">
      <ThreeSceneManager
        ref="threeManager"
        :progress="sceneProgress"
        @onBlackSphereCover="switchToSite"
      />
      <div class="scene-spacer" :style="{ height: sceneHeight + 'px' }"></div>
    </div>

    <!-- Режим 2: Обычный сайт -->
    <div v-else ref="siteModeRef" class="site-mode">
      <HorizontalSections :sections="sections">
        <AboutSection />
        <SkillsSection />
      </HorizontalSections>
      <ProjectsSection />
      <ContactSection />
    </div>

    <!-- Отладочная информация (можно убрать) -->
    <div class="debug-info">
      Mode: {{ mode }} | sceneProgress: {{ sceneProgress.toFixed(2) }}
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

const mode = ref<'scene' | 'site'>('scene')
const threeManager = ref<InstanceType<typeof ThreeSceneManager> | null>(null)
const siteModeRef = ref<HTMLElement | null>(null)
const sceneProgress = ref(0)

const sections = [
  { id: 'about', title: 'Обо мне' },
  { id: 'skills', title: 'Навыки' }
]

const sceneHeight = window.innerHeight * 8 // 800vh – подберите под свою анимацию

let sceneTrigger: ScrollTrigger
let backTrigger: ScrollTrigger | null = null

onMounted(() => {
  // Триггер для управления камерой
  sceneTrigger = ScrollTrigger.create({
    trigger: document.body,
    start: 0,
    end: sceneHeight,
    scrub: true,
    onUpdate: (self) => {
      sceneProgress.value = self.progress
      threeManager.value?.updateProgress(self.progress)
    }
  })
})

// Переключение на сайт
async function switchToSite() {
  mode.value = 'site'
  await nextTick() // ждём рендера сайта

  // Прокручиваем точно к началу сайта
  if (siteModeRef.value) {
    const top = siteModeRef.value.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top, behavior: 'auto' }) // 'auto' – мгновенно
  }

  // Плавно скрываем canvas
  gsap.to('.three-canvas-fixed', { opacity: 0, duration: 1 })

  // Отключаем триггер сцены
  sceneTrigger.disable()

  // Создаём триггер для возврата при overscroll вверх
  backTrigger = ScrollTrigger.create({
    trigger: siteModeRef.value,
    start: 'top top',
    end: 'top top-=1', // очень маленький диапазон
    onLeaveBack: () => {
      // Пользователь прокрутил выше начала сайта – возвращаемся на сцену
      switchToScene()
    }
  })
}

// Возврат на сцену
function switchToScene() {
  // Убиваем триггер сайта
  backTrigger?.kill()
  backTrigger = null

  // Включаем триггер сцены
  sceneTrigger.enable()

  // Показываем canvas
  gsap.to('.three-canvas-fixed', { opacity: 1, duration: 1 })

  // Сбрасываем прогресс камеры в 0
  sceneProgress.value = 0
  threeManager.value?.updateProgress(0)

  // Прокручиваем к началу сцены
  window.scrollTo({ top: 0, behavior: 'auto' })

  // Переключаем режим
  mode.value = 'scene'
}

onUnmounted(() => {
  sceneTrigger?.kill()
  backTrigger?.kill()
})
</script>

<style>
body {
  margin: 0;
  background: #0a1a2a;
}
.scene-mode {
  position: relative;
  z-index: 1;
}
.site-mode {
  position: relative;
  z-index: 10;
  background: #0a1a2a;
  min-height: 100vh;
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

/* Стили для вертикальных секций */
.site-mode section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
}

.site-mode section > * {
  max-width: 1200px;
  width: 100%;
}
</style>