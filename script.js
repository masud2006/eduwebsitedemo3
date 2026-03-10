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

    // ========== ENROLL MODAL (Payment Demo) ==========
    const modal = document.getElementById('enrollModal');
    const closeModal = document.querySelector('.close-modal');
    const enrollBtns = document.querySelectorAll('.enroll-btn');
    const enrollCourseSelect = document.getElementById('enrollCourse');
    const enrollForm = document.getElementById('enrollForm');
    const enrollMessage = document.getElementById('enrollFormMessage');

    // Open modal and set course title if available
    enrollBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const courseTitle = this.getAttribute('data-course-title');
            if (courseTitle && enrollCourseSelect) {
                // Try to select matching option (simple contains)
                const options = enrollCourseSelect.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].text.includes(courseTitle) || courseTitle.includes(options[i].text)) {
                        enrollCourseSelect.selectedIndex = i;
                        break;
                    }
                }
            }
            modal.style.display = 'flex';
        });
    });

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            if (enrollForm) enrollForm.reset();
            if (enrollMessage) enrollMessage.textContent = '';
        });
    }

    // Click outside to close
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            if (enrollForm) enrollForm.reset();
            if (enrollMessage) enrollMessage.textContent = '';
        }
    });

    // Handle enroll form submission (demo)
    if (enrollForm) {
        enrollForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simple validation: check required fields (HTML5 handles but we add custom)
            const name = document.getElementById('enrollName').value.trim();
            const phone = document.getElementById('enrollPhone').value.trim();
            const email = document.getElementById('enrollEmail').value.trim();
            const gender = document.querySelector('input[name="gender"]:checked');
            const course = enrollCourseSelect.value;
            const address = document.getElementById('enrollAddress').value.trim();
            const batch = document.getElementById('enrollBatch').value;
            const payment = document.querySelector('input[name="payment"]:checked');

            if (!name || !phone || !email || !gender || !course || !address || !batch || !payment) {
                enrollMessage.textContent = 'দয়া করে সকল তথ্য পূরণ করুন।';
                enrollMessage.style.color = '#b22222';
                return;
            }

            // Basic phone validation (optional)
            const phoneRegex = /^01[3-9][0-9]{8}$/;
            if (!phoneRegex.test(phone)) {
                enrollMessage.textContent = 'সঠিক মোবাইল নম্বর দিন (যেমন: 01712345678)';
                enrollMessage.style.color = '#b22222';
                return;
            }

            // Demo success message
            enrollMessage.textContent = 'এটি একটি ডেমো পেমেন্ট গেটওয়ে দেখানো হচ্ছে। কোনো টাকা কাটা হয়নি। ধন্যবাদ!';
            enrollMessage.style.color = '#1e7e34';

            // Optionally reset form after a delay
            setTimeout(() => {
                enrollForm.reset();
                enrollMessage.textContent = '';
                modal.style.display = 'none';
            }, 3000);
        });
    }

    // ========== SMOOTH SCROLL FOR ALL ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]:not(.enroll-btn):not(.float-wa):not(.float-call)').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.getElementById(href.substring(1));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // ========== BASIC ANIMATION TRIGGERS (simple fade on scroll) ==========
    const animatedElements = document.querySelectorAll('.founder-card, .course-card, .feature-card, .story-card, .branch-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0.9';
        el.style.transform = 'translateY(15px)';
        el.style.transition = 'opacity 0.6s, transform 0.6s';
        observer.observe(el);
    });
});
