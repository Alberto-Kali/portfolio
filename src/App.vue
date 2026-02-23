<!-- App.vue -->
<script setup lang="ts">
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ContactSection from './components/ContactSection.vue'
import HorizontalSections from './components/HorizontalSections.vue'

const sections = [
  { id: 'about', title: 'Обо мне' },
  { id: 'skills', title: 'Навыки' }
]
</script>

<template>
  <div class="app">
    <HeroSection />
    <HorizontalSections :sections="sections">
      <AboutSection />
      <SkillsSection />
    </HorizontalSections>
    <ProjectsSection />
    <ContactSection />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  overflow-x: hidden;
  background: #0a0a0a;
}

.app {
  position: relative;
}

section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}
</style>