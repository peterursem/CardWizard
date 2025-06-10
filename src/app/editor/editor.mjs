import Cropper from "cropperjs";
import { cutterFormats } from "../export/documentFormats.mjs";
import { validateBase64Img } from "../base64handler.mjs";
import { settings } from "../settings.mjs";

export class Editor {
        format;
        cropper;
        image;
        rotateDeg = 0;
        skewDeg = 0;
        bgColour = '#ffffff';

        static element = document.getElementById('editor');
        static currentEditor;

        static switchFormat(format) {
                const image = new Image();
                image.src = `/app/imgs/templates/${format}.jpg`;
                document.getElementById('editor').appendChild(image);

                this.currentEditor = new Editor(image, format);
                this.currentEditor.resetRotation();    
        }

        static setCutbox = dimensions => { 
                document.getElementById('cut-box').style.cssText = `\
                        position: absolute; \
                        box-sizing: border-box; \
                        width: calc(${dimensions.width}% ); \
                        height: calc(${dimensions.height}%); \
                        left: ${dimensions.x}%; \
                        top: ${dimensions.y}%;\
                        border-width: 1px;`;
        }

        constructor(img, format) {
                this.format = format;
                this.image = img;
                const formatDimensions = cutterFormats[format].editor;
                Editor.element.style.setProperty('--aspectRatio', formatDimensions.aspectRatio);
                this.cropper = new Cropper(img, {
                        aspectRatio: formatDimensions.aspectRatio,
                        ready() { Editor.setCutbox(formatDimensions); }
                });
        }

        updateColour(colour) {
                this.bgColour = colour;
                document.getElementsByClassName("cropper-crop-box")[0].style.backgroundColor = colour;
        }

        rotate(deg) {
                this.rotateDeg += deg;
                this.cropper.rotateTo(this.skewDeg + this.rotateDeg);
        }

        skew(deg) {
                this.skewDeg = deg;
                this.cropper.rotateTo(this.skewDeg + this.rotateDeg);
        }

        refresh() {
                this.cropper.reset();
                this.rotate(0);
        }

        resetRotation() {
                this.rotateDeg = 0;
                this.skewDeg = 0;
                this.cropper.rotateTo(0);
        }

        addImage(img) {
                this.image = img;
                validateBase64Img(img, this.format)
                .then(r => this.cropper.replace(r.base64))
                .then(() => this.resetRotation());
        }

        export() {
                return this.cropper.getCroppedCanvas({ 
                        fillColor: this.bgColour,
                        width: cutterFormats[this.format].images.width * settings.dpi,
                        height: cutterFormats[this.format].images.height * settings.dpi
                })
                .toDataURL('image/jpeg');    
        }

        destroy() {
                this.cropper.destroy();
                Editor.currentEditor = null;
        }
}