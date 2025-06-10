import { addPhotoSilently, generatePreview } from "./export.mjs";
import { cutterFormats, formatOrientation } from "./documentFormats.mjs";
import { blobToBase64, validateBase64Img } from "../base64handler.mjs";
import { fileToBase64 } from "../filehandler.mjs";
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase.mjs';

export const processBatch = (files, format) => {
        const start = new Date(Date.now());
        let index = 0;
        Array.from(files).forEach((file) => {
                processBatchImg(file, format)
                .then(() => {
                        if (++index == files.length) {
                                console.info('Completley processed batch in: ' + (Date.now() - start) + 'ms');
                                generatePreview(format);
                        }
                }); 
        });
};

function processBatchImg(file, format) {
        return new Promise(res => {
                fileToBase64(file)
                .then(data => validateBase64Img(data, formatOrientation(format)))
                .then(rotated => autoCrop(rotated.canvas, format))
                .then(final => addPhotoSilently(final))
                .then(() => {
                        logEvent(analytics, 'batch_image_processed');
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
                ctx.fillStyle = document.getElementById('bg-color').value || '#ffffff';
                ctx.fillRect(0,0,width,height);
                ctx.drawImage(canvas, x, y);

                out.convertToBlob({ type: 'image/jpeg', quality: 1 })
                .then(blob => {
                        blobToBase64(blob)
                        .then(data => {
                                blob = null;
                                res(data);
                        });
                });
        });
}