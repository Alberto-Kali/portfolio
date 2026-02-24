<template>
  <div>
    <!-- Контейнер для горизонтального скролла -->
    <div class="horizontal-wrapper" ref="wrapperRef">
      <div class="horizontal-container" ref="containerRef">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const props = defineProps<{
  sections: Array<{ id: string; title: string }>
}>()

const wrapperRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

let ctx: gsap.Context
let horizontalTween: gsap.core.Tween | null = null
const activeIndex = ref(0)

onMounted(() => {
  ctx = gsap.context(() => {
    const wrapper = wrapperRef.value
    const container = containerRef.value
    if (!wrapper || !container) return

    const slides = gsap.utils.toArray<HTMLElement>('.horizontal-section')
    const totalWidth = container.scrollWidth - window.innerWidth

    // Основной горизонтальный tween
    horizontalTween = gsap.to(slides, {
      x: () => -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        pin: true,
        start: 'top top',
        end: () => '+=' + totalWidth,
        scrub: 1,
        onUpdate: (self) => {
          // Определяем активный слайд по прогрессу
          const newIndex = Math.round(self.progress * (slides.length - 1))
          if (newIndex !== activeIndex.value) {
            activeIndex.value = newIndex
          }
        }
      }
    })

    // Дополнительно: анимации появления элементов внутри секций при горизонтальном скролле
    slides.forEach((slide, i) => {
      gsap.from(slide.querySelectorAll('.animate-on-scroll'), {
        scrollTrigger: {
          trigger: slide,
          containerAnimation: horizontalTween,
          start: 'left center',
          end: 'right center',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8
      })
    })
  })

  // Начальная установка активного индекса (если есть якорь в URL)
  if (window.location.hash) {
    const targetId = window.location.hash.slice(1)
    const idx = props.sections.findIndex(s => s.id === targetId)
    if (idx !== -1) {
      goToSection(idx)
    }
  }
})

onUnmounted(() => {
  ctx?.revert()
})

function goToSection(index: number) {
  if (!horizontalTween || !wrapperRef.value) return
  const slides = gsap.utils.toArray<HTMLElement>('.horizontal-section')
  const targetSlide = slides[index]
  if (!targetSlide) return

  const wrapper = wrapperRef.value
  const st = horizontalTween.scrollTrigger
  if (!st) return

  // Вычисляем позицию скролла для целевого слайда
  const totalScroll = st.end - st.start
  const totalMovement = containerRef.value!.scrollWidth - window.innerWidth
  const targetX = targetSlide.offsetLeft
  const scrollY = st.start + (targetX / totalMovement) * totalScroll

  gsap.to(window, {
    scrollTo: { y: scrollY, autoKill: false },
    duration: 1
  })
}

function prevSection() {
  if (activeIndex.value > 0) {
    goToSection(activeIndex.value - 1)
  }
}

function nextSection() {
  if (activeIndex.value < props.sections.length - 1) {
    goToSection(activeIndex.value + 1)
  }
}
</script>

<style scoped>
.horizontal-wrapper {
  width: 100%;
  overflow-x: hidden;
}

.horizontal-container {
  display: flex;
  flex-wrap: nowrap;
  width: max-content;
}

:deep(.horizontal-section) {
  width: 100vw;
  flex-shrink: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
}

.page-nav {
  position: fixed;
  top: 50%;
  width: 100%;
  pointer-events: none;
  z-index: 90;
}

.page-nav span {
  pointer-events: auto;
  position: absolute;
  font-size: 2.5rem;
  color: var(--theme-primary, #8e1e7d);
  cursor: pointer;
}

.page-nav-prev {
  left: 2vw;
}

.page-nav-next {
  right: 2vw;
}

.page-nav i {
  font-size: 2.5rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}
</style>