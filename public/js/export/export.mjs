import { documentFormats } from './documentFormats.mjs';
import { getCropperData } from '../editor/editor.mjs';
 
var images = [],
lastDocument = '';

export const generatePreview = (format) => {
    const existingObject = document.querySelector('object'),
    placeHolder = document.querySelector('#placeHolder');

    const pdf = createDocument(images, format.toLowerCase());
    let object = document.createElement('object');
    object.type = 'application/pdf';
    object.data = pdf;
    if(existingObject) {
        existingObject.remove();
    }
    if(placeHolder) {
        placeHolder.remove();
    }
    document.querySelector('main').appendChild(object);
};

export const addPage = (format) => {
    const imgsOnPage = documentFormats[format].layout.x * documentFormats[format].layout.y;
    getCropperData()
    .then(base64Image => {
        let noImg = images.length;
        while(noImg >= imgsOnPage) {
            noImg -= imgsOnPage;
        }
        const remain = imgsOnPage - noImg;
        for(let i = 0; i < remain; i++) {
            images.push(base64Image);
        }
        generatePreview(format);
    });
}

export const addPhoto = (format) => {
    getCropperData()
    .then(base64Image => {
        images.push(base64Image);
        generatePreview(format);
    });
};

export const addPhotoSilently = (data) => {
    images.push(data);
}

export const clearPages = () => {
    images = [];
    lastDocument = '';
    if(document.querySelector('object')) {
        let placeHolder = document.createElement('div');
        placeHolder.id = 'placeHolder';
        placeHolder.classList.add('highlightBorder');
        document.querySelector('object').replaceWith(placeHolder);
    }
};

export const printPages = () => {
    if(lastDocument != '') {
        window.open(lastDocument);
    }
};

function positionImages(imgs, format) {
    var imgPkgs = [];
    for(let img in imgs) {
        let imageNo = img;
        while (imageNo >= documentFormats[format].layout.x * documentFormats[format].layout.y) {
            imageNo -= documentFormats[format].layout.x * documentFormats[format].layout.y;
        }
        const x = imageNo % documentFormats[format].layout.x;
        const y = Math.floor(imageNo / documentFormats[format].layout.x);
        const gutters = {x: documentFormats[format].margins.gutterX || 0, y: documentFormats[format].margins.gutterY || 0};
        let pos = {x: (documentFormats[format].margins.x + (gutters.x*x) + (documentFormats[format].images.width*x)), 
                   y: (documentFormats[format].margins.y + (gutters.y*y) + documentFormats[format].images.height*y)};
        let dim = {x: documentFormats[format].images.width,
                   y: documentFormats[format].images.height };
        imgPkgs.push([imgs[img], 'PNG', pos.x, pos.y, dim.x, dim.y]);
    }
    return imgPkgs;
}

function createDocument(imgs, format) {
    const doc = new jspdf.jsPDF({
        orientation: "portrait",
        unit: "in",
        format: [8.5, 11]
    });

    doc.setProperties({
        'title': "Cut " + format,
        'author':  "Peter's Cut-Erator"
    });

    let imgPkgs = positionImages(imgs, format);
    const imgsOnPage = documentFormats[format].layout.x * documentFormats[format].layout.y;
    let i = 0;
    imgPkgs.forEach(pkg => {
        if (i % imgsOnPage == 0 && i > 0) {
            watermark(doc, format);
            doc.addPage();
        }
        doc.addImage(pkg[0],pkg[1],pkg[2],pkg[3],pkg[4],pkg[5]);
        i++;
    });
    watermark(doc, format);
    lastDocument = doc.output('bloburl');
    return(lastDocument + '#toolbar=0');
}

function watermark(doc,size) {
    doc.setFontSize(12);
    doc.text(size + '   -   Print actual size on 8.5" x 11" (Letter) paper   -   Load into cutter with black bar first.', 0.25, 1.75, {'angle': 270});
    doc.rect(0.3125,0.125,1.5,0.0625,'F'); //Cutter calibration strip
}

document.getElementById('clear').addEventListener('click', clearPages);
document.getElementById('print').addEventListener('click', printPages);
