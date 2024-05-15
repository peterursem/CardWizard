import { switchCropperFormat, destroyCropper, processImageData } from './editor/editor.mjs';
import processBatch from "./export/processBatch.mjs";
import { clearPages, addPage, addPhoto } from './export/export.mjs';
import { getCutterFormats } from "./export/documentFormats.mjs";
import { fileToBase64 } from './filehandler.mjs';

getCutterFormats()
.then(formats => {
        let i =0,
        f = 0,
        e = 0;
        formats.forEach(format => {
                let newButton = document.createElement('button');
                newButton.id = format.size;
                newButton.innerHTML = '<h1>' + format.size.replace('f', '') + '</h1> <a>' + format.desc + '</a> <img src="' + format.example + '">';
                if(format.size != 'Other') newButton.onclick = () => {formatSelected(format.size);};
                if(format.size == 'Other') newButton.onclick = (e) => {showExtFormats(e);};
                if(format.ext == false) {
                        document.getElementById('formats').appendChild(newButton);
                        f++;
                }
                if(format.ext == true) {
                        document.getElementById('extFormats').appendChild(newButton);
                        e++;
                }
                i++;
        });
        document.getElementById("formats").style.setProperty('--noFormats', f);
        document.getElementById("extFormats").style.setProperty('--noFormats', e);
});

var selectedFormat = '';
function formatSelected(format) {
        if (selectedFormat == format) return;

        clearPages();

        const existingSelection = document.querySelector('.selected');
        if (existingSelection) existingSelection.classList.remove('selected');
        document.getElementById(format).classList.add('selected');

        //If cropper already exists
        if (document.querySelector('.cropper-canvas')) destroyCropper();

        const existingImg = document.querySelector('#editor img');
        if(existingImg) existingImg.remove();
        
        switchCropperFormat(format);

        if (selectedFormat == '') showEditor();
        selectedFormat = format;

        gtag('event', 'format_changed', {
                'format': format
        });
}

function showExtFormats (e) {
        e.stopImmediatePropagation();
        document.getElementById('extFormats').classList.remove('hide');
        document.body.addEventListener('click', () => {
                console.log('hiding');
                document.getElementById('extFormats').classList.add('hide');
        }, {once: true});
}

function showEditor() {
        document.getElementById('overlay').remove();
        document.body.addEventListener("drop", drop);
        document.getElementById('editorControls').classList.remove('hide');
        document.getElementById('exportControls').classList.remove('hide');
        document.getElementById('placeHolder').classList.remove('hide');
        document.getElementById('editor').classList.remove('hide');
}

function switchLogo() {
        const show = document.querySelector('header .show'),
        hide = document.querySelector('header .hide');
        show.classList.replace('show', 'hide');
        hide.classList.replace('hide', 'show');
}

function startLoading() {
        let elem = document.createElement('div');
        elem.innerText = 'Loading...';
        elem.id = 'placeHolder';
        elem.classList.add('highlightBorder');

        const existingObject = document.querySelector('object'),
        placeHolder = document.querySelector('#placeHolder');

        if (existingObject) existingObject.remove();
        if (placeHolder) placeHolder.remove();
        document.querySelector('main').appendChild(elem);
}

function drag(e) {
        e.stopPropagation();
        e.preventDefault();
}

function drop(e) {
        e.stopPropagation();
        e.preventDefault();

        const dt = e.dataTransfer;
        var files = dt.files;

        if (files.length == 1) {
                fileToBase64(files[0])
                .then(data => processImageData(data, selectedFormat));
                gtag('event', 'single_file_uploaded');
        }
        else if (files.length > 1) {
                startLoading();
                processBatch(files, selectedFormat);
                gtag('event', 'batch_files_uploaded');
        }
}

document.body.addEventListener("dragenter", drag);
document.body.addEventListener("dragover", drag);
document.querySelector('header').addEventListener("click", switchLogo);
document.body.ondrop = e => {
        e.stopPropagation();
        e.preventDefault();
};
document.getElementById('addAll').addEventListener('click', () => {
        startLoading();
        addPage(selectedFormat);
});
document.getElementById('addOne').addEventListener('click', () => {
        startLoading();
        addPhoto(selectedFormat);
});

document.addEventListener('readystatechange', event => {
        if (event.target.readyState === "complete") {
                document.body.style.backgroundImage = 'url(/app/imgs/bg/bg.jpg)';
        }
});