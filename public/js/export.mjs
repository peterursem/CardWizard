const documentFormats = {
    '3.5x2': {
        desc: "Business Card",
        margins: {
            x: 0.375,
            y: 0.1875,
            gutterX: 0.25,
        },
        images: {
            width: 3.75,
            height: 2.125,
            cutWidth: 3.5,
            cutHeight: 2
        },
        layout: {x: 2, y: 5}
    },
    '3.5x2.5': {
        desc: "Trading Card",
        margins: {
            x: 0.375,
            y: 0.25,
            gutterX: 0.25,
        },
        images: {
            width: 3.75,
            height: 2.625,
            cutWidth: 3.5,
            cutHeight: 2.5
        },
        layout: {x: 2, y: 4}
    },
    '3.5x5': {
        desc: "Note Card",
        margins: {
            x: 0.375,
            y: 0.375,
            gutterX: 0.25,
            dsYmargin: 0.125
        },
        images: {
            width: 3.75,
            height: 5.25,
            cutWidth: 3.5,
            cutHeight: 5
        },
        layout: {x: 2, y: 2}
    },
    '3.5x5f': {
        desc: "Tent Card",
        margins: {
            x: 0.375,
            y: 0.375,
            gutterX: 0.25,
            dsYmargin: 0.125
        },
        images: {
            width: 3.75,
            height: 5.25,
            cutWidth: 3.5,
            cutHeight: 5
        },
        layout: {x: 2, y: 2}
    },
    '4x6': {
        desc: "Post Card / Photo",
        margins: {
            x: 1.125,
            y: 0.375,
            gutterY: 2,
            dsYmargin: 0.125
        },
        images: {
            width: 6.25,
            height: 4.25,
            cutWidth: 6,
            cutHeight: 4
        },
        layout: {x: 1, y: 2}
    },
    '5x7': {
        desc: "Post Card / Photo",
        margins: {
            x: 0.625,
            y: 0.375,
            dsYmargin: 0.125
        },
        images: {
            width: 7.25,
            height: 5.25,
            cutWidth: 7,
            cutHeight: 5
        },
        layout: {x: 1, y: 2}
    },
    '10x7f': {
        desc: "Greeting Card",
        margins: {
            x: 0.625,
            y: 0.65,
        },
        images: {
            width: 7.25,
            height: 10.25,
            cutWidth: 7,
            cutHeight: 10
        },
        layout: {x: 1, y: 1}
    }
};

import { getCropperData } from './editor.mjs';

var images = [];
let duplex = true;

export const getPossibleFormats = function() {
    return new Promise(resolve => {
        let formats = [];
        for(let format of Object.keys(documentFormats)){
            formats.push({size: format, desc: documentFormats[format].desc, example: "/imgs/ex/" + format + ".png"});
        }
        resolve(formats);
    });
};

export const getAspectRatio = function(format) {
    return (documentFormats[format].images.width / documentFormats[format].images.height);
}

export const getCutSize = function(format) {
    return {
        width: documentFormats[format].images.cutWidth/documentFormats[format].images.width*100, 
        height: documentFormats[format].images.cutHeight/documentFormats[format].images.height*100, 
        x: (documentFormats[format].images.width - documentFormats[format].images.cutWidth)/2/documentFormats[format].images.width*100, 
        y: (documentFormats[format].images.height - documentFormats[format].images.cutHeight)/2/documentFormats[format].images.height*100
    };
};

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

export const enableDuplex = () => {
    duplex = true;
};

export const disableDuplex = () => {
    duplex = false;
};

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

let lastDocument = '';
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

function positionImages(imgs, format) {
    var imgPkgs = [];
    for(let img in imgs) {
        let pageNo = 0,
            imageNo = img;
        while (imageNo >= documentFormats[format].layout.x * documentFormats[format].layout.y) {
            imageNo -= documentFormats[format].layout.x * documentFormats[format].layout.y;
            pageNo++;
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