const documentFormats = {
    '3.5x2': {
        'desc': "Business Card",
        'margins': {
            'x':0.375,
            'y':0.1875,
            'gutterX': 0.25,
            'gutterY': 0
        },
        'images': {
            'width': 3.75,
            'height': 2.125,
            "cutWidth": 3.5,
            "cutHeight": 2
        },
        'layout': [2,5]
    },
    '3.5x5': {
        'desc': "Note Card",
        'margins': {
            'x':0.375,
            'y':0.125,
            'gutterX': 0.25,
            'gutterY': 0.25
        },
        'images': {
            'width': 3.75,
            'height': 5.25,
            "cutWidth": 3.5,
            "cutHeight": 5
        },
        'layout': [2,2]
    },
    '4x6': {
        'desc': "Post Card / Photo",
        'margins': {
            'x':1.125,
            'y':0.375,
            'gutterX': 0,
            'gutterY': 2
        },
        'images': {
            'width': 6.25,
            'height': 4.25,
            "cutWidth": 6,
            "cutHeight": 4
        },
        'layout': [1,2]
    },
    '5x7': {
        'desc': "Post Card / Photo",
        'margins': {
            'x':0.625,
            'y':0.375,
            'gutterX': 0,
            'gutterY': 0
        },
        'images': {
            'width': 7.25,
            'height': 5.25,
            "cutWidth": 7,
            "cutHeight": 5
        },
        'layout': [1,2]
    }
};

import { getCropperData } from "./editor.mjs";

var images = [];

export const getPossibleFormats = function() {
    return new Promise(resolve => {
        let formats = [];
        for(let format of Object.keys(documentFormats)){
            formats.push({size: format, desc: documentFormats[format].desc, example: "/imgs/" + format + ".png"});
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
    const existingObject = document.querySelector("object"),
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
    document.querySelector('content').appendChild(object);
};

export const addPage = (format) => {
    const imgsOnPage = documentFormats[format].layout[0] * documentFormats[format].layout[1];
    getCropperData()
    .then(base64Image => {
        for(let i; i < imgsOnPage; i++) {
            images.push(base64Image);
            console.log(images);
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
    const imgsOnPage = documentFormats[format].layout[0] * documentFormats[format].layout[1];
    let i = 0;
    imgPkgs.forEach(pkg => {
        if (i % imgsOnPage == 0 && i > 0) {
            watermark(doc);
            doc.addPage();
        }
        doc.addImage(pkg[0],pkg[1],pkg[2],pkg[3],pkg[4],pkg[5]);
        i++;
    });
    watermark(doc);
 
    return(doc.output('bloburl'));
}

function watermark(doc) {
    doc.setFontSize(12);
    doc.text('Cut-Erator - Use actual size and 8.5" x 11" (Letter) paper - Load with black bar first.', 0.25, 2.25, {'angle': 270});
    doc.rect(0.3125,0.1875,1.5,0.0625,'F'); //Cutter calibration strip
}

function positionImages(imgs, format) {
    var i = 0,
        imgPkgs = [];

    for(let img in imgs) {
        let imgNo = img;
        while (imgNo >= documentFormats[format].layout[1]) {
            imgNo -= documentFormats[format].layout[1];
        }
        const x = imgNo % documentFormats[format].layout[0];
        const y = Math.floor(imgNo / documentFormats[format].layout[0]);
        let pos = {'x': (documentFormats[format].margins.x + (documentFormats[format].margins.gutterX*x) + (documentFormats[format].images.width*x)), 
                   'y': (documentFormats[format].margins.y + (documentFormats[format].margins.gutterY*y) + documentFormats[format].images.height*y)};
        let dim = {'x': documentFormats[format].images.width,
                   'y': documentFormats[format].images.height };
        imgPkgs.push([imgs[i], 'PNG', pos.x, pos.y, dim.x, dim.y]);

        if (i < imgs.length) {
            i++;
        }
    }
    return imgPkgs;
}