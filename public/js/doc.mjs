const documentFormats = {
    '3.5x2': {
        'margins': {
            'x':0.375,
            'y':0.1875,
            'gutterX': 0.25,
            'gutterY': 0
        },
        'images': {
            'width': 3.75,
            'height': 2.125
        },
        'layout': [2,5]
    },
    '3.5x5': {
        'margins': {
            'x':0.375,
            'y':0.125,
            'gutterX': 0.25,
            'gutterY': 0.25
        },
        'images': {
            'width': 3.75,
            'height': 5.25
        },
        'layout': [2,2]
    },
    '4x6': {
        'margins': {
            'x':1.125,
            'y':0.375,
            'gutterX': 0,
            'gutterY': 2
        },
        'images': {
            'width': 6.25,
            'height': 4.25
        },
        'layout': [1,2]
    },
    '5x7': {
        'margins': {
            'x':0.625,
            'y':0.375,
            'gutterX': 0,
            'gutterY': 0
        },
        'images': {
            'width': 7.25,
            'height': 5.25
        },
        'layout': [1,2]
    }
};

export function createDocument(imgs, size) {
    const doc = new jspdf.jsPDF({
        orientation: "portrait",
        unit: "in",
        format: [8.5, 11]
    });

    doc.setProperties({
        'title': 'Cut-Erated',
        'author':  "Peter's Cut-Erator"
    });
    
    doc.rect(0.5,0.0625,1,0.125,'F'); //Cutter calibration strip
    
    doc.setFontSize(12);
    doc.text('Cut-Erator - Use actual size and 8.5" x 11" (Letter) paper', 0.25, 3, {'angle': 270});

    let imgPkgs = positionImages(imgs, size);
    imgPkgs.forEach(pkg => {
        doc.addImage(pkg[0],pkg[1],pkg[2],pkg[3],pkg[4],pkg[5]);
    });
    doc.save('test.pdf');
    return(doc.output('datauristring'));
}

function positionImages(imgs, size) {
    console.log(size);
    if (imgs.length < documentFormats[size].layout[0] * documentFormats[size].layout[1]) {
        console.warn('Not enough images to fill page');
    }

    let index = 0;
    let imagePkgs = [];
    for(let x = 0; x < documentFormats[size].layout[0]; x++){
        for(let y = 0; y < documentFormats[size].layout[1]; y++) {
            let position = {'x': (documentFormats[size].margins.x + (documentFormats[size].margins.gutterX*x) + (documentFormats[size].images.width*x)), 
                            'y': (documentFormats[size].margins.y + (documentFormats[size].margins.gutterY*y) + documentFormats[size].images.height*y)};
            let dimension = {'x': documentFormats[size].images.width,
                        'y': documentFormats[size].images.height };
            imagePkgs.push([imgs[index], 'PNG', position.x, position.y, dimension.x, dimension.y]);
        }
    }
    return imagePkgs;
}