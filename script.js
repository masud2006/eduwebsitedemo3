// ========== script.js ==========
// Strictly vanilla, lightweight, smooth animations & interactions

document.addEventListener('DOMContentLoaded', function() {
    // ========== MOBILE HAMBURGER MENU ==========
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when a nav link is clicked (smooth scroll + hide)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1); // remove #
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // offset for sticky navbar
                    behavior: 'smooth'
                });
            }
            // Close mobile menu
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // ========== HERO SLIDER (4 slides, auto + manual) ==========
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active-slide', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Auto slide every 5 seconds
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    startAutoSlide();

    // Pause auto slide on hover (optional, but user-friendly)
    const sliderContainer = document.getElementById('slider-container');
    sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
    sliderContainer.addEventListener('mouseleave', startAutoSlide);

    // Manual navigation
    if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(slideInterval); nextSlide(); startAutoSlide(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(slideInterval); prevSlide(); startAutoSlide(); });

    // ========== COURSE FILTERING SYSTEM ==========
    const courseTypeFilter = document.getElementById('filter-course-type');
    const classFilter = document.getElementById('filter-class');
    const branchFilter = document.getElementById('filter-branch');
    const courseCards = document.querySelectorAll('.course-card');

    function filterCourses() {
        const selectedType = courseTypeFilter.value;
        const selectedClass = classFilter.value;
        const selectedBranch = branchFilter.value;

        courseCards.forEach(card => {
            const cardType = card.dataset.courseType;
            const cardClass = card.dataset.class;
            const cardBranch = card.dataset.branch;

            const typeMatch = selectedType === 'all' || cardType === selectedType;
            const classMatch = selectedClass === 'all' || cardClass === selectedClass;
            const branchMatch = selectedBranch === 'all' || cardBranch === selectedBranch;

            if (typeMatch && classMatch && branchMatch) {
                card.style.display = 'flex'; // or block depending on your card display
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (courseTypeFilter && classFilter && branchFilter) {
        courseTypeFilter.addEventListener('change', filterCourses);
        classFilter.addEventListener('change', filterCourses);
        branchFilter.addEventListener('change', filterCourses);
    }

    // ========== DEMO CLASS FORM VALIDATION ==========
    const demoForm = document.getElementById('demoForm');
    const formMessage = document.getElementById('form-message');

    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const course = document.getElementById('courseSelect').value;

            // Simple validation
            if (name === '' || phone === '' || course === '') {
                formMessage.textContent = 'সব ঘর পূরণ করুন।';
                formMessage.style.color = '#b22222';
                return;
            }

            // Bangladeshi phone regex (basic)
            const phoneRegex = /^01[3-9][0-9]{8}$/;
            if (!phoneRegex.test(phone)) {
                formMessage.textContent = 'সঠিক মোবাইল নম্বর দিন (যেমন: 01712345678)';
                formMessage.style.color = '#b22222';
                return;
            }

            // If valid
            formMessage.textContent = 'ধন্যবাদ! আমাদের প্রতিনিধি শীঘ্রই যোগাযোগ করবে।';
            formMessage.style.color = '#1e7e34';
            demoForm.reset(); // optional
        });
    }

    // ========== SMOOTH SCROLL FOR ALL ANCHOR LINKS (optional, already handled but fallback) ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Prevent default if it's not a nav link (already handled) but to avoid double behavior
            if (this.classList.contains('nav-link') || this.classList.contains('cta-btn') || this.classList.contains('enroll-btn')) {
                // Already handled; but we can let it be.
                // For enroll buttons, they point to #demo-booking
                const href = this.getAttribute('href');
                if (href === '#demo-booking') {
                    e.preventDefault();
                    const target = document.getElementById('demo-booking');
                    if (target) {
                        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                    }
                }
                // For nav links, we already did above; but to avoid conflict:
                if (this.classList.contains('nav-link')) {
                    e.preventDefault(); // handled already but we have custom handler, so prevent double
                }
            } else {
                // For any other anchor with hash
                const href = this.getAttribute('href');
                if (href && href.startsWith('#') && href.length > 1) {
                    e.preventDefault();
                    const target = document.getElementById(href.substring(1));
                    if (target) {
                        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                    }
                }
            }
        });
    });

    // ========== BASIC ANIMATION TRIGGERS (simple fade on scroll) ==========
    // Use Intersection Observer to add a class when elements come into view
    const animatedElements = document.querySelectorAll('.founder-card, .course-card, .feature-card, .story-card, .branch-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // we could add a class, but they already have base style; we set initial to 0.9? simpler: just ensure
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0.9';
        el.style.transform = 'translateY(15px)';
        el.style.transition = 'opacity 0.6s, transform 0.6s';
        observer.observe(el);
    });

    // Fix for cards that may be hidden by filter then shown: they need to re-appear. Observer re-triggers? Fine.
    // Also for the slider active content, we already animate with CSS.
});