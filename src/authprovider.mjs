import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { ref, getBlob } from "firebase/storage";
import { analytics, auth, storage } from "./firebase.mjs";
import { setUserProperties } from "firebase/analytics";

const registrationForm = document.getElementById('registration');
const loginForm = document.getElementById('login');
const logout = document.getElementById('logout');
const submit = document.getElementById('submit');

if (registrationForm) {
        submit.addEventListener('click', (e) => {
                e.preventDefault();

                const email = document.getElementById('email').value;
                const emailCheck = document.getElementById('emailcheck').value;
                const pass = document.getElementById('password').value;
                const passCheck = document.getElementById('passwordcheck').value;

                if (email == emailCheck && pass == passCheck && document.getElementById('referral').value == 'CW25p2U203') {
                        createUserWithEmailAndPassword(auth, email, pass)
                                .catch((err) => {
                                        document.getElementById('errmsg').innerText = 'Error creating user: ' + err.code + err.message
                                });
                } else {
                        document.getElementById('errmsg').innerText = 'Error in form: Ensure your referral code is valid, and that your email and password match the verification.'
                }
        });
}

if (loginForm) {
        submit.addEventListener('click', (e) => {
                e.preventDefault();

                const email = document.getElementById('email').value;
                const pass = document.getElementById('password').value;

                signInWithEmailAndPassword(auth, email, pass)
                        .catch((err) => {
                                document.getElementById('errmsg').innerText = 'Error logging in user: ' + err.code + err.message;
                        });
        });
}

if (logout) {
        logout.addEventListener('click', e => {
                e.preventDefault();
                auth.signOut();
        });
}

onAuthStateChanged(auth, (user) => {
        if(user) {
                if (user.email == "eval@cardwizard.ca") setUserProperties(analytics, { userType: "eval" });
                if (user.email.includes("@busdep.com")) setUserProperties(analytics, { userType: "retail" });
                if(window.location.pathname != '/app/')
                        window.location.pathname = '/app/';
                else {
                        getBlob(ref(storage, '/app.js'))
                            .then(blob => {
                                const script = document.createElement("script");
                                script.src = URL.createObjectURL(blob);
                                document.body.appendChild(script);
                            });   
                }
        } else if(window.location.pathname == '/app/' || window.location.pathname == '/auth/verify')
                window.location.pathname = '/auth/register';
});