import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";
import { getStorage, ref, getBlob, connectStorageEmulator } from "firebase/storage";
import { app } from "./firebase.mjs";

const auth = getAuth(app);
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
                                .then(() => { window.location.href = '/app/'; })
                                .catch((err) => {
                                        console.error('Error creating user: ', err.code, err.message);
                                });
                } else {
                        document.getElementById('errmsg').innerText = 'Error creating account: Ensure your referral code is valid, and that your email and password match the verification.'
                }
        });
}

if (loginForm) {
        submit.addEventListener('click', (e) => {
                e.preventDefault();

                const email = document.getElementById('email').value;
                const pass = document.getElementById('password').value;

                signInWithEmailAndPassword(auth, email, pass)
                        .then(() => { window.location.href = '/app/'; })
                        .catch((err) => {
                                console.error('Error logging in user: ', err.code, err.message);
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
                if(window.location.pathname != '/app/')
                        window.location.pathname = '/app/';
                else {
                        const storage = getStorage(app);                        
                        getBlob(ref(storage, '/app.js'))
                            .then(blob => {
                                const script = document.createElement("script");
                                script.src = URL.createObjectURL(blob);
                                document.body.appendChild(script);
                            });   
                }
        } else {
                if(window.location.pathname == '/app/' || window.location.pathname == '/auth/verifyuser.html')
                        window.location.pathname = '/auth/register.html';
        }
});