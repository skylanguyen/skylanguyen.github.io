const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

var menu_shown = false;

function showMenu(){
    var shown = navMenu.classList.toggle("show");
    navMenu.classList.toggle("hide");

    if(shown){
        navToggle.setAttribute("aria-expanded","true");
        navToggle.classList.add("open");
    
    } 
    else{
        navToggle.setAttribute ("aria-expanded", "false");
        navToggle.classList.remove("open");
    }
}

navToggle.addEventListener('click', showMenu);


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


let touchStartX = 0;
let touchEndX = 0;

function processSwipe(){
    if( touchEndX < touchStartX -50){
        showNextImage();
    }

    if(touchEndX > touchStartX +50){
        showPrevImage();
    }

}

lightbox.addEventListener('touchstart', e =>{
    touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener('touchend', e =>{
    touchEndX = e.changedTouches[0].screenX;
    processSwipe();
});
});
});



const store = {
    key: 'mahjongData',
    days: 20,

    save(k, v){
        if(!localStorage.getItem('consent')) return;
        const d = JSON.parse(localStorage.getItem(this.key) || '{}');
        d[k] = {v, t: Date.now()};
        localStorage.setItem(this.key, JSON.stringify(d));
    },

    get(k) {
        if(!localStorage.getItem('consent')) return null;
        const d = JSON.parse(localStorage.getItem(this.key) || '{}');
        const item = d[k];
        if(!item|| Date.now() - item.t > this.days *86400000) return null;
        return item.v;
    },


    clear(){
        localStorage.removeItem(this.key);
    }

};

const banner = document.getElementById('consent');
const consent = localStorage.getItem('consent');

if(!consent) banner.style.display = 'block';

document.getElementById('accept')?.addEventListener('click', () => {
    localStorage.setItem('consent', '1');
    banner.style.display='none';
    const theme= store.get('theme');
    if(theme) document.body.className = theme;
});


document.getElementById('decline')?.addEventListener('click',() =>{
    localStorage.setItem('consent','0');
    banner.style.display = 'none';
});

document.getElementById('theme')?.addEventListener('click', () =>{
    const theme =document.body.className === 'dark' ? 'light' : 'dark';
    document.body.className = theme;
    store.save('theme', theme);
})

document.getElementById('clear')?.addEventListener('click',() => {
    if(confirm('Clear all data?')){
        store.clear();
        localStorage.removeItem('consent');
        alert('Data cleared');
        banner.style.display='block';
    }
});


if(consent === '1'){
    const theme = store.get('theme');
    if(theme) document.body.className = theme;
}
