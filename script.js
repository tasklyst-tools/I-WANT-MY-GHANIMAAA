import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBfCHLXcfs8zLNCzrKHRmOyKOOyIMHNCLw",
    authDomain: "tasklyst-0.firebaseapp.com",
    projectId: "tasklyst-0",
    storageBucket: "tasklyst-0.firebasestorage.app",
    messagingSenderId: "835577405253",
    appId: "1:835577405253:web:b372aff7649b07d788682c",
    measurementId: "G-ESSNPPXQZW"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

isSupported().then((supported) => {
    if (supported) {
        getAnalytics(firebaseApp);
    }
}).catch((error) => {
    console.error("Analytics initialization failed", error);
});

// Navbar collapse animation
const navLogo = document.getElementById('navLogo');
const mainNav = document.getElementById('mainNav');

if (navLogo && mainNav) {
    navLogo.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Check if navbar is collapsed - expand and show content
        if (mainNav.classList.contains('collapsed') && 
            !mainNav.classList.contains('expanding')) {
            
            // Remove collapsed class
            mainNav.classList.remove('collapsed');
            mainNav.classList.add('expanding');
            
            // Show elements and restore grid layout
            const navLinks = document.getElementById('navLinks');
            const colorSlider = document.getElementById('colorSlider');
            const navCta = document.getElementById('navCta');
            
            if (navLinks) {
                navLinks.style.display = '';
                navLinks.style.opacity = '0';
            }
            if (colorSlider) {
                colorSlider.style.display = '';
                colorSlider.style.opacity = '0';
            }
            if (navCta) {
                navCta.style.display = '';
                navCta.style.opacity = '0';
            }
            
            // Restore grid layout
            mainNav.style.gridTemplateColumns = 'auto 1fr auto auto';
            
            // Clear inline styles to allow CSS transitions
            mainNav.style.left = '';
            mainNav.style.transform = '';
            mainNav.style.width = '';
            mainNav.style.transition = '';
            
            // Force reflow
            mainNav.offsetHeight;
            
            // Add fading-in class for smooth fade
            mainNav.classList.add('fading-in');
            
            // Fade in elements and expand
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (navLinks) navLinks.style.opacity = '1';
                    if (colorSlider) colorSlider.style.opacity = '1';
                    if (navCta) navCta.style.opacity = '1';
                });
            });
            
            // Clean up after animation completes
            setTimeout(() => {
                mainNav.classList.remove('expanding', 'fading-in');
                if (navLinks) navLinks.style.opacity = '';
                if (colorSlider) colorSlider.style.opacity = '';
                if (navCta) navCta.style.opacity = '';
            }, 800);
        }
        // Original collapse animation
        else if (!mainNav.classList.contains('fading') && 
                 !mainNav.classList.contains('collapsing') && 
                 !mainNav.classList.contains('collapsed') &&
                 !mainNav.classList.contains('expanding') &&
                 !mainNav.classList.contains('fading-in')) {
            
            // Phase 1: Fade out all navbar elements (except logo)
            mainNav.classList.add('fading');
            
            // Phase 2: After fade completes, collapse from right to left
            setTimeout(() => {
                // Get logo's current absolute position on screen (this will be locked)
                const logoRect = navLogo.getBoundingClientRect();
                const navPadding = parseFloat(getComputedStyle(mainNav).paddingLeft) || 28;
                
                // Calculate the navbar's left position to keep logo fixed at its current screen position
                // Logo's screen position = navbar left + navbar padding + logo offset in grid
                const logoScreenLeft = logoRect.left;
                const targetLeft = logoScreenLeft - navPadding;
                
                // Calculate collapsed width: logo width + padding on both sides
                const logoWidth = logoRect.width;
                const collapsedWidth = logoWidth + (navPadding * 2);
                
                // Hide elements completely
                const navLinks = document.getElementById('navLinks');
                const colorSlider = document.getElementById('colorSlider');
                const navCta = document.getElementById('navCta');
                
                if (navLinks) navLinks.style.display = 'none';
                if (colorSlider) colorSlider.style.display = 'none';
                if (navCta) navCta.style.display = 'none';
                
                // Change grid layout BEFORE calculating positions
                mainNav.style.gridTemplateColumns = 'auto';
                
                // Force layout recalculation
                mainNav.offsetHeight;
                
                // Remove fading class and add collapsing class
                mainNav.classList.remove('fading');
                mainNav.classList.add('collapsing');
                
                // STEP 1: Instantly lock navbar position to keep logo fixed (no transition)
                mainNav.style.transition = 'none';
                mainNav.style.left = `${targetLeft}px`;
                mainNav.style.transform = 'translateX(0)';
                
                // Force reflow to apply instant position change
                mainNav.offsetHeight;
                
                // STEP 2: Now enable transition only for width, then animate collapse
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        // Enable transition only for width (logo stays fixed)
                        mainNav.style.transition = 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
                        // Collapse width from right to left (logo stays fixed at its position)
                        mainNav.style.width = `${collapsedWidth}px`;
                    });
                });
                
                // Phase 3: After collapse completes, move logo to center
                setTimeout(() => {
                    // Remove collapsing class and add collapsed class
                    mainNav.classList.remove('collapsing');
                    mainNav.classList.add('collapsed');
                    
                    // Enable transitions for left and transform to move to center
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            // Enable smooth transition for moving to center
                            mainNav.style.transition = 'left 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
                            // NOW move the logo to center (only after collapse is done)
                            mainNav.style.left = '50%';
                            mainNav.style.transform = 'translateX(-50%)';
                        });
                    });
                }, 700); // Wait for collapse animation to complete
            }, 500); // Wait for fade animation to complete
        }
    });
}

