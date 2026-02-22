<!-- components/ContactSection.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const formRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // Form animation
  gsap.from(formRef.value, {
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top center',
      end: 'bottom center'
    },
    scale: 0.8,
    opacity: 0,
    duration: 1.5,
    ease: 'elastic.out(1, 0.5)'
  })
  
  // Input fields animation
  gsap.from('.form-group', {
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top center'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power4.out'
  })
})
</script>

<template>
  <section ref="sectionRef" class="contact-section">
    <div class="container">
      <h2 class="section-title">Get In Touch</h2>
      
      <div ref="formRef" class="contact-container">
        <form class="contact-form">
          <div class="form-group">
            <input type="text" placeholder="Your Name" required>
          </div>
          
          <div class="form-group">
            <input type="email" placeholder="Your Email" required>
          </div>
          
          <div class="form-group">
            <textarea placeholder="Your Message" rows="5" required></textarea>
          </div>
          
          <button type="submit" class="submit-btn">Send Message</button>
        </form>
        
        <div class="contact-info">
          <h3>Let's work together</h3>
          <p>Feel free to reach out for collaborations or just a friendly hello</p>
          
          <div class="social-links">
            <a href="#" class="social-link">GitHub</a>
            <a href="#" class="social-link">LinkedIn</a>
            <a href="#" class="social-link">Twitter</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #0f0f1f 0%, #1a1a2e 100%);
  color: white;
  padding: 5rem 0;
}

.section-title {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 4rem;
  background: linear-gradient(45deg, #fff, #88aaff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4466ff;
  box-shadow: 0 0 20px rgba(68, 102, 255, 0.3);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, #4466ff, #8844ff);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(68, 102, 255, 0.4);
}

.contact-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.contact-info h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #fff, #88aaff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.contact-info p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #4466ff;
  border-color: #4466ff;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem;
  }
}
</style>
