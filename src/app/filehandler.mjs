import { blobToBase64 } from "./base64handler.mjs";
import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase.mjs';

export const fileToBase64 = (file) => {
        return new Promise(async res => {
                if(file.name.toLowerCase().includes(".heic")) res(await heicConvert(file));
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
