import { addPhotoSilently, generatePreview } from "./export.mjs";
import { cutterFormats, formatOrientation } from "./documentFormats.mjs";
import { blobToBase64, validateBase64Img } from "../base64handler.mjs";
import { fileToBase64 } from "../filehandler.mjs";

export const processBatch = (files, format) => {
        if(!firebase.auth().currentUser) return;

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
        if(!firebase.auth().currentUser) return;

        return new Promise(res => {
                fileToBase64(file)
                .then(data => validateBase64Img(data, formatOrientation(format)))
                .then(rotated => autoCrop(rotated.canvas, format))
                .then(final => addPhotoSilently(final))
                .then(() => {
                        gtag('event', 'batch_image_processed');
                        res();
                });
        });
}

function autoCrop(canvas, format) {
        if(!firebase.auth().currentUser) return;

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

                out.convertToBlob({ type: 'image/jpeg', quality: 1 })
                .then(blob => blobToBase64(blob))
                .then(data => res(data));
        });
}