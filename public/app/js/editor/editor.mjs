import { cutterFormats } from "../export/documentFormats.mjs";
import Cropper from "../lib/cropper.esm.js";
import { checkRotation, isBase64Image } from "../base64handler.mjs";

const editor = document.getElementById('editor');
var cropper;
var bgColor = '#fff';

export const switchCropperFormat = async format => {
        let image = new Image();
        image.src = '/app/imgs/templates/'+format+'.jpg';
        document.querySelector('#editor').appendChild(image);
        drawCropper(image, format);
        rotateImg('rst');
};

export const processImageData = (data, format) => {
        if (cropper) {
                isBase64Image(data)
                .catch(err => {
                        console.warn(err);
                        return;
                })
                .then(img => checkRotation(img, format, 'dataURL'))
                .then(r => cropper.replace(r))
                .then(() => rotateImg('rst'));
        }
};

export const getCropperData = () => {
        return cropper.getCroppedCanvas({ fillColor: bgColor }).toDataURL('image/jpeg', 0.8);
};

export const destroyCropper = () => { cropper.destroy(); };

function drawCropper(img, format) {
        const formatDimensions = cutterFormats[format].editor;
        editor.style.setProperty('--aspectRatio', formatDimensions.aspectRatio);
        cropper = new Cropper(img, {
                aspectRatio: formatDimensions.aspectRatio,
                ready() {
                        const cutBox = document.getElementById('cutBox');
                        cutBox.style.position = "absolute";
                        cutBox.style.width = "calc(" + formatDimensions.width + "% - 3px)";
                        cutBox.style.height = "calc(" + formatDimensions.height + "% - 3px)";
                        cutBox.style.left = formatDimensions.x + "%";
                        cutBox.style.top = formatDimensions.y + "%";
                }
        });
}

var rot = 0,
abs = 0;
function rotateImg(mode, deg) {
        console.log(rot, deg, abs);
        if (mode == 'rel') rot += deg;
        if (mode == 'abs') abs = deg;
        if (mode == 'rst') {
                abs = 0;
                rot = 0;
                document.getElementById('rotation').value = 0;
        }
        if(cropper) cropper.rotateTo(rot+abs);
}

document.getElementById('rotateRight').addEventListener('click', () => {rotateImg('rel', 90);});
document.getElementById('rotateLeft').addEventListener('click', () => {rotateImg('rel', -90);});
document.getElementById('rotation').addEventListener('input', (e) => {rotateImg('abs', parseInt(e.target.value));});

function updateColor(e) {
        bgColor = e.target.value;
        document.getElementsByClassName("cropper-crop-box")[0].style.backgroundColor = e.target.value;
}
document.getElementById('bgColor').addEventListener('input', (e) => updateColor(e));
document.getElementById('bgColor').addEventListener('click', (e) => updateColor(e));

let timer;
document.body.onresize = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
                cropper.reset();
                rotateImg();
        }, 200);
}