/**
 * script.js
 * Responsible for: setting numbers, updating donut and linear progress,
 * animations and clickable CTA demo behaviour.
 */

(function () {
  // Data (from the image/prototype)
  const TARGET = 10000;
  const PURCHASED = 47;

  // Derived values
  const percent = +(PURCHASED / TARGET * 100).toFixed(2); // 0.47 (percent)
  const percentDisplay = percent.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '%';

  // DOM refs
  const purchasedEl = document.getElementById('purchasedValue');
  const targetEl = document.getElementById('targetValue');
  const percentTextEl = document.getElementById('percentText');
  const donutValueEl = document.getElementById('donutValue');
  const linearFill = document.getElementById('linearFill');
  const linearPeg = document.getElementById('linearPeg');
  const donutSegment = document.querySelector('.donut-segment');

  // Initialize text content
  targetEl.textContent = TARGET.toLocaleString() + ' laptops';
  purchasedEl.textContent = PURCHASED.toLocaleString() + ' laptops';
  percentTextEl.textContent = percentDisplay;
  donutValueEl.textContent = percentDisplay;

  // Donut circle: use stroke-dasharray trick. The SVG circle has circumference ~ 100 units
  // We adopt an approach where stroke-dasharray = `${progress} ${100 - progress}`
  // Make a small gradient stroke by setting stroke to a gradient using CSS variable fallback
  function setDonutProgress(p) {
    // p in [0..100]
    const clamped = Math.max(0, Math.min(100, p));
    const dash = `${clamped} ${100 - clamped}`;
    donutSegment.setAttribute('stroke-dasharray', dash);
    // set color (we create a gradient-ish look via stroke color)
    if (clamped < 20) {
      donutSegment.style.stroke = '#2b8cff'; // blue
    } else {
      donutSegment.style.stroke = '#2dd4bf'; // teal
    }
  }

  // Linear fill
  function setLinear(p) {
    const clamped = Math.max(0, Math.min(100, p));
    linearFill.style.width = clamped + '%';
    linearPeg.style.left = clamped + '%';
  }

  // Animate from 0 -> percent
  function animateProgress(finalPercent, duration = 1200) {
    const start = performance.now();
    const initial = 0;
    function step(now) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - t, 3);
      const current = initial + (finalPercent - initial) * ease;
      setDonutProgress(current);
      setLinear(current);
      donutValueEl.textContent = current.toFixed(2) + '%';
      percentTextEl.textContent = current.toFixed(2) + '%';
      if (t < 1) requestAnimationFrame(step);
      else {
        // finish with exact value
        setDonutProgress(finalPercent);
        setLinear(finalPercent);
        donutValueEl.textContent = finalPercent.toFixed(2) + '%';
        percentTextEl.textContent = finalPercent.toFixed(2) + '%';
      }
    }
    requestAnimationFrame(step);
  }

  // Set initial stroke-dasharray base for donutSegment so 100 -> full circle
  // Note: the SVG circle uses a radius that results in circumference ~ 100 in viewBox units; this is a trick
  donutSegment.style.transition = 'stroke-dasharray 900ms ease, stroke 900ms ease';

  // Kick off animation after a short time (so it looks dynamic)
  setTimeout(() => animateProgress(percent), 350);

  // Optional: CTA button demo behavior (no external links)
  document.getElementById('donateBtn').addEventListener('click', () => {
    alert('this is a demo website, anticipate the real project — coming soon!.');
  });
  document.getElementById('shareBtn').addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: '10K Laptops for 10K Nigerian Youths',
        text: 'Join the drive to get laptops to 10,000 Nigerian youths.',
        url: location.href
      }).catch(()=>{/* ignore */});
    } else {
      // fallback: copy link
      navigator.clipboard?.writeText(location.href).then(() => {
        alert('Link copied to clipboard!');
      }).catch(()=> alert('Share not supported on this device.'));
    }
  });
  document.getElementById('supportBtn').addEventListener('click', () => {
    alert('this is a demo website, anticipate the real project — coming soon!.');
  });

})();

