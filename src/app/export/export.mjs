import { cutterFormats, pageOrientation } from './documentFormats.mjs';
import { Editor } from '../editor/editor.mjs';
import { jsPDF } from "jspdf";
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase.mjs';

var images = [];
var lastDocument = '';
var pages = 1;

export const generatePreview = (format) => {
        const existingObject = document.querySelector('object');
        const placeholder = document.querySelector('#placeholder');
        const pdf = createDocument(images, format.toLowerCase());
        const object = document.createElement('object');

        object.type = 'application/pdf';
        object.data = pdf;
        if (existingObject) {
                existingObject.remove();
        }
        if (placeholder) {
                placeholder.remove();
        }
        document.querySelector('main').appendChild(object);
        logEvent(analytics, 'preview_generated', {
                'images': images.length,
                'pages': pages
        });
};

export const addPage = (format) => {        
        const imgsOnPage = cutterFormats[format].layout.x * cutterFormats[format].layout.y;
        let noImg = imgsOnPage - (images.length % imgsOnPage);
        for (let i = 0; i < noImg; i++) images.push(Editor.currentEditor.export());

        generatePreview(format);
}

export const addPhoto = (format) => {
        images.push(Editor.currentEditor.export());
        generatePreview(format);
};

export const addPhotoSilently = (data) => {
        images.push(data);
}

export const clearPages = () => {
        images = [];
        lastDocument = '';
        if (document.querySelector('object')) {
                let placeholder = document.createElement('div');
                placeholder.id = 'placeholder';
                placeholder.classList.add('highlight');
                placeholder.classList.add('border');
                document.querySelector('object').replaceWith(placeholder);
        }
};

export const printPages = () => {
        if (lastDocument != '') {
                logEvent(analytics, 'print_requested', {
                        'images': images.length,
                        'pages': pages
                });
                window.open(lastDocument);
        }
};

function positionImages(imgs, format) {
        var imgPkgs = [];
        for (let img in imgs) {
                let imageNo = img;
                while (imageNo >= cutterFormats[format].layout.x * cutterFormats[format].layout.y) {
                        imageNo -= cutterFormats[format].layout.x * cutterFormats[format].layout.y;
                }
                const x = imageNo % cutterFormats[format].layout.x;
                const y = Math.floor(imageNo / cutterFormats[format].layout.x);
                const gutters = { x: cutterFormats[format].margins.gutterX || 0, y: cutterFormats[format].margins.gutterY || 0 };
                let pos = {
                        x: (cutterFormats[format].margins.x + (gutters.x * x) + (cutterFormats[format].images.width * x)),
                        y: (cutterFormats[format].margins.y + (gutters.y * y) + cutterFormats[format].images.height * y)
                };
                let dim = {
                        x: cutterFormats[format].images.width,
                        y: cutterFormats[format].images.height
                };
                imgPkgs.push([imgs[img], pos.x, pos.y, dim.x, dim.y]);
        }
        return imgPkgs;
}

function createDocument(imgs, format) {        
        pages = 1;

        const doc = new jsPDF({
                orientation: pageOrientation(format),
                unit: "in",
                format: cutterFormats[format].pageSize
        });

        doc.setProperties({
                'title': "Cut " + format,
                'author': "Peter's Cut-Erator"
        });

        const imgsOnPage = cutterFormats[format].layout.x * cutterFormats[format].layout.y;
        let i = 0;
        positionImages(imgs, format).forEach(pkg => {
                if (i % imgsOnPage == 0 && i > 0) {
                        watermark(doc, format);

                        doc.addPage();
                        pages++;
                }
                doc.addImage(pkg[0], 'JPEG', pkg[1], pkg[2], pkg[3], pkg[4]);
                i++;
        });
        watermark(doc, format);

        lastDocument = doc.output('bloburl');
        return (lastDocument);
}

function watermark(doc, size) {
        if(!cutterFormats[size].disableWatermark){
                doc.setFontSize(12);
                doc.text(size + '   -   Print actual size on 8.5" x 11" (Letter) paper   -   Load into cutter with black bar first.', 0.25, 1.75, { 'angle': 270 });
                doc.rect(0.3125, 0.125, 1.5, 0.0625, 'F'); //Cutter calibration strip
        }
}

document.getElementById('clear').addEventListener('click', () => {
        clearPages();
        logEvent(analytics, 'clear_pages');
});
document.getElementById('print').addEventListener('click', printPages);
