import { addPhotoSilently, generatePreview } from "./export.mjs";
import { documentFormats } from "./documentFormats.mjs";
import { checkRotation, isBase64UrlImage, blobToBase64 } from "../base64handler.mjs";


export default function processBatch(files, format) {
    const before = new Date(Date.now());
    let index = 0;
    Array.from(files).forEach((file) => {
        const now = new Date(Date.now());
        processBatchImg(file, format)
            .then(() => {
                console.info('Completley processed image in: ' + (Date.now() - now) + 'ms');
                index++;
                if (index == files.length) {
                    console.info('Completley processed batch in: ' + (Date.now() - before) + 'ms');
                    generatePreview(format);
                }
            })
            .catch((err) => {
                console.warn('Photo rejected: ', err);
            });
    });
};

function processBatchImg(file, format) {
    return new Promise(async (res, rej) => {
        const reader = new FileReader();
        reader.onload = () => {
            isBase64UrlImage(reader.result)
                .catch((err) => {
                    rej(err);
                    return;
                })
                .then(async (img) => {
                    const rotCanvas = await checkRotation(img, format, 'canvas'), 
                    finalImg = await autoCrop(rotCanvas, format);
                    addPhotoSilently(finalImg);
                    res();
                });
        };
        reader.readAsDataURL(file);
    });
}

function autoCrop(canvas, format) {
    const now = new Date(Date.now());           
    return new Promise((res) => {
        const aspect = documentFormats[format].editor.aspectRatio,
        ogWidth = canvas.width,
        ogHeight = canvas.height,
        ogAspect = ogWidth / ogHeight;

        let width = ogWidth,
        height = ogHeight;
        if (ogAspect > aspect) {
            width = height * aspect;
        } else if (ogAspect < aspect) {
            height = width / aspect;
        }
        
        const x = (width - ogWidth) * 0.5,
        y = (height - ogHeight) * 0.5,

        output = new OffscreenCanvas(width, height),
        ctx = output.getContext('2d');
        ctx.drawImage(canvas, x, y);

        output.convertToBlob({type: 'image/jpeg', quality: 0.8})
        .then(async (blob) => {
            const cropped = await blobToBase64(blob);
            console.info('Cropped image in: ' + (Date.now() - now) + 'ms');
            res(cropped);
        });
    });
}