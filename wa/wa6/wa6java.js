document.addEventListener("DOMContentLoaded", function() { //wait to load html before running js
    //where to reference for each element
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const thumbnails = document.querySelectorAll('.gallery-thumb');

    thumbnails.forEach(img=> { //when click, change status to activate the lightbox
        img.addEventListener('click',() => {
            lightbox.classList.add('active');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
        });
    });

    closeBtn.addEventListener('click',() => { //deactivate the lightbox when button is clicked
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click',(event) =>{ //if you click on the lightbox, deactivate it
        if(event.target === lightbox){
            lightbox.classList.remove('active');
        }
    });

});