// Hue slider
const hueSlider = document.getElementById('neonHue');

const setNeonColor = (hue) => {
    const color = `hsl(${hue}, 100%, 50%)`;
    document.documentElement.style.setProperty('--neon-color', color);
};

if (hueSlider) {
    const minHue = 90;
    const maxHue = 210;
    hueSlider.min = minHue;
    hueSlider.max = maxHue;
    if (!hueSlider.value) hueSlider.value = 120;
    setNeonColor(hueSlider.value);
    hueSlider.addEventListener('input', (event) => setNeonColor(event.target.value));
}

// Signup
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    const statusEl = signupForm.querySelector('.auth-status');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = emailInput?.value.trim();
        const password = passwordInput?.value || '';
        if (!email || !password) {
            if (statusEl) { statusEl.textContent = 'Please fill in all required fields.'; statusEl.classList.add('error'); }
            return;
        }
        if (statusEl) { statusEl.textContent = 'Creating your account...'; statusEl.classList.remove('error'); }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            if (statusEl) { statusEl.textContent = 'Account created! Redirecting to sign in...'; statusEl.classList.remove('error'); }
            setTimeout(() => { window.location.href = 'login.html'; }, 1200);
        } catch (error) {
            const message = error?.message || 'Something went wrong. Please try again.';
            if (statusEl) { statusEl.textContent = message; statusEl.classList.add('error'); }
        }
    });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    const statusEl = loginForm.querySelector('.auth-status');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = emailInput?.value.trim();
        const password = passwordInput?.value || '';
        if (!email || !password) {
            if (statusEl) { statusEl.textContent = 'Please fill in all required fields.'; statusEl.classList.add('error'); }
            return;
        }
        if (statusEl) { statusEl.textContent = 'Signing you in...'; statusEl.classList.remove('error'); }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (statusEl) { statusEl.textContent = 'Signed in! Redirecting...'; }
            setTimeout(() => { window.location.href = 'index.html'; }, 800);
        } catch (error) {
            const message = error?.message || 'Unable to sign in. Please try again.';
            if (statusEl) { statusEl.textContent = message; statusEl.classList.add('error'); }
        }
    });
}

// Social providers
const providerButtons = document.querySelectorAll('.provider-btn');
if (providerButtons.length) {
    const providerMap = {
        google: new GoogleAuthProvider(),
        facebook: new FacebookAuthProvider(),
        github: new GithubAuthProvider()
    };
    providerButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const providerKey = button.dataset.provider;
            const provider = providerMap[providerKey];
            if (!provider) return;
            try {
                await signInWithPopup(auth, provider);
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Provider sign-in failed', error);
                const form = document.getElementById('loginForm') || document.getElementById('signupForm');
                const statusEl = form?.querySelector('.auth-status');
                if (statusEl) {
                    statusEl.textContent = error?.message || 'Provider sign-in failed.';
                    statusEl.classList.add('error');
                }
            }
        });
    });
}

