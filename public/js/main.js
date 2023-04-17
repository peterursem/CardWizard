const doc = new jspdf.jsPDF({
    orientation: "portrait",
    unit: "in",
    format: [8.5, 11]
});

//Make calibration strip
doc.rectangle(0.5,0.0625,1,0.125);

//Document watermark
doc.setFontSize(12);
doc.text("Peter's Cut-Erator", 0.25, 1, {'angle': 270});

//Add business card (with bleed)
doc.rectangle(0.375,0.1875,3.75,2.125);

doc.save('test.pdf');