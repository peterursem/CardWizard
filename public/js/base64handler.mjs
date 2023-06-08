export function checkRotation(img, format, retType) {
        let now = new Date(Date.now());
        return new Promise(async (res) => {
                let toRotate = false;
                if(img.width > img.height && ['3.5x5','3.5x5f','10x7f'].indexOf(format) != -1) {
                    toRotate = true;
                }
                if(img.width < img.height && ['3.5x2','3.5x2.5','4x6','5x7'].indexOf(format) != -1) {
                    toRotate = true;
                }
                
                if (toRotate == true) {
                        rotate(img, retType)
                        .then((rotated) => {
                                console.info('Rotation done in: ' + (Date.now() - now) + 'ms.');    
                                res(rotated);
                                return;
                        });
                        return;
                }

                switch (retType) {
                        case 'dataURL':
                                console.info('No rotation needed. Done in: ' + (Date.now() - now) + 'ms.');
                                res(img.src);
                                break;
                        case 'canvas':
                                let canvas = new OffscreenCanvas(img.width, img.height),
                                ctx = canvas.getContext('2d');
                                ctx.drawImage(img, 0, 0);
                                console.info('No rotation needed. Done in: ' + (Date.now() - now) + 'ms.');
                                res(canvas);
                                break;
                }
        });
}

export const isBase64UrlImage = (base64String) => {
        console.log(base64String);
        let image = new Image()
        return new Promise((res, rej)=>{
                image.onload = function () {
                        if (image.height === 0 || image.width === 0) {
                                rej('0px height or width');
                                return;
                        }
                        res(image);
                }
                image.onerror = () =>{
                        rej('image load err');
                }
                image.src = base64String;
        });        
}

export const blobToBase64 = (blob) => {
        return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
        });
}
    
function rotate(img, retType) {
        return new Promise((res) => {
                let canvas = new OffscreenCanvas(img.height, img.width),
                ctx = canvas.getContext('2d');
                ctx.rotate(90 * Math.PI / 180);
                ctx.translate(0, -canvas.width);
                ctx.drawImage(img, 0, 0); 
    
                switch (retType) {
                        case 'dataURL':
                                canvas.convertToBlob({type: 'image/jpeg', quality: 1})
                                .then(async (blob) => {
                                        res(await blobToBase64(blob));
                                });
                                break;
                        case 'canvas':
                                res(canvas);
                                break;
                }
        });
}