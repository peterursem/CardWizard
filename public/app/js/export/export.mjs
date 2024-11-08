import { cutterFormats } from './documentFormats.mjs';
import { getCropperData } from '../editor/editor.mjs';

var images = [],
lastDocument = '',
pages = 0,
rev = 1;

export const generatePreview = (format) => {
        if(!firebase.auth().currentUser) return;
        const existingObject = document.querySelector('object'),
        placeholder = document.querySelector('#placeholder');

        const pdf = createDocument(images, format.toLowerCase());
        let object = document.createElement('object');
        object.type = 'application/pdf';
        object.data = pdf;
        if (existingObject) {
                existingObject.remove();
        }
        if (placeholder) {
                placeholder.remove();
        }
        document.querySelector('main').appendChild(object);
        gtag('event', 'preview_generated', {
                'images': images.length,
                'pages': pages,
                'rev': rev
        });
};

export const addPage = (format) => {
        if(!firebase.auth().currentUser) return;
        const imgsOnPage = cutterFormats[format].layout.x * cutterFormats[format].layout.y;

        let noImg = images.length;
        while (noImg >= imgsOnPage) {
                noImg -= imgsOnPage;
        }
        const remain = imgsOnPage - noImg;
        for (let i = 0; i < remain; i++) {
                images.push(getCropperData());
        }
        generatePreview(format);
}

export const addPhoto = (format) => {
        if(!firebase.auth().currentUser) return;
        images.push(getCropperData());
        generatePreview(format);
};

export const addPhotoSilently = (data) => {
        if(!firebase.auth().currentUser) return;
        images.push(data);
}

export const clearPages = () => {
        if(!firebase.auth().currentUser) return;
        rev = 1;
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
        if(!firebase.auth().currentUser) return;
        if (lastDocument != '') {
                gtag('event', 'print_requested', {
                        'images': images.length,
                        'pages': pages
                });
                window.open(lastDocument);
        }
};

function positionImages(imgs, format) {
        if(!firebase.auth().currentUser) return;
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
                imgPkgs.push([imgs[img], 'PNG', pos.x, pos.y, dim.x, dim.y]);
        }
        return imgPkgs;
}

function createDocument(imgs, format) {
        if(!firebase.auth().currentUser) return;
        pages = 0;

        const doc = new jspdf.jsPDF({
                orientation: "portrait",
                unit: "in",
                format: [8.5, 11]
        });

        doc.setProperties({
                'title': "Cut " + format,
                'author': "Peter's Cut-Erator"
        });

        let imgPkgs = positionImages(imgs, format);
        const imgsOnPage = cutterFormats[format].layout.x * cutterFormats[format].layout.y;
        let i = 0;
        imgPkgs.forEach(pkg => {
                if (i % imgsOnPage == 0 && i > 0) {
                        watermark(doc, format);
                        doc.addPage();
                        pages++;
                }
                doc.addImage(pkg[0], pkg[1], pkg[2], pkg[3], pkg[4], pkg[5]);
                i++;
        });
        pages++;
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
        gtag('event', 'clear_pages');
});
document.getElementById('print').addEventListener('click', printPages);
