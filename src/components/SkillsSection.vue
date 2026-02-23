<template>
  <section class="horizontal-section skills-section" id="skills">
    <div class="animated-particles"></div>

    <div class="container">
      <h2 class="section-title animate-on-scroll">Навыки & Опыт</h2>

      <div class="content-wrapper">
        <div class="skills-container">
          <div
            v-for="(skill, idx) in skills"
            :key="skill.name"
            class="skill-item animate-on-scroll"
            :style="{ transitionDelay: idx * 0.1 + 's' }"
          >
            <div class="skill-header">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-percentage" :style="{ color: skill.color }">{{ skill.level }}%</span>
            </div>

            <div class="skill-bar-bg">
              <div
                class="skill-bar"
                :style="{
                  '--skill-color': skill.color,
                  width: skill.level + '%'
                }"
              ></div>
            </div>
          </div>
        </div>

        <div class="chart-container animate-on-scroll">
          <Radar :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { Radar } from 'vue-chartjs'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const skills = [
  { name: 'Python', level: 90, color: '#ffd506' },
  { name: 'JavaScript', level: 85, color: '#44ff44' },
  { name: 'Flutter', level: 88, color: '#484ef4' },
  { name: 'Go', level: 85, color: '#3178c6' },
  { name: 'Node.js', level: 80, color: '#68a063' },
  { name: 'Haskell', level: 75, color: '#b12aff' }
]

const chartData = {
  labels: skills.map(s => s.name),
  datasets: [
    {
      label: 'Уровень владения',
      backgroundColor: 'rgba(100, 150, 255, 0.2)',
      borderColor: 'rgba(100, 150, 255, 0.8)',
      pointBackgroundColor: skills.map(s => s.color),
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: skills.map(s => s.color),
      data: skills.map(s => s.level)
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 2000, easing: 'easeOutQuart' },
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      ticks: { stepSize: 20, color: 'rgba(255,255,255,0.7)', backdropColor: 'transparent' },
      grid: { color: 'rgba(255,255,255,0.1)' },
      pointLabels: { color: 'rgba(255,255,255,0.9)', font: { size: 12 } }
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1
    }
  }
}

onMounted(() => {
  // Фоновая анимация
  gsap.to('.skills-section', {
    background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
    duration: 10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
})
</script>

<style scoped>
.skills-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: #1a1a2e;
  color: white;
  position: relative;
  overflow: hidden;
  padding: 4rem 0;
}

.animated-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 50%, rgba(68,102,255,0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(136,68,255,0.15) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

.section-title {
  text-align: center;
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 4rem;
  background: linear-gradient(135deg, #fff, #88aaff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.skills-container {
  width: 100%;
}

.skill-item {
  margin-bottom: 1.8rem;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.skill-name {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.skill-percentage {
  font-weight: 600;
  text-shadow: 0 0 10px currentColor;
}

.skill-bar-bg {
  width: 100%;
  height: 10px;
  background: rgba(255,255,255,0.1);
  border-radius: 5px;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

.skill-bar {
  height: 100%;
  background: var(--skill-color);
  border-radius: 5px;
  width: 0; /* будет анимировано через ScrollTrigger */
  box-shadow: 0 0 20px var(--skill-color);
  transition: box-shadow 0.3s ease;
}

.skill-bar:hover {
  box-shadow: 0 0 30px var(--skill-color);
}

.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
  background: rgba(255,255,255,0.03);
  border-radius: 20px;
  padding: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .chart-container {
    height: 350px;
    order: -1;
  }
}

@media (max-width: 480px) {
  .container { padding: 0 1rem; }
  .chart-container { height: 300px; }
}
</style>