// AGOM Web Redesign Custom Scripting

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Load header and footer dynamically
  await loadHeaderAndFooter();

  // 2. Scroll Reveal Animations with Intersection Observer
  setupScrollReveal();

  // 5. Setup Animated Statistics Counter if element exists
  setupStatsCounters();

  // 6. Google Sheets form submissions
  setupFormSubmissions();
});

// Load header and footer dynamically from header.html and footer.html
async function loadHeaderAndFooter() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  // Load Header
  if (headerPlaceholder) {
    try {
      const response = await fetch('header.html');
      if (response.ok) {
        const html = await response.text();
        headerPlaceholder.outerHTML = html;
        
        // Setup header dependent modules
        setupMobileNavigation();
        setupStickyHeader();
        highlightActiveLinks();
      } else {
        console.error('Failed to load header:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Error fetching header:', err);
    }
  }

  // Load Footer
  if (footerPlaceholder) {
    try {
      const response = await fetch('footer.html');
      if (response.ok) {
        const html = await response.text();
        footerPlaceholder.outerHTML = html;
      } else {
        console.error('Failed to load footer:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Error fetching footer:', err);
    }
  }
}


// Setup Mobile Navigation Drawer
function setupMobileNavigation() {
  // Look for mobile toggle button (we will add it to the headers)
  const menuBtn = document.getElementById('mobile-menu-btn');
  if (!menuBtn) return;

  // Let's create the drawer overlay and container if they don't exist
  let overlay = document.querySelector('.mobile-menu-overlay');
  let drawer = document.querySelector('.mobile-menu-drawer');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
  }

  if (!drawer) {
    drawer = document.createElement('div');
    drawer.className = 'mobile-menu-drawer';
    drawer.innerHTML = `
      <button id="mobile-menu-close" class="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors focus:outline-none z-10">
        <span class="material-symbols-outlined text-[28px]">close</span>
      </button>
      <div class="flex flex-col items-center gap-3 mb-8 pt-4">
        <a href="index.html" class="flex flex-col items-center gap-2">
          <img alt="AGOM Logo" class="h-16 w-auto" src="image/logo.png">
          <img alt="An-Noor Global Online Madrasah" class="h-10 w-auto" src="image/full_name.png">
        </a>
      </div>
      <nav class="flex flex-col gap-6 text-lg font-semibold mb-8">
        <a class="nav-mobile-link text-on-surface-variant hover:text-primary transition-colors py-2 border-b border-outline-variant/30" href="index.html">হোম</a>
        <a class="nav-mobile-link text-on-surface-variant hover:text-primary transition-colors py-2 border-b border-outline-variant/30" href="courses.html">কোর্স সমূহ</a>
        <a class="nav-mobile-link text-on-surface-variant hover:text-primary transition-colors py-2 border-b border-outline-variant/30" href="admission.html">ভর্তি আবেদন</a>
        <a class="nav-mobile-link text-on-surface-variant hover:text-primary transition-colors py-2 border-b border-outline-variant/30" href="about.html">আমাদের সম্পর্কে</a>
        <a class="nav-mobile-link text-on-surface-variant hover:text-primary transition-colors py-2 border-b border-outline-variant/30" href="contact.html">যোগাযোগ</a>
        <a class="nav-mobile-link text-on-surface-variant hover:text-primary transition-colors py-2 border-b border-outline-variant/30" href="faq.html">প্রশ্নোত্তর</a>
      </nav>
      <div class="mt-auto flex flex-col gap-4">
        <a href="admission.html" class="bg-[#062A24] hover:bg-[#0D9488] text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md active:scale-95 text-center block">ভর্তি হোন</a>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  const closeBtn = document.getElementById('mobile-menu-close');

  const openMenu = () => {
    overlay.classList.add('active');
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    overlay.classList.remove('active');
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  };

  menuBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
}

// Scroll Reveal Observer
function setupScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed to keep layout performant
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

// Sticky header setup
function setupStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once on load
}


// Highlight the navigation links pointing to current page
function highlightActiveLinks() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Desktop links
  const links = document.querySelectorAll('header nav a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active-link', 'text-[#062A24]');
      link.classList.remove('text-stone-600');
    } else {
      link.classList.remove('active-link', 'text-[#062A24]');
      link.classList.add('text-stone-600');
    }
  });

  // Mobile links
  const mobileLinks = document.querySelectorAll('.nav-mobile-link');
  mobileLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('text-[#062A24]', 'font-bold');
      link.classList.remove('text-stone-600');
    } else {
      link.classList.remove('text-[#062A24]', 'font-bold');
      link.classList.add('text-stone-600');
    }
  });
}

// Animated stats count up
function setupStatsCounters() {
  const statsElements = document.querySelectorAll('.stat-counter');
  if (statsElements.length === 0) return;

  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 2000; // ms
    const stepTime = 30;
    const steps = duration / stepTime;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.innerText = target.toLocaleString('bn-BD'); // Format in Bengali numbers
        clearInterval(timer);
      } else {
        el.innerText = Math.floor(current).toLocaleString('bn-BD');
      }
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statsElements.forEach(el => observer.observe(el));
}

// Helper to get active script URLs (supports both old single url and new array formats)
function getActiveScriptUrls() {
  const urls = [];
  if (typeof FORM_CONFIG !== 'undefined') {
    if (FORM_CONFIG.scriptUrls && Array.isArray(FORM_CONFIG.scriptUrls)) {
      urls.push(...FORM_CONFIG.scriptUrls);
    }
    if (FORM_CONFIG.scriptUrl) {
      urls.push(FORM_CONFIG.scriptUrl);
    }
  }
  return urls.filter(url => url && !url.includes('YOUR_GOOGLE_APPS_SCRIPT'));
}

// Submit forms to Google Sheets via Apps Script
function setupFormSubmissions() {
  const admissionForm = document.getElementById('admissionForm');
  const contactForm = document.getElementById('contactForm');

  if (getActiveScriptUrls().length > 0) {
    checkFormHandlerReady();
  }

  if (admissionForm) {
    bindFormSubmit(admissionForm, collectAdmissionData, 'admissionStatus');
  }

  if (contactForm) {
    bindFormSubmit(contactForm, collectContactData, 'contactStatus');
  }
}

function checkFormHandlerReady() {
  const activeUrls = getActiveScriptUrls();
  activeUrls.forEach(url => {
    jsonpRequest(url, { ping: '1' })
      .then((result) => {
        if (result.status !== 'ready') {
          console.warn('Unexpected handler response from ' + url + ':', result);
        }
      })
      .catch(() => {
        const msg = 'Google Script setup incomplete. Open your script URL in incognito — it must show "AGOM form handler is ready." See form-config.js for steps.';
        const admissionStatus = document.getElementById('admissionStatus');
        const contactStatus = document.getElementById('contactStatus');
        if (admissionStatus && !admissionStatus.textContent) showFormStatus('admissionStatus', msg, 'error');
        if (contactStatus && !contactStatus.textContent) showFormStatus('contactStatus', msg, 'error');
      });
  });
}

function bindFormSubmit(form, collectData, statusId) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const activeUrls = getActiveScriptUrls();
    if (activeUrls.length === 0) {
      showFormStatus(statusId, 'Form is not configured yet. Add your Google Apps Script URL in form-config.js.', 'error');
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'পাঠানো হচ্ছে...';
    }

    showFormStatus(statusId, '', '');

    try {
      const payload = collectData(form);
      
      // Submit to all configured URLs in parallel
      const requests = activeUrls.map(url => 
        jsonpRequest(url, payload)
          .then(result => {
            if (!result.success) {
              throw new Error(result.error || 'Submission failed');
            }
            return result;
          })
      );
      
      await Promise.all(requests);

      form.reset();
      showFormStatus(statusId, 'আপনার তথ্য সফলভাবে জমা হয়েছে। শীঘ্রই আমরা যোগাযোগ করব, ইনশাআল্লাহ।', 'success');
    } catch (err) {
      const detail = err.message ? ` (${err.message})` : '';
      showFormStatus(statusId, 'জমা দিতে সমস্যা হয়েছে। Google Script "Anyone" access সেট করুন।' + detail, 'error');
      console.error('Form submission failed:', err);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });
}

function collectAdmissionData(form) {
  const courseInput = form.querySelector('input[name="course"]:checked');
  return {
    formType: 'admission',
    studentName: form.querySelector('[name="studentName"]')?.value.trim(),
    fatherName: form.querySelector('[name="fatherName"]')?.value.trim(),
    age: form.querySelector('[name="age"]')?.value.trim(),
    phone: form.querySelector('[name="phone"]')?.value.trim(),
    email: form.querySelector('[name="email"]')?.value.trim(),
    course: courseInput ? courseInput.value : '',
  };
}

function collectContactData(form) {
  return {
    formType: 'contact',
    name: form.querySelector('[name="name"]')?.value.trim(),
    email: form.querySelector('[name="email"]')?.value.trim(),
    subject: form.querySelector('[name="subject"]')?.value.trim(),
    message: form.querySelector('[name="message"]')?.value.trim(),
  };
}

/** JSONP request — works from localhost without CORS issues */
function jsonpRequest(baseUrl, data) {
  return new Promise((resolve, reject) => {
    const callbackName = 'agomJsonp_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const params = new URLSearchParams();
    params.append('callback', callbackName);

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const script = document.createElement('script');
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Request timed out — check Apps Script deployment'));
    }, 120000);

    function cleanup() {
      clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
    }

    window[callbackName] = (result) => {
      cleanup();
      resolve(result);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('Google Script error: doGet not found. Paste google-apps-script.gs, Save, then Deploy > New version.'));
    };

    script.src = `${baseUrl}?${params.toString()}`;
    document.body.appendChild(script);
  });
}

function showFormStatus(statusId, message, type) {
  const statusEl = document.getElementById(statusId);
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = 'form-status';

  if (type === 'success') {
    statusEl.classList.add('form-status-success');
  } else if (type === 'error') {
    statusEl.classList.add('form-status-error');
  }
}
