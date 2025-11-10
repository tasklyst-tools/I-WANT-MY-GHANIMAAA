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

