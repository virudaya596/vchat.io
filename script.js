// ✅ Import Firebase Modules (At Top Level)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    signInAnonymously, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9QrjoLcRZjvm5XCbqa5RFwu957rGu_uI",
    authDomain: "vchat-da758.firebaseapp.com",
    projectId: "vchat-da758",
    storageBucket: "vchat-da758.appspot.com",
    messagingSenderId: "896770279833",
    appId: "1:896770279833:web:14b0667cc15e508814ab08",
    measurementId: "G-DB44ZWTX4P"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Function to Handle Google Login
// ✅ Google Login (Using Pop-up)
function googleLogin() {
    signInWithPopup(auth, provider) // 👈 Using Pop-up instead of Redirect
        .then((result) => {
            const user = result.user;
            localStorage.setItem("username", user.displayName.split(" ")[0]); // First Name as Username
            localStorage.setItem("avatar", user.photoURL);
            window.location.href = "main.html"; // ✅ Redirect to Chat Page manually
        })
        .catch((error) => {
            console.error("Login Error:", error);
            alert("Login Failed! Try Again.");
        });
}


// ✅ Anonymous Login (User Chooses Username & Avatar)
function anonymousLogin() {
    signInAnonymously(auth)
        .then(() => {
            let username = prompt("Enter a username:");
            let avatar = prompt("Enter an avatar URL (or leave blank for default):");

            if (!username) username = "Guest"; // Default name
            if (!avatar) avatar = "default-avatar.png"; // Set a default avatar

            localStorage.setItem("username", username);
            localStorage.setItem("avatar", avatar);
            
            window.location.href = "main.html"; // ✅ Redirect to Chat Page
        })
        .catch((error) => {
            console.error("Anonymous Login Error:", error);
            alert("Login Failed! Try Again.");
        });
}

// ✅ Function to Handle Logout
function googleLogout() {
    signOut(auth).then(() => {
        localStorage.removeItem("username");
        localStorage.removeItem("avatar");
        window.location.href = "index.html"; // Redirect to Login Page
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

// ✅ Wait for DOM to Load
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("google-login-btn");
    const logoutButton = document.getElementById("logout-btn");

    if (loginButton) {
        loginButton.addEventListener("click", googleLogin);
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", googleLogout);
    }

    // ✅ Auto-fill user details on Chat Page (main.html)
    if (window.location.pathname.includes("main.html")) {
        const username = localStorage.getItem("username");
        const avatar = localStorage.getItem("avatar");

        const userNameElement = document.getElementById("user-name");
        const userAvatarElement = document.getElementById("user-avatar");

        if (username && avatar && userNameElement && userAvatarElement) {
            userNameElement.textContent = username;
            userAvatarElement.src = avatar;
        }
    }
});

// ✅ Event Listeners
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("google-login-btn");
    const anonLoginButton = document.getElementById("anonymous-login-btn"); // New Button
    const logoutButton = document.getElementById("logout-btn");

    if (loginButton) loginButton.addEventListener("click", googleLogin);
    if (anonLoginButton) anonLoginButton.addEventListener("click", anonymousLogin); // New Button
    if (logoutButton) logoutButton.addEventListener("click", googleLogout);
});
