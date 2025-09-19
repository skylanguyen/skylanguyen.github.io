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