window.addEventListener("scroll", () => {
    const hero = document.querySelector(".hero");
    const offset = window.scrollY * 0.3;
    hero.style.backgroundPositionY = `${offset}px`;
});
const cards = document.querySelectorAll(".team-card");

cards.forEach((card, i) => {
  card.style.animationDelay = `${i * 0.15}s`;
});

 // About us Toggle story expansion
  function toggleStory() {
    const storyFull = document.getElementById('storyFull');
    const btn = document.getElementById('readMoreBtn');
    
    if (storyFull.classList.contains('expanded')) {
      storyFull.classList.remove('expanded');
      btn.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
      btn.classList.remove('expanded');
      // Scroll back to story section
      document.querySelector('.story-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      storyFull.classList.add('expanded');
      btn.innerHTML = 'Read Less <i class="fas fa-chevron-up"></i>';
      btn.classList.add('expanded');
    }
  }

  // Intersection Observer for scroll animations
  document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe story section and about items
    const storySection = document.querySelector('.story-section');
    const aboutItems = document.querySelectorAll('.about-item');
    
    observer.observe(storySection);
    aboutItems.forEach(item => {
      observer.observe(item);
    });
  });
  
  // Testimonials
  
   const testimonials = document.querySelectorAll('.testimonial');
  let index = 0;

  function showTestimonial(i) {
    testimonials.forEach(t => t.classList.remove('active'));
    testimonials[i].classList.add('active');
  }

  function nextTestimonial() {
    index = (index + 1) % testimonials.length;
    showTestimonial(index);
  }

  function prevTestimonial() {
    index = (index - 1 + testimonials.length) % testimonials.length;
    showTestimonial(index);
  }

  setInterval(nextTestimonial, 7000);
  
  // Hero1 Hero section
  
  const revealSection = document.querySelector('.reveal');

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          revealSection.classList.add('active');
        }, 1000); // 1 second delay
        observer.unobserve(revealSection);
      }
    },
    { threshold: 0.4 }
  );

  observer.observe(revealSection);
  
    // footer slider
  const footerSlides = document.querySelectorAll('.footer-slide');
  const footerDotsContainer = document.querySelector('.footer-dots');
  const footerPrevBtn = document.querySelector('.footer-prev');
  const footerNextBtn = document.querySelector('.footer-next');

  let footerIndex = 0;
  let footerInterval;

  // Create dots
  footerSlides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.addEventListener('click', () => footerGoToSlide(i));
    footerDotsContainer.appendChild(dot);
  });

  const footerDots = footerDotsContainer.querySelectorAll('span');

  function footerShowSlide(i) {
    footerSlides.forEach(slide => slide.classList.remove('footer-active'));
    footerDots.forEach(dot => dot.classList.remove('footer-active'));

    footerSlides[i].classList.add('footer-active');
    footerDots[i].classList.add('footer-active');
  }

  function footerNextSlide() {
    footerIndex = (footerIndex + 1) % footerSlides.length;
    footerShowSlide(footerIndex);
  }

  function footerPrevSlide() {
    footerIndex = (footerIndex - 1 + footerSlides.length) % footerSlides.length;
    footerShowSlide(footerIndex);
  }

  function footerGoToSlide(i) {
    footerIndex = i;
    footerShowSlide(footerIndex);
    footerResetAutoSlide();
  }

  function footerStartAutoSlide() {
    footerInterval = setInterval(footerNextSlide, 5000);
  }

  function footerResetAutoSlide() {
    clearInterval(footerInterval);
    footerStartAutoSlide();
  }

  footerPrevBtn.addEventListener('click', () => {
    footerPrevSlide();
    footerResetAutoSlide();
  });

  footerNextBtn.addEventListener('click', () => {
    footerNextSlide();
    footerResetAutoSlide();
  });

  // Init
  footerShowSlide(footerIndex);
  footerStartAutoSlide();