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

let getTestImg = async function (size) {
  let blob = await getImgBlob('/imgs/'+size+'.png');
  let base64 = await blobToBase64(blob);
  return base64;
}

var sizeSelect = prompt('Choose a cut size: (3.5x2, 3.5x5, 4x6, 5x7)');

if(sizeSelect == ''){
  console.error('No size selected');
}

getTestImg(sizeSelect)
.then(base64Image => {
  console.log(sizeSelect.toLowerCase());
  console.log(base64Image);
  const pdf = createDocument([base64Image, base64Image], sizeSelect.toLowerCase());
  let iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '80vh';
  iframe.src = pdf;
  document.getElementById('frameDiv').appendChild(iframe);
});

