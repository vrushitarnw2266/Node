document.addEventListener('DOMContentLoaded', () => {
    // Preloader Logic
    const preloader = document.getElementById('preloader');
    
    // Simulate loading time (you can adjust this)
    // Normally we'd just use window.onload, but to show off the swimming animation,
    // we give it a minimum time of 2.5 seconds.
    setTimeout(() => {
        window.addEventListener('load', () => {
            hidePreloader();
        });
        
        // Failsafe in case load event already fired
        if (document.readyState === 'complete') {
            hidePreloader();
        }
    }, 2500);

    function hidePreloader() {
        if(preloader) {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        }
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    if (alerts.length > 0) {
        setTimeout(() => {
            alerts.forEach(alert => {
                alert.style.transition = 'opacity 0.5s ease';
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 500);
            });
        }, 5000);
    }
});
