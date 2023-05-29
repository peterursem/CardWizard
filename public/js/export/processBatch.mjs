import { addPhotoSilently, generatePreview } from "./export.mjs";
import { documentFormats } from "./documentFormats.mjs";
import { checkRotation, isBase64UrlImage, blobToBase64 } from "../base64handler.mjs";


export default function processBatch(files, format) {
    const aspectRatio = documentFormats[format].editor.aspectRatio;
    let index = 0;
    Array.from(files).forEach((file) => {
        processBatchImg(file, aspectRatio, format)
            .then(() => {
                index++;
                if (index == files.length) {
                    generatePreview(format);
                }
            })
            .catch((err) => {
                console.warn('Photo rejected: ', err);
            });
    });
};

function processBatchImg(file, aspect, format) {
    return new Promise(async (res, rej) => {
        const reader = new FileReader();
        reader.onload = () => {
            isBase64UrlImage(reader.result)
                .catch((err) => {
                    rej(err);
                    return;
                })
                .then(async () => {
                    const rotatedImg = await checkRotation(reader.result, format), 
                    finalImg = await autoCrop(rotatedImg, aspect);
                    addPhotoSilently(finalImg);
                    res();
                });
        };
        reader.readAsDataURL(file);
    });
}

function autoCrop(data, aspect) {            
    const img = new Image();
    return new Promise((resolve) => {
        img.onload = () => {
            const ogWidth = img.naturalWidth,
            ogHeight = img.naturalHeight,
            ogAspect = ogWidth / ogHeight;

            let outputWidth = ogWidth,
            outputHeight = ogHeight;
            if (ogAspect > aspect) {
                    outputWidth = ogHeight * aspect;
            } else if (ogAspect < aspect) {
                    outputHeight = ogWidth / aspect;
            }
            const outputX = (outputWidth - ogWidth) * 0.5,
            outputY = (outputHeight - ogHeight) * 0.5;
            const output = new OffscreenCanvas(outputWidth, outputHeight),
            ctx = output.getContext('2d');
            ctx.drawImage(img, outputX, outputY);
            output.convertToBlob({type: 'image/jpeg', quality: 0.8})
            .then(async (blob) => {
                    resolve(await blobToBase64(blob));
            });
        };
        img.src = data;
    });
}