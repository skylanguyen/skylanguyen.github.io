let triviaBtn = document.querySelector("#js-new-quote").addEventListener('click', newTrivia);

let answerBtn = document.querySelector('#js-tweet').addEventListener('click', newAnswer);

let current = {
    question: "",
    answer: "",
}

const endpoint = "https://trivia.cyberwisp.com/getrandomchristmasquestion";
const dogPics= 'https://dog.ceo/api/breeds/image/random';

async function newTrivia() {
    //console.log("Success");

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw Error(response.statusText);
        }

        const json = await response.json();
        console.log(json);

        displayTrivia(json["question"]);
        current.question = json["question"];
        current.answer = json["answer"];
        console.log(current.question);
        console.log(current.answer);

        displayDogImage();

    } catch (err) {
        console.log(err);
        alert('Failed to get new trivia');
    }
}

function displayTrivia(question) {
    const questionText = document.querySelector('#js-quote-text');
    const answerText = document.querySelector('#js-answer-text');
    questionText.textContent = question;
    answerText.textContent = "";
}

function newAnswer() {
    //console.log("Success == answer!");
    const answerText = document.querySelector('#js-answer-text');
    answerText.textContent = current.answer;
}

async function displayDogImage(){
    const imageElement = document.querySelector('#js-dog-pic');

    try{
        const response = await fetch(dogPics);
        const data = await response.json();
        imageElement.src = data.message;
    } catch (err){
        console.log(err);
    }
    }

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

newTrivia();