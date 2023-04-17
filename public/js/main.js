const doc = new jspdf.jsPDF({
    orientation: "portrait",
    unit: "in",
    format: [8.5, 11]
});

//Make calibration strip
doc.rect(0.5,0.0625,1,0.125,'F');

//Document watermark
doc.setFontSize(12);
doc.text("Peter's Cut-Erator", 0.25, 1, {'angle': 270});

//Add business card (with bleed)
doc.rect(0.375,0.1875,3.75,2.125,'F');

doc.save('test.pdf');