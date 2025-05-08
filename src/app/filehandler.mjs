import { blobToBase64 } from "./base64handler.mjs";
import { getAnalytics, logEvent } from 'firebase/analytics';
import { app } from '../firebase.mjs';

const analytics = getAnalytics(app);

export const fileToBase64 = (file) => {
        return new Promise(async res => {
                if(file.name.includes(".HEIC")) res(await heicConvert(file));
                else {
                        const reader = new FileReader();
                        reader.onload = () => {
                                res(reader.result);
                        };
                        reader.readAsDataURL(file);
                }
        });
};

function heicConvert(file) {
        return new Promise(res => {
                const blobURL = URL.createObjectURL(file);
                fetch(blobURL)
                        .then(blobRes => blobRes.blob())
                        .then(blob => heic2any({ blob, toType: "image/jpeg", quality: 1 }))
                        .then(newBlob => blobToBase64(newBlob))
                        .then(data => {
                                logEvent(analytics, 'heic_converted');
                                res(data);
                        });
        });
};
