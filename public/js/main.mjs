import { createDocument } from './doc.mjs';

let getImgBlob = function(url){
    return new Promise( async resolve => {
      let resposne = await fetch( url );
      let blob = resposne.blob();
      resolve( blob );
    });
  };
  
let blobToBase64 = function(blob) {
    return new Promise( resolve => {
      let reader = new FileReader();
      reader.onload = function() {
        let dataUrl = reader.result;
        resolve(dataUrl);
      };
      reader.readAsDataURL(blob);
    });
}

function getTestImg(size) {
  let blob = await getImgBlob(url('/imgs/'+size+'.png'))
  let base64 = await blobToBase64(blob);
  return base64;
}

let size = prompt('Choose a cut size: (3.5x2, 3.5x5, 4x6, 5x7)');

let imgString = await getTestImg(size);

console.log(createDocument(size, [imgString, imgString]));