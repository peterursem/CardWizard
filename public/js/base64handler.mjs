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

export const autoCrop = (data, aspectRatio) => {
        return new Promise((resolve) => {
            const img = new Image();
    
            img.onload = () => {
                const ogWidth = img.naturalWidth,
                ogHeight = img.naturalHeight,
                ogAspect = ogWidth / ogHeight;
    
                let newWidth = ogWidth,
                newHeight = ogHeight;
                if (ogAspect > aspectRatio) {
                    newWidth = ogHeight * aspectRatio;
                } else if (ogAspect < aspectRatio) {
                    newHeight = ogWidth / aspectRatio;
                }
    
                const outputX = (newWidth - ogWidth) * 0.5,
                outputY = (newHeight - ogHeight) * 0.5,
                newImg = document.createElement('canvas');
    
                newImg.width = newWidth;
                newImg.height = newHeight;
    
                const ctx = newImg.getContext('2d');
                ctx.drawImage(img, outputX, outputY);
                resolve(newImg.toDataURL('image/jpeg',100));
            };
    
            img.src = data;
        });
}

export const isBase64UrlImage = async (base64String) => {
        let image = new Image()
        image.src = base64String
        return await (new Promise((resolve)=>{
          image.onload = function () {
            if (image.height === 0 || image.width === 0) {
              resolve(false);
              return;
            }
            resolve(true)
          }
          image.onerror = () =>{
            resolve(false)
          }
        }));
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