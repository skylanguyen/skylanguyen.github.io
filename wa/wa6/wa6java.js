document.addEventListener("DOMContentLoaded", function() { //wait to load html before running js
    //where to reference for each element
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const thumbnails = document.querySelectorAll('.gallery-thumb');

    let currentIndex = -1;

    //open lightbox which specific image
    const openLightbox = (index) =>{
        const img=thumbnails[index];
        lightbox.classList.add('active');
        lightboxImg.src=img.src;
        lightboxImg.alt=img.alt;
        currentIndex=index;
    }

    //close lightbox
    const closeLightbox=() =>{
       lightbox.classList.remove('active');
        lightboxImg.src='';
        lightboxImg.alt='';
        currentIndex=-1; 
    }

    //next and previous images
    const showNextImage = () => {
        if (currentIndex < thumbnails.length-1){
            openLightbox(currentIndex +1);
        }
    };

    const showPrevImage = () => {
        if(currentIndex>0){
            openLightbox(currentIndex-1);
        }
    }

    //event listeners for click
    thumbnails.forEach((img,index)=> {
        img.addEventListener('click',() => {
            openLightbox(index);
        });
    });

    closeBtn.addEventListener('click',() => { //deactivate the lightbox when button is clicked
        closeLightbox();
    });

    lightbox.addEventListener('click',(event) =>{ //if you click on the lightbox, deactivate it
        if(event.target === lightbox){
            closeLightbox();
        }
    });


//event listeners for keys
document.addEventListener('keydown',(event) => {
    if(!lightbox.classList.contains('active')) return;

    switch(event.key){
        case 'ArrowRight':
            showNextImage();
            break;
        case 'ArrowLeft':
            showPrevImage();
            break;
        case 'Escape':
            closeLightbox();
            break;
    }



});
});

let btn = document.querySelector('#theme').addEventListener('click', theme);

    function theme(){
        const inTheme = localStorage.getItem('userTheme' || 'light');
        setTheme(inTheme);
    }

    // Save user's theme choice
function setTheme(inTheme) {
    let theme;
    if (inTheme == 'dark'){
        theme='light';
    } 
    else{
        theme='dark';
    }

    localStorage.setItem('userTheme', theme);
    document.body.className = theme;
}

// Load saved theme on page load
window.addEventListener('load', function() {
    const savedTheme = localStorage.getItem('userTheme') || 'light';
    document.body.className = savedTheme;
});