let imageInput = document.getElementById('imageInput');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let currentImage;
let currentMask = 'square';
let currentOperation = 'crop'; 


imageInput.addEventListener('change', function() {
    let file = imageInput.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let img = new Image();
            img.onload = function() {
                addToGallery(img.src);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});


function addToGallery(src) {
    let img = new Image();
    img.src = src;
    img.onclick = function() {
        selectImage(img.src);
    };
    document.querySelector('.image-gallery').appendChild(img);
}


function selectImage(src) {
    let img = new Image();
    img.src = src;
    img.onload = function() {
        displayImageEditor(img);
    };
}


function displayImageEditor(img) {
    currentImage = img;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}


function setMask(mask) {
    currentMask = mask;
}


document.getElementById('rotateButton').addEventListener('click', function() {
    rotateImage();
});

document.getElementById('flipButton').addEventListener('click', function() {
    flipImage();
});

document.getElementById('applyButton').addEventListener('click', function() {
    applyOperation(currentOperation);
});

document.getElementById('toggleOptionsButton').addEventListener('click', function() {
    let Crop = document.getElementById('moreOptions');
    Crop.classList.toggle('hidden');
});


function applyOperation(operation) {
    switch (operation) {
        case 'crop':
            applyMask();
            break;
        default:
            break;
    }
}


function applyMask() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    switch (currentMask) {
        case 'square':
            ctx.rect(0, 0, canvas.width, canvas.height);
            break;
        case 'circle':
            ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, 0, Math.PI * 2);
            break;
        case 'heart':
            drawHeart();
            break;
        case 'rectangle':
            ctx.rect(0, 0, canvas.width, canvas.height / 2);
            break;
        default:
            break;
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}


function drawHeart() {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let width = canvas.width * 0.5;
    let height = canvas.height * 0.5;
    ctx.moveTo(centerX, centerY + height / 4);
    ctx.bezierCurveTo(centerX + width / 2, centerY - height / 4, centerX + width / 4, centerY - height, centerX, centerY - height / 2);
    ctx.bezierCurveTo(centerX - width / 4, centerY - height, centerX - width / 2, centerY - height / 4, centerX, centerY + height / 4);
}

function rotateImage() {
    canvas.width = currentImage.height;
    canvas.height = currentImage.width;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(currentImage, -currentImage.width / 2, -currentImage.height / 2);
    ctx.restore();
}


function flipImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(currentImage, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();
}
