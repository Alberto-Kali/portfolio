<!-- components/AboutSection.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
let hue = 0

onMounted(() => {
  // Animated background color
  gsap.to(sectionRef.value, {
    backgroundColor: 'hsl(280, 80%, 10%)',
    duration: 10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
  
  // Text animation on scroll
  gsap.from(textRef.value, {
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top center',
      end: 'bottom center',
      toggleActions: 'play none none reverse'
    },
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: 'power4.out'
  })
  
  // Parallax effect for decorative elements
  gsap.to('.decor-circle', {
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    },
    y: 200,
    rotate: 360
  })
})
</script>

<template>
  <section ref="sectionRef" class="about-section">
    <div class="animated-bg"></div>
    
    <div class="decor-elements">
      <div class="decor-circle"></div>
      <div class="decor-circle"></div>
      <div class="decor-circle"></div>
    </div>
    
    <div class="container">
      <div ref="textRef" class="about-content">
        <h2 class="section-title">Обо Мне</h2>
        <p class="about-text">
          Привет, я systemctl, продвинутый fullstack разработчик с обширными навыками создания и поддержки абсолютно разных проектов, от ботов до ядер операционных систем. Я не занимаюсь сортировкой старых решений, а нахожу уникальный подход к каждой задаче.
        </p>
        
        <div class="stats">
          <div class="stat-item">
            <span class="stat-number">5+</span>
            <span class="stat-label">Лет опыта</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">50+</span>
            <span class="stat-label">Проектов завершено</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">20+</span>
            <span class="stat-label">Довольных заказчиков</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  background: hsl(240, 80%, 5%);
  transition: background-color 0.1s ease;
  position: relative;
  color: white;
}

.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(68, 102, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.decor-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.decor-circle {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4466ff, #8844ff);
  opacity: 0.1;
  filter: blur(50px);
}

.decor-circle:nth-child(1) {
  top: -100px;
  left: -100px;
}

.decor-circle:nth-child(2) {
  bottom: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
}

.decor-circle:nth-child(3) {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  opacity: 0.05;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.section-title {
  font-size: 3rem;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #fff, #88aaff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.about-text {
  font-size: 1.2rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 3rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #4466ff, #8844ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .stats {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>