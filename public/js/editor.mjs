var canvas = document.getElementById("editor"),
    ctx = canvas.getContext("2d");

var mouse = {
    startX: 0,
    startY: 0,
    isDown: false
}

var imgData = {
    x: 50,
    y: 50,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    dragging: false
}

const anchorRadius = 5,
      anchorArea = anchorRadius^2;
var draggingAnchor = -1;

let currentImg;
export function createCanvas(newSrc) {
    canvas.style.aspectRatio = 3/2;
    var img = new Image();
    img.onload = () => {
        imgData.width = img.width;
        imgData.height = img.height;
        imgData.right = imgData.x + img.width;
        imgData.bottom = imgData.y + img.height;
        currentImg = img;
        draw(img, true, false);
    }
    img.src = newSrc;
}

function draw(img, withAnchors, withBorders) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img, imgData.x, imgData.y, imgData.width, imgData.height);

    if (withAnchors) {
        drawAnchor(imgData.x, imgData.y);
        drawAnchor(imgData.right, imgData.y);
        drawAnchor(imgData.right, imgData.bottom);
        drawAnchor(imgData.x, imgData.bottom);
    }
    if (withBorders) {
        ctx.beginPath();
        ctx.moveTo(imgData.x, imgData.y);
        ctx.lineTo(imgData.right, imgData.y);
        ctx.lineTo(imgData.right, imgData.bottom);
        ctx.lineTo(imgData.x, imgData.bottom);
        ctx.closePath();
        ctx.stroke();
    }
}

function drawAnchor(x,y) {
    ctx.beginPath();
    ctx.arc(x,y,anchorRadius,0,2*Math.PI,false);
    ctx.closePath();
    ctx.fill();
}

function hitAnchor(x, y) {
    var dx, dy;

    dx = x - imgData.x;
    dy = y - imgData.y;
    if (dx * dx + dy * dy <= anchorArea) {
        return (0);
    }

    dx = x - imgData.right;
    dy = y - imgData.y;
    if (dx * dx + dy * dy <= anchorArea) {
        return (1);
    }

    dx = x - imgData.right;
    dy = y - imgData.bottom;
    if (dx * dx + dy * dy <= anchorArea) {
        return (2);
    }

    dx = x - imgData.x;
    dy = y - imgData.bottom;
    if (dx * dx + dy * dy <= anchorArea) {
        return (3);
    }

    return (-1);
}

function hitImage(x, y) {
    return (x > imgData.x && x < imgData.right && y > imgData.y && y < imgData.bottom);
}

function getCursorPos(e) {
    const rect = canvas.getBoundingClientRect(),
          scaleX = canvas.width / rect.width,
	      scaleY = canvas.height / rect.height;    
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
}

canvas.onmousedown = (e) => {
    const click = getCursorPos(e);
    mouse.startX = click.x;
    mouse.startY = click.y;
    draggingAnchor = hitAnchor(click.x, click.y);
    imgData.dragging = draggingAnchor < 0 && hitImage(click.x,click.y);
};

function handleMouseUp(e) {
    draggingAnchor = -1;
    imgData.dragging = false;
    draw(currentImg, true, false);
}

canvas.onmouseout = (e) => {
    handleMouseUp(e);
}

canvas.onmouseup = (e) => {
    handleMouseUp(e);
}

canvas.onmousemove = (e) => {
    const click = getCursorPos(e);
    if (draggingAnchor > -1) {
        switch (draggingAnchor) {
            case 0:
                imgData.x = click.x;
                imgData.width = imgData.right - click.x;
                imgData.y = click.y;
                imgData.height = imgData.bottom - click.y;
                break;
            case 1:
                imgData.y = click.y;
                imgData.width = click.x - imgData.x;
                imgData.height = imgData.bottom - click.y;
                break;
            case 2:
                imgData.width = click.x - imgData.x;
                imgData.height = click.y - imgData.y;
                break;
            case 3:
                imgData.x = click.x;
                imgData.width = imgData.right - click.x;
                imgData.height = click.y - imgData.y;
                break;
        }

        if(imgData.width<25){imgData.width=25;}
        if(imgData.height<25){imgData.height=25;}

        imgData.right = imgData.x + imgData.width;
        imgData.bottom = imgData.y + imgData.height;

        draw(currentImg ,false, true);

    } 
    else if (imgData.dragging) {
        const dx = click.x - mouse.startX,
              dy = click.y - mouse.startY;
              
        imgData.x += dx;
        imgData.y += dy;
        imgData.right += dx;
        imgData.bottom += dy;

        mouse.startX = click.x;
        mouse.startY = click.y;

        draw(currentImg, false, true);
    }
}
