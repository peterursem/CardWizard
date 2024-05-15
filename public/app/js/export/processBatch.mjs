import { addPhotoSilently, generatePreview } from "./export.mjs";
import { cutterFormats } from "./documentFormats.mjs";
import { checkRotation, isBase64Image, blobToBase64 } from "../base64handler.mjs";
import { fileToBase64 } from "../filehandler.mjs";


export default function processBatch(files, format) {
        const start = new Date(Date.now());
        let index = 0;
        Array.from(files).forEach((file) => {
                const now = new Date(Date.now());
                processBatchImg(file, format)
                .then(() => {
                        console.info('Processed image in: ' + (Date.now() - now) + 'ms');
                        if (index == files.length) {
                                console.info('Completley processed batch in: ' + (Date.now() - start) + 'ms');
                                generatePreview(format);
                        }
                })
                index++;
        });
};

function processBatchImg(file, format) {
        return new Promise(res => {
                fileToBase64(file)
                .then(data => isBase64Image(data))
                .catch(err => {
                        console.warn(err);
                        return;
                })
                .then(img => checkRotation(img, format, 'canvas'))
                .then(rotated => autoCrop(rotated, format))
                .then(final => addPhotoSilently(final))
                .then(() => {
                        gtag('event', 'batch_image_processed');
                        res();
                });
        });
}

function autoCrop(canvas, format) {
        return new Promise((res) => {
                const aspect = cutterFormats[format].editor.aspectRatio,
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

                out = new OffscreenCanvas(width, height),
                ctx = out.getContext('2d');
                ctx.drawImage(canvas, x, y);

                out.convertToBlob({ type: 'image/jpeg', quality: 0.8 })
                .then(blob => blobToBase64(blob))
                .then(data => res(data));
        });
}