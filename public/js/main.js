let size = prompt('Choose a cut size: (3.5x2, 3.5x5, 4x6, 5x7)');

let imgString = getTestImg(size);

function getTestImg(size) {
    getImgBlob(url('/imgs/'+size+'.png'));
}

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