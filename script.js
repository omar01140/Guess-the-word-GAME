// Setting Game Name
let gameName = "Guess The Word"
let header = document.querySelector("h2")
let footer = document.querySelector("footer")
let message = document.querySelector(".message")
let checkBTN = document.querySelector(".check")
let hintBTN = document.querySelector(".hint")
let NOhints = document.querySelector(".hint span")
let empty , disInputs , NotDisInputs, trueGuess


document.title = gameName
header.innerHTML = gameName;
footer.innerHTML = gameName;

// Setting Game Options
// let trueGuess
let hints = 5;
let numberOFtries = 5;
let currentTry = 1;

NOhints.innerHTML = hints;


// Manage Words
let wordTOguess = ""
let words = ["Impossible", "possible", "Help", "Car", "Master", "Branch", "Main", "Elzero", "Dog"];
wordTOguess = words[Math.floor(Math.random()*words.length)].toLowerCase()
console.log(wordTOguess)


function genrateTries(){
    let tries = document.querySelector(".Tries")
    // create the tries & inputs
    for (let i = 0; i < numberOFtries; i++) {
        let div = document.createElement("div")
        let span = document.createElement("span")
        let spanText = document.createTextNode(`Try ${i+1}`)
        span.appendChild(spanText)
        div.appendChild(span)
        tries.appendChild(div)
        div.classList.add(`try-${i+1}`)
        if (i !== 0) div.classList.add("disabled-inputs");
        
        for (let ii = 0; ii < wordTOguess.length; ii++){
            let input = document.createElement("input")
            input.type = "text";
            input.id = `try-${i+1}-letter-${ii+1}`
            input.setAttribute("maxlength","1")
            div.appendChild(input)
        }
    }

    // display all except the current one
    let disabledInputs  = document.querySelectorAll(".disabled-inputs input")
    disabledInputs.forEach(input => input.disabled = true);
    
    // focus first input
    let inputs = document.querySelectorAll("input")
    inputs[0].focus()
    
    
    // one letter
    inputs.forEach((input, index) =>{

        // focusNext and touppercase
        input.addEventListener(("input"),()=>{
            input.value = input.value.toUpperCase()
            if(inputs[index + 1])inputs[index + 1].focus()
        })

        addMultipleEvents(input, ["input", "keydown"])
        
        //move right and left 
        input.addEventListener(("keydown"),(event)=>{
            if (event.key === "ArrowRight") {
                inputs[index + 1].focus()
            } else if(event.key === "ArrowLeft" && index > 0){
                inputs[index - 1].focus()
            }
        })
    })
}

function addMultipleEvents(element, events) {
        events.forEach(event => element.addEventListener(event, (e)=>{
            if(e.type === 'input' || (e.type === 'keydown' && e.key === 'Backspace')){
                disInputs = document.querySelectorAll("input:not([disabled])")
                empty = Array.from(disInputs).filter((element)=>element.value === "")
                console.log(Array.from(disInputs)[disInputs.length - 1].value)
                console.log(empty)
                if(hints === 0 || empty.length === 0){
                    hintBTN.disabled = true;
                }else if(hints > 0 && empty.length > 0){
                    hintBTN.disabled = false;
                }
            }
        }));
}


checkBTN.addEventListener("click", handleGuesses)
document.addEventListener("keydown", (e)=> (e.key==="Enter") && checkBTN.click())

function handleGuesses(){

    trueGuess = true

    for (let i = 0; i < wordTOguess.length; i++) {

        let input = document.querySelector(`#try-${currentTry}-letter-${i+1}`);
        let letter = input.value.toLowerCase();
        let actualLetter = wordTOguess[i];

        if (actualLetter === letter) {
            input.classList.add("right")
        }else if (wordTOguess.includes(letter) && letter !== "") {
            input.classList.add("wrong-place")
            trueGuess = false
        }else{
            input.classList.add("wrong")
            trueGuess = false
        }
    }


}

document.addEventListener("keydown", handleBackspace)

