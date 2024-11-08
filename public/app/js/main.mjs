import { switchCropperFormat, destroyCropper, processImageData } from './editor/editor.mjs';
import { processBatch } from "./export/processBatch.mjs";
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
                if(format.size == 'Other') newButton.onclick = (e) => {showToggleElement(e,'ext-formats','body');};
                if(format.ext == false) {
                        document.getElementById('formats').appendChild(newButton);
                        f++;
                }
                if(format.ext == true) {
                        document.getElementById('ext-formats').appendChild(newButton);
                        e++;
                }
                i++;
        });
        document.getElementById("formats").style.setProperty('--noFormats', f);
        document.getElementById("ext-formats").style.setProperty('--noFormats', Math.max(e,6));
        if (e >= 6) {
                document.getElementById("ext-formats").lastChild.style.border = 'none';
        }
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

function showToggleElement (e, target, close) {
        e.stopImmediatePropagation();
        var closeElem;
        if (close = 'body') closeElem = document.body;
        else closeElem = document.getElementById(close);
        document.getElementById(target).classList.remove('hide');
        closeElem.addEventListener('click', () => {
                document.getElementById(target).classList.add('hide');
        }, {once: true});
}

function showEditor() {
        document.body.addEventListener("drop", drop);
        document.getElementById('editor-controls').classList.remove('hide');
        document.getElementById('export-controls').classList.remove('hide');
        document.getElementById('placeholder').classList.remove('hide');
        document.getElementById('editor').classList.remove('hide');
}

function switchLogo() {
        const show = document.querySelector('header .show'),
        hide = document.querySelector('header .hide');
        show.classList.replace('show', 'hide');
        hide.classList.replace('hide', 'show');
        setTimeout(() => {
                window.location.href = '/';
        }, 500);
}

function startLoading() {
        const elem = document.createElement('div');
        elem.innerText = 'Loading...';
        elem.id = 'placeholder';
        elem.classList.add('highlight');
        elem.classList.add('border');

        const existingObject = document.querySelector('object'),
        placeholder = document.querySelector('#placeholder');

        if (existingObject) existingObject.remove();
        if (placeholder) placeholder.remove();
        document.querySelector('main').appendChild(elem);
}

function drag(e) {
        e.stopPropagation();
        e.preventDefault();
}

function drop(e) {
        e.stopPropagation();
        e.preventDefault();

        const dt = e.dataTransfer,
        files = dt.files;

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
document.getElementById('add-all').addEventListener('click', () => {
        startLoading();
        addPage(selectedFormat);
});
document.getElementById('add-one').addEventListener('click', () => {
        startLoading();
        addPhoto(selectedFormat);
});

document.getElementById('settings-btn').addEventListener('click', (e) => {showToggleElement(e,'settings-modal','settings-modal');});

document.addEventListener('readystatechange', event => {
        if (event.target.readyState === "complete") {
                document.body.style.background = 'center / cover no-repeat url(/app/imgs/bg/bg.jpg)';
        }
});

document.addEventListener('click', () => {
        document.getElementById('intro').remove();
},{once: true})