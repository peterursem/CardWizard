import Cropper from "cropperjs";
import { cutterFormats } from "../export/documentFormats.mjs";
import { validateBase64Img } from "../base64handler.mjs";

const editor = document.getElementById('editor');
var cropper;
var bgColor = '#fff';
var dpi = 300;

export const switchCropperFormat = async format => {
        const image = new Image();
        image.src = '/app/imgs/templates/'+format+'.jpg';

        document.querySelector('#editor').appendChild(image);

        drawCropper(image, format);
        rotateImg('rst');
};

export const processImageData = (data, format) => {
        if (cropper) {
                validateBase64Img(data, format)
                .then(r => cropper.replace(r.base64))
                .then(() => rotateImg('rst'));
        }
};

export const getCropperData = (format) => {
        return cropper.getCroppedCanvas({ 
                fillColor: bgColor,
                maxWidth: cutterFormats[format].images.width * dpi,
                maxHeight: cutterFormats[format].images.height * dpi
        })
        .toDataURL('image/jpeg');
};

export const destroyCropper = () => { cropper.destroy(); };

function drawCropper(img, format) {
        const formatDimensions = cutterFormats[format].editor;
        editor.style.setProperty('--aspectRatio', formatDimensions.aspectRatio);
        cropper = new Cropper(img, {
                aspectRatio: formatDimensions.aspectRatio,
                ready() {
                        const cutBox = document.getElementById('cut-box');
                        cutBox.style.position = "absolute";
                        cutBox.style.width = "calc(" + formatDimensions.width + "% - 3px)";
                        cutBox.style.height = "calc(" + formatDimensions.height + "% - 3px)";
                        cutBox.style.left = formatDimensions.x + "%";
                        cutBox.style.top = formatDimensions.y + "%";
                        cutBox.classList.add('no-pointer');
                }
        });
}

var rot = 0,
abs = 0;
function rotateImg(mode, deg) {
        if (mode == 'rel') rot += deg;
        if (mode == 'abs') abs = deg;
        if (mode == 'rst') {
                abs = 0;
                rot = 0;
                document.getElementById('rotation').value = 0;
        }
        if(cropper) cropper.rotateTo(rot+abs);
}

document.getElementById('rotate-right').addEventListener('click', () => {rotateImg('rel', 90);});
document.getElementById('rotate-left').addEventListener('click', () => {rotateImg('rel', -90);});
document.getElementById('rotation').addEventListener('input', (e) => {rotateImg('abs', parseInt(e.target.value));});
                
function updateColor(e) {
        bgColor = e.target.value;
        document.getElementsByClassName("cropper-crop-box")[0].style.backgroundColor = e.target.value;
}
document.getElementById('bg-color').addEventListener('input', (e) => updateColor(e));
document.getElementById('bg-color').addEventListener('click', (e) => updateColor(e));

let timer;
document.body.onresize = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
                cropper.reset();
                rotateImg();
        }, 200);
}