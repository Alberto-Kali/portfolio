<template>
  <div class="horizontal-wrapper" ref="wrapperRef">
    <div class="horizontal-container" ref="containerRef">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const wrapperRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    const wrapper = wrapperRef.value
    const container = containerRef.value
    if (!wrapper || !container) return

    const slides = gsap.utils.toArray<HTMLElement>('.horizontal-section')
    if (slides.length === 0) return

    const totalWidth = container.scrollWidth - window.innerWidth

    // Горизонтальное перемещение всех слайдов (сдвиг контейнера)
    gsap.to(slides, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        pin: true,
        start: 'top top',
        end: () => '+=' + totalWidth,
        scrub: 1
      }
    })

    // Анимация элементов внутри слайдов (по желанию)
    slides.forEach((slide) => {
      gsap.from(slide.querySelectorAll('.animate-on-scroll'), {
        scrollTrigger: {
          trigger: slide,
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

  ScrollTrigger.refresh()
})

onUnmounted(() => {
  ctx?.revert()
})
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
</style>