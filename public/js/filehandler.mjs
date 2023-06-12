import { blobToBase64 } from "./base64handler.mjs";

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
                console.log(file);
                const blobURL = URL.createObjectURL(file);
                fetch(blobURL)
                        .then(blobRes => blobRes.blob())
                        .then(blob => heic2any({ blob, toType: "image/jpeg", quality: 1 }))
                        .then(newBlob => blobToBase64(newBlob))
                        .then(data => res(data));
        });
};
