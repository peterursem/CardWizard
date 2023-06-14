export const documentFormats = {
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
                        cutHeight: 2,
                },
                editor: {
                        aspectRatio: 1.7647058823529411,
                        width: 93.33333333333333,
                        height: 94.11764705882352,
                        x: 3.3333333333333335,
                        y: 2.941176470588235
                },
                layout: { x: 2, y: 5 }
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
                editor: {
                        aspectRatio: 1.4285714285714286,
                        width: 93.33333333333333,
                        height: 95.23809523809523,
                        x: 3.3333333333333335,
                        y: 2.380952380952381
                },
                layout: { x: 2, y: 4 }
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
                        cutHeight: 5,
                },
                'editor': {
                        aspectRatio: 0.7142857142857143,
                        width: 93.33333333333333,
                        height: 95.23809523809523,
                        x: 3.3333333333333335,
                        y: 2.380952380952381
                },
                layout: { x: 2, y: 2 }
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
                        cutHeight: 5,
                },
                'editor': {
                        aspectRatio: 0.7142857142857143,
                        width: 93.33333333333333,
                        height: 95.23809523809523,
                        x: 3.3333333333333335,
                        y: 2.380952380952381
                },
                layout: { x: 2, y: 2 }
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
                        cutHeight: 4,
                },
                'editor': {
                        aspectRatio: 1.4705882352941178,
                        width: 96,
                        height: 94.11764705882352,
                        x: 2,
                        y: 2.941176470588235
                },
                layout: { x: 1, y: 2 }
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
                        cutHeight: 5,
                },
                'editor': {
                        aspectRatio: 1.380952380952381,
                        width: 96.55172413793103,
                        height: 95.23809523809523,
                        x: 1.7241379310344827,
                        y: 2.380952380952381
                },
                layout: { x: 1, y: 2 }
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
                        cutHeight: 10,
                },
                'editor': {
                        aspectRatio: 0.7073170731707317,
                        width: 96.55172413793103,
                        height: 97.5609756097561,
                        x: 1.7241379310344827,
                        y: 1.2195121951219512
                },
                layout: { x: 1, y: 1 }
        }
};

export const getPossibleFormats = function () {
        return new Promise(resolve => {
                let formats = [];
                for (let format of Object.keys(documentFormats)) {
                        formats.push({ size: format, desc: documentFormats[format].desc, example: "/imgs/ex/" + format + ".png" });
                }
                resolve(formats);
        });
};