function handleBackspace(event){
    let inputs = Array.from(document.querySelectorAll("input:not([disabled])"))

    if (event.key === "Backspace" && event.target.value == "") {
        let currentIndex = inputs.indexOf(event.target)
        if(inputs[currentIndex-1] && inputs[currentIndex-1].className !== "right"){
        inputs[currentIndex-1].value = ""
        inputs[currentIndex-1].focus();
        }

        event.preventDefault();

    }else if(event.key === "Backspace" ){
        event.target.value = ""
        console.log(event.target.value)
    }
    disInputs = document.querySelectorAll("input:not([disabled])")
    empty = Array.from(disInputs).filter((element)=>element.value === "")
}

hintBTN.addEventListener("click", handleHints)

function handleHints(){
    if(hints > 0){
        disInputs = document.querySelectorAll("input:not([disabled])")
        empty = Array.from(disInputs).filter((input)=>input.value === "")

        NOhints.innerHTML = --hints;

        if(hints === 0 || empty.length === 1){
            hintBTN.disabled = true;            
        }else if(hints > 0 && empty.length > 0){
            hintBTN.disabled = false;
        }
        if(empty.length){
            let random = empty[Math.floor(Math.random() * empty.length)]
            let randomindex = Array.from(disInputs).indexOf(random)
            random.value = wordTOguess[randomindex].toUpperCase()
            random.classList.add("right")
            random.addEventListener('focus', function(event) {
                event.target.blur();
            })
        }
    }
}

checkBTN.addEventListener("click", handleAnswers)
let i = 1;

function handleAnswers(){

    let trueInpts = document.querySelectorAll(`.try-${i} input.right`)
    let nextTry = document.querySelectorAll(`.try-${i+1} input`)
    NotDisInputs = document.querySelectorAll(`.try-${i} input`)
    
        if (trueGuess) {
        message.innerHTML = `You Win The Word Is <span>${wordTOguess}</span>`;
        checkBTN.disabled = true
        hintBTN.disabled = true
        console.log("disabled from (handleGuesses 1)");
        

        let divs = document.querySelectorAll(".Tries div")
        divs.forEach((div)=>div.classList.add("disabled-inputs")) 

        let inputs = document.querySelectorAll("input")
        inputs.forEach((input)=>input.disabled = true)
    }else{

        for (let i = 0; i < wordTOguess.length; i++) {
            let input = document.querySelector(`#try-${currentTry}-letter-${i+1}`);
            input.disabled = true
        }

        let divs = document.querySelectorAll(".Tries div")
        divs.forEach((div)=>div.classList.add("disabled-inputs"))

        if (currentTry < numberOFtries) {
            
            currentTry++
            
            for (let i = 0; i < wordTOguess.length; i++) {
                let input = document.querySelector(`#try-${currentTry}-letter-${i+1}`);
                input.disabled = false
            }       
            
            let nextDiv = document.querySelector(`.try-${currentTry}`);
            console.log(nextDiv);
            nextDiv.classList.remove("disabled-inputs");


        }else{
            message.innerHTML = `You Lose The Word Is <span>${wordTOguess}</span>`;
            checkBTN.disabled = true
            hintBTN.disabled = true
            console.log("disabled from (handleGuesses 2)");
            
        }
    }

    disInputs = document.querySelectorAll("input:not([disabled])")
    empty = Array.from(disInputs).filter((input)=>input.value === "")
    if(hints === 0 || empty.length === 0){
        hintBTN.disabled = true;
    }else if(hints > 0 && empty.length > 0){
        hintBTN.disabled = false;
    }
    if(!trueGuess){
        trueInpts.forEach(input => {
            let index = Array.from(NotDisInputs).indexOf(input);
            let trueValue = NotDisInputs[index].value
            if(nextTry[index]){
                nextTry[index].value = trueValue
                nextTry[index].classList.add("right")
                nextTry[index].addEventListener('focus', function(event) {
                    event.target.blur();
                })
            }
        });
        let AnextDiv = document.querySelector(`.try-${currentTry}`);
        for (let i = 1; i <= AnextDiv.childElementCount -1; i++) {
            if(AnextDiv.children[i].className === ""){
                AnextDiv.children[i].focus()
                console.log(AnextDiv.children[i].className);
                break;
            }     
        }
        i++
    }
}

window.onload= function () {
    genrateTries();
};