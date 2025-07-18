document.addEventListener('DOMContentLoaded', function() {

    // --- Theme Switcher ---
    const themeToggle = document.getElementById('theme-toggle');
    
    // ========== UPDATED LINE ==========
    // Set initial theme based on local storage, defaulting to 'dark'
    let currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Update icon based on the current theme
    if (currentTheme === 'dark') {
        themeToggle.classList.replace('ti-light-bulb', 'ti-shine');
    }

    // Handle theme toggle click
    themeToggle.addEventListener('click', () => {
        let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update icon
        if (newTheme === 'dark') {
            themeToggle.classList.replace('ti-light-bulb', 'ti-shine');
        } else {
            themeToggle.classList.replace('ti-shine', 'ti-light-bulb');
        }
    });

    // --- Animate Sections on Scroll ---
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Active Nav Link on Scroll ---
    const navLinks = document.querySelectorAll('.nav-link');
    const allSections = document.querySelectorAll('section, header');

    window.addEventListener('scroll', () => {
        let current = 'home';
        allSections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- Contact Form Handling ---
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.textContent = "Thank you for your message! I will get back to you soon.";
                formStatus.style.color = 'var(--primary-color)';
                form.reset();
            } else {
                const responseData = await response.json();
                if (Object.hasOwn(responseData, 'errors')) {
                    formStatus.textContent = responseData["errors"].map(error => error["message"]).join(", ");
                } else {
                    formStatus.textContent = "Oops! There was a problem submitting your form.";
                }
                formStatus.style.color = 'var(--secondary-color)';
            }
        } catch (error) {
            formStatus.textContent = "Oops! There was a problem submitting your form.";
            formStatus.style.color = 'var(--secondary-color)';
        }
    }
    
    if(form) {
      form.addEventListener("submit", handleSubmit);
    }
});