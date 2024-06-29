// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyACqlEjI7ic__bJMOgBc6HmCMMlXi-H5qU",
    authDomain: "login-form-6d340.firebaseapp.com",
    projectId: "login-form-6d340",
    storageBucket: "login-form-6d340.appspot.com",
    messagingSenderId: "895720597772",
    appId: "1:895720597772:web:d68605ec05088363250129"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;  // Set opacity to 1 initially
    setTimeout(function () {
      messageDiv.style.opacity = 0;
    }, 5000);
  }

// Function to check for and display messages stored in localStorage
function checkForStoredMessages() {
    const signUpMessage = localStorage.getItem('signUpMessage');
    if (signUpMessage) {
        showMessage(signUpMessage, 'signInMessage');
        localStorage.removeItem('signUpMessage');
    }
}

// Call the function to check for stored messages on page load
document.addEventListener('DOMContentLoaded', checkForStoredMessages);

// Sign Up Event Listener
const signUp = document.getElementById('submitSignup');
if (signUp) {
    signUp.addEventListener('click', (event) => {
        event.preventDefault();
        console.log("Sign up button clicked");

        const email = document.getElementById('rEmailSignup').value;
        const password = document.getElementById('rPasswordSignup').value;
        const name = document.getElementById('rNameSignup').value;

        console.log("Email:", email, "Password:", password, "Name:", name);

        const auth = getAuth();
        const db = getFirestore();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userData = {
                    email: email,
                    Name: name,
                };
                showMessage('Account created successfully', 'signUpMessage');
                const docRef = doc(db, "users", user.uid);
                setDoc(docRef, userData)
                    .then(() => {
                        localStorage.setItem('signUpMessage', 'Account created successfully! Please log in.');
                        window.location.href = "signup.html"; // Redirect to login page
                    })
                    .catch((error) => {
                        console.error("Error writing document", error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                console.error("Error code:", errorCode);
                if (errorCode === 'auth/email-already-in-use') {
                    showMessage('Email address already exists!', 'signUpMessage');
                } else {
                    showMessage('Unable to create user', 'signUpMessage');
                }
            });
    });
} else {
    console.error("Sign up button element not found");
}

// Sign In Event Listener
const signIn = document.getElementById('submitLogin');
if (signIn) {
    signIn.addEventListener('click', (event) => {
        event.preventDefault();
        console.log("Sign in button clicked");

        const email = document.getElementById('rEmailLogin').value;
        const password = document.getElementById('rPasswordLogin').value;

        console.log("Email:", email, "Password:", password);

        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                showMessage('Logged in successfully', 'signInMessage');
                localStorage.setItem('isloggedin', 'true');
                setTimeout(() => {
                    window.location.href = "index.html"; // Redirect to the desired page after showing message
                }, 1000); // Adjust timeout as needed
            })
            .catch((error) => {
                const errorCode = error.code;
                console.error("Error code:", errorCode);
                if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                    showMessage('Invalid email or password', 'signInMessage');
                } else {
                    showMessage('Unable to log in', 'signInMessage');
                }
            });
    });
} else {
    console.error("Sign in button element not found");
}
