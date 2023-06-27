/* Document Format properties
Each format is defined as an object. The name of the object is the format size. If the size needs to be folded, adding an "f" to the end of the name helps denote it and is ignored when displaying it.
desc: string - a description of the size that is displayed as subtext with the size on the sidebar
margins:
        (all numbers)
        x: the margin on the left side of the page (portrait)
        y: the margin on the top of the page (portrait)
        gutterX: the margin in between the photos across the page
        gutterY: the margin in between the photos down the page
images:
        (all numbers)
        width: image print width
        height: image print height
        cutWidth: image cut width
        cutHeight: image cut height
editor:
        (all numbers)
        aspectRatio: the aspect ratio of the editor (width / height)
        width: the width as a percentage of the inner crop box (images.width / images.cutWidth)
        height: the height as a percentage of the inner crop box (images.height / images.cutHeight)
        x: the offset between the left side of the editor and the crop box as a percentage ((images.width - images.cutWidth) / images.width / 2 * 100)
        y: the offset between the top of the editor and the crop box as a percentage ((images.height - images.cutHeight) / images.height / 2 * 100)
layout: the amount of images to put on the page in each dimension
disableWatermark: removes top strip and text instructions on the side of the page
*/

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
        },        
        '8x10': {
                desc: "Photo",
                margins: {
                        x: 0.25,
                        y: 0.5,
                },
                images: {
                        width: 8,
                        height: 10,
                        cutWidth: 8,
                        cutHeight: 10,
                },
                'editor': {
                        aspectRatio: 0.8,
                        width: 100,
                        height: 100,
                        x: 0,
                        y: 0
                },
                layout: { x: 1, y: 1 },
                disableWatermark: true
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