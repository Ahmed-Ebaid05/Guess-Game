// Header 

let title = document.querySelector("h1");
title.innerHTML = "Guess The Word";
let levels = document.querySelector("ul");
let toggoleMenu = document.querySelector(".icon i");

// Inputs 

let Windex = localStorage.getItem("level") || 0 ; 
let words = ["Tree", "Book", "Fish", "Bird", "Apple", "House", "Chair", "Planet", "School", "Bridge", "Teacher", "Village", "Winter", "Elephant", "Mountain", "Football", "Adventure", "Happiness", "Dictionary", "Technology"];
let word = words[Windex];
word = word.toUpperCase();
let descriptions = ["A tall plant with leaves", 
    "A set of written pages", 
    "An animal that lives in water",
    "An animal that can fly", 
    "A round fruit that is red or green", 
    "A place where people live", 
    "A seat with four legs", 
    "A large body in space", 
    "A place for learning", 
    "A structure to cross over water", 
    "A person who helps students",
    "A small group of houses", 
    "The coldest season", 
    "A very large animal with a trunk", 
    "A very high hill", 
    "A popular sport with a ball", 
    "An exciting journey", 
    "The feeling of joy", 
    "A book of word meanings", 
    "The use of science in life"
];

let descriptionDiv = document.querySelector(".description");
let description = document.querySelector(".description p")
description.innerHTML = descriptions[Windex];
let alertSpan = document.querySelector(".description span");

let inputsDiv = document.querySelector(".inputs");
let checkBtn = document.querySelector(".check");
let hintBtn = document.querySelector(".hint");
let winning = document.querySelector(".winning");
let noOfHints = 2;
document.querySelector(".hint span").innerHTML = noOfHints + " Hints";
let nextBtn = document.querySelector(".next");
let lastLevelDiv = document.querySelector(".last-level");
let playAgain = document.querySelector(".again");


for ( let i = 0 ; i < words.length ; i++) {
    let li = document.createElement("li");
    li.innerHTML = `Level ${i + 1}`;
    if (Number(localStorage.getItem("lastLevel")) < i)
        li.classList.add("disabled");
    else
        li.classList.add("played");
    levels.append(li);
}

let lis = Array.from(document.querySelectorAll("header ul li"));

toggoleMenu.addEventListener("click", function() {
    if ( levels.classList.contains("active")) 
        levels.classList.remove("active");
    else 
        levels.classList.add("active");
})

for ( let i = 1; i <= word.length; i++ ) {
    let input = document.createElement("input");
    input.setAttribute("maxlength", "1")
    input.classList.add(`letter-${i}`);
    inputsDiv.append(input);
}

// Handling Contorls
let inputs = Array.from(document.querySelectorAll("input"));

inputs.forEach((input, index) => {
    input.addEventListener("input", function() {
        alertSpan.innerHTML = "";
        input.value = input.value.toUpperCase();
        if ( input.value.length === 1 && index < word.length-1) {
            for ( let i = index + 1; i < word.length; i ++) {
                if (inputs[i].disabled) 
                    continue;
                else {
                    inputs[i].focus();
                    break;
                }
            }
        } 
    })

    input.addEventListener("keydown", function(e) {
        alertSpan.innerHTML = "";
        if ( e.key === "Backspace" ) {
    // always clear current box first
    inputs[index].value = "";
    inputs[index].classList.remove("wrong", "not-in-place", "correct");

    if (index > 0) {
        for (let i = index - 1 ; i >= 0; i--) {
            inputs[i].classList.remove("wrong", "not-in-place");
            if (inputs[i].disabled) 
                continue;
            inputs[i].focus();
            break;
        }
    }
}

    })

    input.addEventListener("keydown", function(e) { 
        if ( e.key === "ArrowLeft" && index > 0) {
            for ( let i = index - 1; i > 0; i --) {
                if (inputs[i].disabled) 
                    continue;
                else {
                    inputs[i].focus();
                    break;
                }
            }    
        }
    })

    input.addEventListener("keydown", function(e) { 
        if ( e.key === "ArrowRight" && index < word.length - 1) {
            for ( let i = index + 1; i< word.length; i ++) {
                if (inputs[i].disabled) 
                    continue;
                else {
                    inputs[i].focus();
                    break;
                }
            }    
        }
    })
})

// Handle Results

checkBtn.addEventListener("click", Checking)
document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") 
        Checking();
})

function Checking () {
    if (Array.from(inputs).every(input => input.value.trim() !== "") ) {
        inputs.forEach((input, index) => {
            if (input.value === word[index]) {
                input.classList.add("correct");
                input.disabled = true;
            } else if (word.includes(input.value)) {
                input.classList.add("not-in-place");
                for (let i = 0; i < index; i++) {
                    if (Array.from(inputs)[i].value === input.value) {
                        input.classList.remove("not-in-place");
                        input.classList.add("wrong");
                        break;
                    } 
                }
            } else {
                input.classList.add("wrong");
            }

            if( Array.from(inputs).every((input) => input.classList.contains("correct")) ) {
                checkBtn.style.cssText = "display: none";
                hintBtn.style.cssText = "display: none";
                winning.style.cssText = "display: block";
                descriptionDiv.style.cssText = "display: none;"; 
                if ( Windex < words.length - 1 ) 
                    nextBtn.style.cssText = "display: block;"
                else 
                    lastLevelDiv.style.cssText = "display: block";
            }
        })
    } else {
        alertSpan.innerHTML = "Please Fill All the Inputs";
    }
}


// Handle Hints 

hintBtn.addEventListener(("click"), function () {
    if ( noOfHints > 0) {
        let hintIndex = Math.floor(Math.random() * word.length);
        while (Array.from(inputs)[hintIndex].value !== "") {
            hintIndex = Math.floor(Math.random() * word.length);
            if (Array.from(inputs).every(input => input.value !== ""))
                break;
            }
        Array.from(inputs)[hintIndex].value = word[hintIndex];
        Array.from(inputs)[hintIndex].classList.add("correct");
        Array.from(inputs)[hintIndex].classList.add("hinted");
        Array.from(inputs)[hintIndex].disabled = true;
        noOfHints--;
        if( noOfHints > 1 || noOfHints == 0) 
            document.querySelector(".hint span").innerHTML = noOfHints + " Hints";
        else
            document.querySelector(".hint span").innerHTML = noOfHints + " Hint";

        if ( noOfHints === 0 )
            hintBtn.disabled = true;
    }
})

nextBtn.addEventListener("click", function() {
    if (Number(localStorage.getItem("level")) < words.length)
    Windex++; 
    if ( Number(localStorage.getItem("level")) >= Windex)
        localStorage.setItem("level", Windex); 
    else {
        localStorage.setItem("level", Windex); 
        localStorage.setItem("lastLevel", Windex)
    }
    if ( Windex < words.length) 
        location.reload(); 
})

Array.from(lis).forEach((li, index) => li.addEventListener("click", function() {
    localStorage.setItem("level", index);
    location.reload();
}))

playAgain.addEventListener("click", function() {
    localStorage.setItem("level", 0);
    location.reload();
})
