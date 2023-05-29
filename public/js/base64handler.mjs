export function checkRotation(data, format) {
        return new Promise((res) => {
            let img = new Image();
            img.src = data;
            img.onload = () => {
                let toRotate = false;
                if(img.width > img.height && ['3.5x5','3.5x5f','10x7f'].indexOf(format) != -1) {
                    toRotate = true;
                }
                if(img.width < img.height && ['3.5x2','3.5x2.5','4x6','5x7'].indexOf(format) != -1) {
                    toRotate = true;
                }
                if (toRotate == true) {
                        res(rotate(data));
                }
                else {
                        res(data);
                }
            }
        });
}

export const isBase64UrlImage = (base64String) => {
        let image = new Image()
        return new Promise((res, rej)=>{
                image.onload = function () {
                if (image.height === 0 || image.width === 0) {
                        rej('0px height or width');
                        return;
                }
                res(true);
                }
                image.onerror = () =>{
                        rej('image load err');
                }
                image.src = base64String;
        });        
}
    
function rotate(data) {
        return new Promise((res) => {
                let img = new Image();
                img.src = data;
                img.onload = () => {
                let offScreenCanvas = document.createElement('canvas'),
                offScreenCanvasCtx = offScreenCanvas.getContext('2d');
                offScreenCanvas.height = img.width;
                offScreenCanvas.width = img.height;
                offScreenCanvasCtx.rotate(90 * Math.PI / 180);
                offScreenCanvasCtx.translate(0, -offScreenCanvas.width);
                offScreenCanvasCtx.drawImage(img, 0, 0); 
    
                res(offScreenCanvas.toDataURL('image/jpeg',100));
            }
        });
}