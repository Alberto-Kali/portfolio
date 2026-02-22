<!-- components/SkillsSection.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const skills = [
  { name: 'Vue.js', level: 90, color: '#42b883' },
  { name: 'Three.js', level: 85, color: '#4466ff' },
  { name: 'GSAP', level: 88, color: '#88ff88' },
  { name: 'TypeScript', level: 85, color: '#3178c6' },
  { name: 'Node.js', level: 80, color: '#68a063' },
  { name: 'WebGL', level: 75, color: '#990000' }
]

const sectionRef = ref<HTMLElement | null>(null)
const skillBarsRef = ref<HTMLElement[]>([])

onMounted(() => {
  // Animated gradient background
  gsap.to(sectionRef.value, {
    background: 'linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)',
    duration: 10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
  
  // Animate skill bars on scroll
  skillBarsRef.value.forEach((bar, index) => {
    const level = bar.dataset.level
    
    gsap.from(bar, {
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top center',
        end: 'bottom center',
        toggleActions: 'play none none reverse'
      },
      width: 0,
      duration: 1.5,
      delay: index * 0.2,
      ease: 'power4.out'
    })
  })
  
  // Animate skill items with stagger
  gsap.from('.skill-item', {
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top center',
      end: 'bottom center'
    },
    x: -100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power4.out'
  })
})
</script>

<template>
  <section ref="sectionRef" class="skills-section">
    <div class="animated-particles"></div>
    
    <div class="container">
      <h2 class="section-title">Skills & Expertise</h2>
      
      <div class="skills-container">
        <div
          v-for="skill in skills"
          :key="skill.name"
          class="skill-item"
        >
          <div class="skill-header">
            <span class="skill-name">{{ skill.name }}</span>
            <span class="skill-percentage">{{ skill.level }}%</span>
          </div>
          
          <div class="skill-bar-bg">
            <div
              ref="skillBarsRef"
              class="skill-bar"
              :style="{
                '--skill-color': skill.color,
                width: skill.level + '%'
              }"
              :data-level="skill.level"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  background: #1a1a2e;
  color: white;
  overflow: hidden;
}

.animated-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 50%, rgba(68, 102, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(136, 68, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
  animation: particleMove 20s ease infinite alternate;
}

@keyframes particleMove {
  0% {
    transform: scale(1) translate(0, 0);
  }
  100% {
    transform: scale(1.1) translate(-2%, -2%);
  }
}

.section-title {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 4rem;
  background: linear-gradient(45deg, #fff, #88aaff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.skills-container {
  max-width: 800px;
  margin: 0 auto;
}

.skill-item {
  margin-bottom: 2rem;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.skill-name {
  font-size: 1.1rem;
  font-weight: 500;
}

.skill-percentage {
  color: var(--skill-color);
  font-weight: 600;
}

.skill-bar-bg {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
}

.skill-bar {
  height: 100%;
  background: var(--skill-color);
  border-radius: 5px;
  width: 0;
  transition: width 1.5s ease;
  box-shadow: 0 0 20px var(--skill-color);
}
</style>