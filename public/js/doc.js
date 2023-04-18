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
            'x':1,
            'y':1.125,
            'gutterX': 0,
            'gutterY': 1.25
        },
        'images': {
            'width': 6.5,
            'height': 4.25
        },
        'layout': [1,2]
    },
    '5x7': {
        'margins': {
            'x':0.5,
            'y':0.125,
            'gutterX': 0,
            'gutterY': 0.25
        },
        'images': {
            'width': 7.5,
            'height': 5.25
        },
        'layout': [1,2]
    }
};

function createDocument(size, imgs) {
    const doc = new jspdf.jsPDF({
        orientation: "portrait",
        unit: "in",
        format: [8.5, 11]
    });
    
    doc.rect(0.5,0.0625,1,0.125,'F'); //Cutter calibration strip
    
    doc.setFontSize(12);
    doc.text('Cut-Erator - Use actual size and 8.5" x 11" (Letter) paper', 0.25, 3, {'angle': 270});

    addImages(imgs);
    
    return(doc.output('datauristring'));
}

function addImages(imgs) {
    let index = 0;
    for(let x = 0; x < documentFormats[size].layout[0]; x++){
        for(let y = 0; y < documentFormats[size].layout[1]; y++) {
            let position = {'x': (documentFormats[size].margins.x + (documentFormats[size].margins.gutterX*x) + (documentFormats[size].images.width*x)), 
                            'y': (documentFormats[size].margins.y + (documentFormats[size].margins.gutterY*y) + documentFormats[size].images.height*y)};
            let size = {'x': documentFormats[size].images.width,
                        'y': documentFormats[size].images.height };
            doc.addImage(imgs[index], 'PNG', position.x, position.y, size.x, size.y);
        }
    }
}