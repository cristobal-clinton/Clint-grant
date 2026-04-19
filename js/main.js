/* ===== CLINT GRANT | FUNDING ARCHITECT ===== */
/* ===== MAIN JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', function() {

  // ===== MOBILE NAVIGATION TOGGLE =====
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      this.classList.toggle('open');
      
      // Prevent body scroll when menu is open
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          hamburger.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // ===== CLOSE MOBILE MENU ON WINDOW RESIZE =====
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) {
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.counter');
  
  const animateCounter = (counter) => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const isFloat = target % 1 !== 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentValue = startValue + (target - startValue) * easeProgress;
      
      if (isFloat) {
        counter.textContent = currentValue.toFixed(1);
      } else {
        counter.textContent = Math.floor(currentValue);
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        if (isFloat) {
          counter.textContent = target.toFixed(1);
        } else {
          counter.textContent = target;
        }
      }
    };
    
    requestAnimationFrame(updateCounter);
  };

  // Intersection Observer for counters
  if (counters.length > 0) {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          animateCounter(counter);
          counterObserver.unobserve(counter);
        }
      });
    }, observerOptions);
    
    counters.forEach(counter => counterObserver.observe(counter));
  }

  // ===== FAQ ACCORDION =====
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  if (faqQuestions.length > 0) {
    faqQuestions.forEach(question => {
      question.addEventListener('click', function() {
        const answer = this.nextElementSibling;
        const isOpen = answer.style.maxHeight;
        
        // Close all other answers
        faqQuestions.forEach(q => {
          if (q !== this) {
            q.classList.remove('active');
            const otherAnswer = q.nextElementSibling;
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });
        
        // Toggle current answer
        if (!isOpen) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          this.classList.add('active');
        } else {
          answer.style.maxHeight = null;
          this.classList.remove('active');
        }
      });
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        
        // Account for fixed header
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== HEADER SCROLL EFFECT =====
  const header = document.querySelector('header');
  
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ===== LEAD MAGNET FORM HANDLING =====
  const leadForm = document.getElementById('home-lead-form');
  
  if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      
      if (emailInput && emailInput.value) {
        // You can add actual form submission logic here
        // For now, show a success message
        alert('✅ Thank you! Your Grant Readiness Checklist is on its way to ' + emailInput.value);
        this.reset();
      }
    });
  }

  // ===== CONTACT FORM AJAX HANDLING (FormSubmit) =====
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const submitBtn = this.querySelector('button[type="submit"]');
      const successDiv = document.getElementById('form-success');
      const errorDiv = document.getElementById('form-error');
      
      // Hide previous messages
      if (successDiv) successDiv.style.display = 'none';
      if (errorDiv) errorDiv.style.display = 'none';
      
      // Show loading state
      if (submitBtn) {
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;
      }
      
      try {
        const response = await fetch(this.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          if (successDiv) successDiv.style.display = 'block';
          this.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        if (errorDiv) errorDiv.style.display = 'block';
        console.error('Form error:', error);
      } finally {
        if (submitBtn) {
          submitBtn.innerHTML = 'Send Message →';
          submitBtn.disabled = false;
        }
      }
    });
  }

  // ===== BLOG ARTICLE EXPAND/COLLAPSE =====
  const readMoreBtns = document.querySelectorAll('.read-more-btn');
  
  if (readMoreBtns.length > 0) {
    readMoreBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const articleDiv = document.getElementById(targetId);
        const arrow = this.querySelector('.arrow');
        
        if (articleDiv) {
          articleDiv.classList.toggle('show');
          
          if (articleDiv.classList.contains('show')) {
            this.innerHTML = 'Read Less <span class="arrow">↑</span>';
          } else {
            this.innerHTML = 'Read Full Article <span class="arrow">↓</span>';
          }
        }
      });
    });
  }

  // ===== TESTIMONIAL SLIDER (if present) =====
  const slides = document.querySelectorAll('.testimonial-slide');
  
  if (slides.length > 1) {
    let currentSlide = 0;
    
    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    };
    
    // Auto-rotate every 8 seconds
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 8000);
    
    // Show first slide initially
    showSlide(0);
  }

  // ===== CALENDAR BOOKING LINK =====
  const calendarLink = document.getElementById('calendar-link');
  
  if (calendarLink) {
    calendarLink.addEventListener('click', function(e) {
      e.preventDefault();
      // Replace with actual Calendly link when ready
      // window.open('https://calendly.com/your-link', '_blank');
      alert('📅 Calendar booking integration ready. Add your Calendly link in the code.');
    });
  }

  // ===== ADD ACTIVE CLASS TO CURRENT PAGE IN NAVIGATION =====
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href) && href !== 'index.html') {
      link.classList.add('active');
    } else if (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('index.html'))) {
      link.classList.add('active');
    }
  });

  // ===== LAZY LOAD IMAGES (basic) =====
  const images = document.querySelectorAll('img[data-src]');
  
  if (images.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }

  // ===== BACK TO TOP BUTTON (if exists) =====
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== PARALLAX EFFECT FOR BACKGROUND SECTIONS =====
  const parallaxSections = document.querySelectorAll('.parallax-bg');
  
  if (parallaxSections.length > 0) {
    window.addEventListener('scroll', function() {
      parallaxSections.forEach(section => {
        const scrollPosition = window.pageYOffset;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop - window.innerHeight && 
            scrollPosition <= sectionTop + sectionHeight) {
          const speed = 0.5;
          const yPos = (scrollPosition - sectionTop) * speed;
          section.style.backgroundPosition = `center ${yPos}px`;
        }
      });
    });
  }

  // ===== STATS COUNTER INITIALIZATION (if not already running) =====
  // This ensures counters work even if IntersectionObserver fails
  
  // ===== CONSOLE WELCOME (optional) =====
  console.log('%c🚀 Clint Grant | Funding Architect', 'font-size: 16px; font-weight: bold; color: #d4af37;');
  console.log('%c$31M+ Secured | 127 Organizations Funded', 'font-size: 12px; color: #a1a1aa;');

}); // End DOMContentLoaded

// ===== WINDOW LOAD EVENTS =====
window.addEventListener('load', function() {
  // Remove loading animation if any
  document.body.classList.add('loaded');
  
  // Fix for FAQ accordion initial state
  document.querySelectorAll('.faq-answer').forEach(answer => {
    if (!answer.style.maxHeight) {
      answer.style.maxHeight = null;
    }
  });
});

// ===== PREVENT DEFAULT ON HONEYPOT FIELDS =====
document.addEventListener('submit', function(e) {
  const honeypot = e.target.querySelector('input[name="_honey"]');
  if (honeypot && honeypot.value) {
    e.preventDefault();
    console.warn('Honeypot triggered - possible bot submission');
  }
});
