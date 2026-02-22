// utils/animations.ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const initGlobalAnimations = () => {
  // Smooth scroll reveal for all sections
  gsap.utils.toArray('section').forEach((section: any) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom center',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 100,
      duration: 1.5,
      ease: 'power4.out'
    })
  })
  
  // Parallax effect for background elements
  gsap.utils.toArray('.parallax-bg').forEach((bg: any) => {
    gsap.to(bg, {
      scrollTrigger: {
        trigger: bg,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: 200,
      ease: 'none'
    })
  })
}

// Text splitting animation
export const splitTextAnimation = (element: HTMLElement, delay: number = 0) => {
  const text = element.textContent || ''
  element.innerHTML = ''
  
  text.split('').forEach((char, index) => {
    const span = document.createElement('span')
    span.textContent = char
    span.style.display = 'inline-block'
    span.style.opacity = '0'
    span.style.transform = 'translateY(20px)'
    element.appendChild(span)
    
    gsap.to(span, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      delay: delay + index * 0.03,
      ease: 'back.out(1.7)'
    })
  })
}