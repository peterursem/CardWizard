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

export const getPossibleFormats = function() {
    return new Promise(resolve => {
        let formats = [];
        for(let format of Object.keys(documentFormats)){
            formats.push({size: format, desc: documentFormats[format].desc, example: "/imgs/" + format + ".png"});
        }
        resolve(formats);
    });
}

export const getAspectRatio = function(format) {
    return (documentFormats[format].images.width / documentFormats[format].images.height);
}

export const getCutSize = function(format) {
    console.log(documentFormats[format]);
    return {
        width: documentFormats[format].images.cutWidth/documentFormats[format].images.width*100, 
        height: documentFormats[format].images.cutHeight/documentFormats[format].images.height*100, 
        x: (documentFormats[format].images.width - documentFormats[format].images.cutWidth)/2/documentFormats[format].images.width*100, 
        y: (documentFormats[format].images.height - documentFormats[format].images.cutHeight)/2/documentFormats[format].images.height*100
    };
}

export const generatePreview = (format) => {
    const existingObject = document.querySelector("object"),
    placeHolder = document.querySelector('#placeHolder');
  
    getCropperData(format)
    .then(base64Image => {
        const pdf = createDocument(base64Image, format.toLowerCase());
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
    });
};

function createDocument(imgs, size) {
    const doc = new jspdf.jsPDF({
        orientation: "portrait",
        unit: "in",
        format: [8.5, 11]
    });

    doc.setProperties({
        'title': "Cut " + size,
        'author':  "Peter's Cut-Erator"
    });
    
    doc.setFontSize(12);
    doc.text('Cut-Erator - Use actual size and 8.5" x 11" (Letter) paper', 0.25, 3, {'angle': 270});

    let imgPkgs = positionImages(imgs, size);
    imgPkgs.forEach(pkg => {
        doc.addImage(pkg[0],pkg[1],pkg[2],pkg[3],pkg[4],pkg[5]);
    });

    doc.rect(0.3125,0.1875,1.5,0.0625,'F'); //Cutter calibration strip
 
    return(doc.output('bloburl'));
}

function positionImages(img, size) {
    console.log(size);
    console.log(typeof img);
    console.log(img);

    let imgs = [];
    if (typeof img == 'string'){
        imgs.push(img);
    }

    if (imgs.length > 1 && imgs.length < documentFormats[size].layout[0] * documentFormats[size].layout[1]) {
        console.warn('Not enough images to fill page.');
    }

    var index = 0,
        imagePkgs = [];
    for(let x = 0; x < documentFormats[size].layout[0]; x++){
        for(let y = 0; y < documentFormats[size].layout[1]; y++) {
            let position = {'x': (documentFormats[size].margins.x + (documentFormats[size].margins.gutterX*x) + (documentFormats[size].images.width*x)), 
                            'y': (documentFormats[size].margins.y + (documentFormats[size].margins.gutterY*y) + documentFormats[size].images.height*y)};
            let dimension = {'x': documentFormats[size].images.width,
                             'y': documentFormats[size].images.height };
            imagePkgs.push([imgs[index], 'PNG', position.x, position.y, dimension.x, dimension.y]);
            if (imgs.length > 1) {index++;}
        }
    }
    return imagePkgs;
}