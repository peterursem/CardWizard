import { cutterFormats, formatOrientation } from "../export/documentFormats.mjs";
import Cropper from "../lib/cropper.esm.js";
import { validateBase64Img } from "../base64handler.mjs";

const editor = document.getElementById('editor');
var cropper;
var bgColor = '#fff';

export const switchCropperFormat = async format => {
        if(!firebase.auth().currentUser) return;

        const image = new Image();
        image.src = '/app/imgs/templates/'+format+'.jpg';

        document.querySelector('#editor').appendChild(image);

        drawCropper(image, format);
        rotateImg('rst');
};

export const processImageData = (data, format) => {
        if(!firebase.auth().currentUser) return;

        if (cropper) {
                validateBase64Img(data, formatOrientation(format))
                .then(r => cropper.replace(r.base64))
                .then(() => rotateImg('rst'));
        }
};

export const getCropperData = () => {
        if(!firebase.auth().currentUser) return;

        return cropper.getCroppedCanvas({ fillColor: bgColor }).toDataURL('image/jpeg', 1);
};

export const destroyCropper = () => { cropper.destroy(); };

function drawCropper(img, format) {
        if(!firebase.auth().currentUser) return;

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
        if(!firebase.auth().currentUser) return;

        if (mode == 'rel') rot += deg;
        if (mode == 'abs') abs = deg;
        if (mode == 'rst') {
                abs = 0;
                rot = 0;
                document.getElementById('rotation').value = 0;
        }
        if(cropper) cropper.rotateTo(rot+abs);
}

firebase.auth().onAuthStateChanged((user) => {
        if(user) {
                document.getElementById('rotate-right').addEventListener('click', () => {rotateImg('rel', 90);});
                document.getElementById('rotate-left').addEventListener('click', () => {rotateImg('rel', -90);});
                document.getElementById('rotation').addEventListener('input', (e) => {rotateImg('abs', parseInt(e.target.value));});
                
                function updateColor(e) {
                        bgColor = e.target.value;
                        document.getElementsByClassName("cropper-crop-box")[0].style.backgroundColor = e.target.value;
                }
                document.getElementById('bg-color').addEventListener('input', (e) => updateColor(e));
                document.getElementById('bg-color').addEventListener('click', (e) => updateColor(e));
        }
        else window.location.href = '/';
});

let timer;
document.body.onresize = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
                cropper.reset();
                rotateImg();
        }, 200);
}