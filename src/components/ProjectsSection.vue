<!-- components/ProjectsSection.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    title: '3D Interactive Portfolio',
    description: 'A stunning 3D portfolio with Three.js and WebGL',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    tags: ['Three.js', 'Vue', 'GSAP'],
    color: '#4466ff'
  },
  {
    title: 'E-Commerce Platform',
    description: 'Modern e-commerce solution with smooth animations',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    tags: ['Vue', 'Node.js', 'MongoDB'],
    color: '#8844ff'
  },
  {
    title: 'Creative Agency Site',
    description: 'Agency website with cinematic scroll animations',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
    tags: ['GSAP', 'ScrollTrigger', 'Vue'],
    color: '#ff44aa'
  },
  {
    title: 'Weather App',
    description: 'Beautiful weather app with animated backgrounds',
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b',
    tags: ['Vue', 'API', 'CSS'],
    color: '#44ffaa'
  }
]

const sectionRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement[]>([])

onMounted(() => {
  // Animate cards on scroll
  cardsRef.value.forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top bottom-=100',
        end: 'bottom center',
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      duration: 1,
      delay: index * 0.2,
      ease: 'power4.out'
    })
  })
  
  // Stagger animation for tags
  gsap.from('.project-tag', {
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top center',
      end: 'bottom center'
    },
    scale: 0,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  })
})
</script>

<template>
  <section ref="sectionRef" class="projects-section">
    <div class="container">
      <h2 class="section-title">Галерея Проектов</h2>
      
      <div class="projects-grid">
        <div
          v-for="(project, index) in projects"
          :key="index"
          ref="cardsRef"
          class="project-card"
          :style="{ '--card-color': project.color }"
        >
          <div class="card-image">
            <img :src="project.image" :alt="project.title">
            <div class="card-overlay"></div>
          </div>
          
          <div class="card-content">
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            
            <div class="project-tags">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="project-tag"
              >
                {{ tag }}
              </span>
            </div>
            
            <button class="view-project">View Project →</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects-section {
  background: #0a0a0a;
  padding: 5rem 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  color: white;
}

.section-title {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 4rem;
  background: linear-gradient(45deg, #fff, #88aaff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.project-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(68, 102, 255, 0.2);
  border-color: var(--card-color);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project-card:hover .card-image img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8));
}

.card-content {
  padding: 1.5rem;
}

.card-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: white;
}

.card-content p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.project-tag {
  padding: 0.3rem 0.8rem;
  background: rgba(68, 102, 255, 0.2);
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--card-color);
  border: 1px solid var(--card-color);
}

.view-project {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--card-color);
  color: var(--card-color);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-project:hover {
  background: var(--card-color);
  color: white;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>