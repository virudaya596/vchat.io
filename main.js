// ✅ Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { 
    getDatabase, 
    ref, 
    push, 
    onChildAdded 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9QrjoLcRZjvm5XCbqa5RFwu957rGu_uI",
    authDomain: "vchat-da758.firebaseapp.com",
    projectId: "vchat-da758",
    storageBucket: "vchat-da758.appspot.com",
    messagingSenderId: "896770279833",
    appId: "1:896770279833:web:14b0667cc15e508814ab08",
    measurementId: "G-DB44ZWTX4P",
    databaseURL: "https://vchat-da758-default-rtdb.firebaseio.com/" // ✅ Make Sure Realtime DB is Enabled
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();
const messagesRef = ref(db, "messages"); // ✅ Database Reference

// ✅ Function to Send a Message
function sendMessage() {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();

    if (message !== "") {
        push(messagesRef, {
            username: localStorage.getItem("username"),
            avatar: localStorage.getItem("avatar"),
            text: message,
            timestamp: Date.now(),
            uid: auth.currentUser.uid
        });

        messageInput.value = ""; // ✅ Clear input after sending
    }
}

// ✅ Function to Display Messages (WhatsApp Style)
function displayMessage(data) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");

    // ✅ Create avatar image
    const userAvatar = document.createElement("img");
    userAvatar.src = data.avatar;
    userAvatar.classList.add("avatar");

    // ✅ Create username span
    const usernameSpan = document.createElement("span");
    usernameSpan.textContent = ` ${data.username}: `;
    usernameSpan.classList.add("username");

    // ✅ Create message text
    const messageText = document.createElement("span");
    messageText.textContent = data.text;
    messageText.classList.add("message-text");

    // ✅ Apply proper message alignment
    messageDiv.classList.add("message");

    // ✅ Check if it's the current user's message
    if (data.uid === auth.currentUser.uid) {
        messageDiv.classList.add("sent-message");
    } else {
        messageDiv.classList.add("received-message");
    }

    messageDiv.appendChild(userAvatar);
    messageDiv.appendChild(usernameSpan);
    messageDiv.appendChild(messageText);
    chatBox.appendChild(messageDiv);

    // ✅ Auto-scroll to latest message
    chatBox.scrollTop = chatBox.scrollHeight;
}


// ✅ Listen for New Messages
onChildAdded(messagesRef, (snapshot) => {
    displayMessage(snapshot.val());
});

// ✅ Google Login
function googleLogin() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            localStorage.setItem("username", user.displayName.split(" ")[0]); // First Name as Username
            localStorage.setItem("avatar", user.photoURL);
            window.location.href = "main.html"; // ✅ Redirect to Chat Page
        })
        .catch((error) => {
            console.error("Login Error:", error);
            alert("Login Failed! Try Again.");
        });
}

// ✅ Google Logout
function googleLogout() {
    signOut(auth).then(() => {
        localStorage.removeItem("username");
        localStorage.removeItem("avatar");
        window.location.href = "index.html"; // ✅ Redirect to Login Page
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

// ✅ Auto-fill user details in Chat Page (main.html)
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("user-name").textContent = localStorage.getItem("username");
        document.getElementById("user-avatar").src = localStorage.getItem("avatar");
    } else {
        window.location.href = "index.html"; // ✅ Redirect if not logged in
    }
});

// ✅ Event Listeners
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("google-login-btn");
    const logoutButton = document.getElementById("logout-btn");
    const sendButton = document.getElementById("send-btn");
    const messageInput = document.getElementById("message-input");

    if (loginButton) loginButton.addEventListener("click", googleLogin);
    if (logoutButton) logoutButton.addEventListener("click", googleLogout);
    if (sendButton) sendButton.addEventListener("click", sendMessage);

    // ✅ Send message on Enter key press
    messageInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});
