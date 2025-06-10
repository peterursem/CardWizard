import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
        apiKey: "AIzaSyC0DbSch6HYfsPSKo59yn5GqOxR0TgY5j4",
        authDomain: "cut-erator.firebaseapp.com",
        projectId: "cut-erator",
        storageBucket: "cut-erator.firebasestorage.app",
        messagingSenderId: "932833227104",
        appId: "1:932833227104:web:42cec01b4d4e47594fee05",
        measurementId: "G-JXMJS15MV0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

if (window.location.host == '127.0.0.1:5000') {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099');
        connectStorageEmulator(storage, '127.0.0.1', 9199);
}                    