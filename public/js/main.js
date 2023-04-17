const documentFormats = {
    'business_card': {
        'margins': {
            'x':0.375,
            'y':0.1875,
            'gutter': 0.25
        },
        'images': {
            'width': 3.75,
            'height': 2.125
        },
        'layout': [2,5]
    }
}

const doc = new jspdf.jsPDF({
    orientation: "portrait",
    unit: "in",
    format: [8.5, 11]
});

//Make calibration strip
doc.rect(0.5,0.0625,1,0.125,'F');

//Document watermark
doc.setFontSize(12);
doc.text("Peter's Cut-Erator", 0.25, 4, {'angle': 270});

//Add business card (with bleed)
doc.setDrawColor(15,100,100,0);
doc.rect(documentFormats.business_card.margins.x,documentFormats.business_card.margins.y,documentFormats.business_card.images.width,documentFormats.business_card.images.height,'F');

doc.save('test.pdf');