/* ===== CLINT GRANT | FUNDING ARCHITECT ===== */
/* ===== SIMPLIFIED & FULLY FUNCTIONAL JAVASCRIPT ===== */

(function() {
  'use strict';
  
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // MOBILE MENU TOGGLE (SIMPLE & RELIABLE)
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    console.log('Hamburger found:', !!hamburger);
    console.log('Nav menu found:', !!navMenu);
    
    if (hamburger && navMenu) {
      // Remove any existing click listeners (safety)
      const newHamburger = hamburger.cloneNode(true);
      hamburger.parentNode.replaceChild(newHamburger, hamburger);
      
      const freshHamburger = document.getElementById('hamburger');
      
      freshHamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Hamburger clicked');
        
        // Toggle active class
        navMenu.classList.toggle('active');
        this.classList.toggle('open');
        
        console.log('Nav active:', navMenu.classList.contains('active'));
      });
      
      // Close menu when clicking a nav link
      const navLinks = navMenu.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', function() {
          navMenu.classList.remove('active');
          freshHamburger.classList.remove('open');
        });
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !freshHamburger.contains(e.target)) {
          if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            freshHamburger.classList.remove('open');
          }
        }
      });
    }
    
    // ==========================================
    // BLOG ARTICLE EXPAND/COLLAPSE
    // ==========================================
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    
    console.log('Read more buttons found:', readMoreBtns.length);
    
    readMoreBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('data-target');
        console.log('Button clicked, target:', targetId);
        
        const articleDiv = document.getElementById(targetId);
        console.log('Article div found:', !!articleDiv);
        
        if (articleDiv) {
          if (articleDiv.classList.contains('show')) {
            articleDiv.classList.remove('show');
            this.innerHTML = 'Read Full Article <span class="arrow">↓</span>';
          } else {
            articleDiv.classList.add('show');
            this.innerHTML = 'Read Less <span class="arrow">↑</span>';
          }
        }
      });
    });
    
    // ==========================================
    // COUNTER ANIMATION
    // ==========================================
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
      const animateCounter = function(counter) {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isFloat = target % 1 !== 0;
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(function() {
          current += increment;
          
          if (current >= target) {
            if (isFloat) {
              counter.textContent = target.toFixed(1);
            } else {
              counter.textContent = target;
            }
            clearInterval(timer);
          } else {
            if (isFloat) {
              counter.textContent = current.toFixed(1);
            } else {
              counter.textContent = Math.floor(current);
            }
          }
        }, 20);
      };
      
      // Simple scroll check
      const checkCounters = function() {
        counters.forEach(function(counter) {
          const rect = counter.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          
          if (isVisible && !counter.classList.contains('counted')) {
            counter.classList.add('counted');
            animateCounter(counter);
          }
        });
      };
      
      window.addEventListener('scroll', checkCounters);
      checkCounters(); // Run once on load
    }
    
    // ==========================================
    // FAQ ACCORDION
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(function(question) {
      question.addEventListener('click', function() {
        const answer = this.nextElementSibling;
        const isOpen = answer.style.maxHeight;
        
        // Close others
        faqQuestions.forEach(function(q) {
          if (q !== question) {
            q.classList.remove('active');
            const otherAnswer = q.nextElementSibling;
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });
        
        // Toggle current
        if (!isOpen) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          this.classList.add('active');
        } else {
          answer.style.maxHeight = null;
          this.classList.remove('active');
        }
      });
    });
    
    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
    
    // ==========================================
    // LEAD MAGNET FORM
    // ==========================================
    const leadForm = document.getElementById('home-lead-form');
    if (leadForm) {
      leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]');
        if (email && email.value) {
          alert('✅ Thank you! Your Grant Readiness Checklist is on its way.');
          this.reset();
        }
      });
    }
    
    // ==========================================
    // CONTACT FORM (FORMSPREE)
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        const successDiv = document.getElementById('form-success');
        const errorDiv = document.getElementById('form-error');
        
        if (successDiv) successDiv.style.display = 'none';
        if (errorDiv) errorDiv.style.display = 'none';
        
        if (submitBtn) {
          submitBtn.innerHTML = 'Sending...';
          submitBtn.disabled = true;
        }
        
        try {
          const response = await fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });
          
          if (response.ok) {
            if (successDiv) successDiv.style.display = 'block';
            this.reset();
          } else {
            throw new Error('Failed');
          }
        } catch (error) {
          if (errorDiv) errorDiv.style.display = 'block';
        } finally {
          if (submitBtn) {
            submitBtn.innerHTML = 'Send Message →';
            submitBtn.disabled = false;
          }
        }
      });
    }
    
  }); // End DOMContentLoaded
  
})();
