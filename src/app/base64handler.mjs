function isBase64Image (base64String) {
        let img = new Image()
        return new Promise((res, rej) => {
                img.onload = function () {
                        if (img.height === 0 || img.width === 0) {
                                rej('0px height or width');
                                return;
                        }
                        res(img);
                }
                img.onerror = () =>{
                        rej('image load err');
                }
                img.src = base64String;
        });        
}

function canvasToBase64 (canvas) {
        return new Promise(async res => {
                canvas.convertToBlob({type: 'image/png', quality: 1})
                .then(blob => {
                        blobToBase64(blob)
                        .then(data => res(data));
                });
                
        });
}
    
function createCanvas(img,rotate) {
        return new Promise(res => {
                let canvas;
                if (rotate==true) {
                        canvas = new OffscreenCanvas(img.height, img.width);
                        let ctx = canvas.getContext('2d');
                        ctx.rotate(90 * Math.PI / 180);
                        ctx.translate(0, -canvas.width);
                }
                else canvas = new OffscreenCanvas(img.width, img.height);

                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0); 
    
                res(canvas);
        });
}

export const blobToBase64 = (blob) => {
        return new Promise(res => {
                const reader = new FileReader();
                reader.onloadend = () => res(reader.result);
                reader.readAsDataURL(blob);
        });
};

export const validateBase64Img = (base64,format) => {
        return new Promise(async (res) => {
                isBase64Image(base64)
                .then(img => {
                        if ((img.height > img.width && format == 'landscape') || (img.height < img.width && format == 'portrait')) {
                                createCanvas(img, true)
                                .then(canvas => {
                                        canvasToBase64(canvas)
                                        .then(result => res({'canvas': canvas, 'base64': result}));
                                });
                        }
                        else {
                                createCanvas(img, false)
                                .then(canvas => {
                                        res({'canvas': canvas, 'base64': img.src});
                                });
                        }
                });
        });
};