const auth = firebase.auth(),
registrationForm = document.getElementById('registration'),
loginForm = document.getElementById('login'),
logout = document.getElementById('logout'),
submit = document.getElementById('submit');

export let uid = 'nope';

if(registrationForm){
        const db = firebase.firestore();
        submit.addEventListener('click', (e) => {
                e.preventDefault();

                const email = document.getElementById('email').value,
                 emailCheck = document.getElementById('emailcheck').value,
                 pass = document.getElementById('password').value,
                 passCheck = document.getElementById('passwordcheck').value;

                if (email == emailCheck && pass == passCheck) {
                        auth.createUserWithEmailAndPassword(email, pass)
                        .then((userCredential) => {
                                const user = userCredential.user;
                                
                                uid = user.uid;

                                db.collection('users').doc(user.uid).set({
                                        retailer: document.getElementById('retailer').value,
                                        store: document.getElementById('storeno').value,
                                        referral: document.getElementById('referral').value,
                                })
                                .then(() => {
                                        console.log('Success: ', user);
                                })
                                .catch((error) => {
                                        console.error("Error adding user: ", error);
                                });

                                window.location.href = '/app/';
                        })
                        .catch((err) => {
                                console.error('Error creating user: ', err.code, err.message);
                        });
                }
        });
}

if(loginForm){
        submit.addEventListener('click', (e) => {
                e.preventDefault();

                const email = document.getElementById('email').value,
                 pass = document.getElementById('password').value;

                auth.signInWithEmailAndPassword(email, pass)
                .then((userCredential) => {
                        const user = userCredential.user;
                        console.log('Success: ', user);
                        window.location.href = '/app/';
                })
                .catch((err) => {
                        console.error('Error logging in user: ', err.code, err.message);
                });
        });
}

if(logout) {
        logout.addEventListener('click', e => {
                e.preventDefault();

                auth.signOut();
        });
}