"use strict";

const submitBtn = document.getElementById("submitBtn");
const startBtn = document.getElementById("startBtn");
const nameInput = document.getElementById("nameInput");
const valueInput = document.getElementById("valueInput");

const repeatOnceRadio = document.getElementById("repeatOnce");
const repeatInfiniteRadio = document.getElementById("repeatInfinite");

const nameToRememberP = document.getElementById("nameToRemember");
const writtenNumberP = document.getElementById("writtenNumber");
const inputErrorP = document.getElementById("inputError");

const numpadBtns = document.querySelectorAll(".num");
const memoriseListDiv = document.getElementById("memoriseList");
const settingsDiv = document.getElementById("settings");

let memoriseList = [];
let nameToRemember;
let nameToRememberIdx;
let gameRunning = false;

if (window.location.toString().split("?").length > 1){
    if (window.location.toString().split("?")[1].split("=")[0] == "devmode"){
        console.log("devmode activated");
        const devmodeDiv = document.getElementById("devmode");
        const devmodeReloadBtn = document.querySelector("#devmode a");
        devmodeReloadBtn.href = window.location.toString().split("devmode")[0] + "devmode" + Math.random().toString().slice(2,);
        devmodeDiv.style.display = "";
        devmodeReloadBtn.addEventListener("mouseover", () => {
            devmodeReloadBtn.href = window.location.toString().split("devmode")[0] + "devmode=" + Math.random().toString().slice(2,);
        })
    }
}

/*if (navigator.cookieEnabled){
    let cookies = decodeURIComponent(document.cookie).split("; ");
    cookies.forEach((element, idx, arr) => {
        arr[idx] = element.split("=");
    });
    for (const cookie of cookies){
        console.log(cookie);
        addToMemoriseList(cookie[0], cookie[1]);
    }
}*/

numpadBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        if (gameRunning){
            const inputKey = event.target.textContent;
            if (inputKey == nameToRemember.value.toString()[nameToRememberIdx]){
                writtenNumberP.textContent += inputKey;
                nameToRememberIdx++;
                if (nameToRememberIdx >= nameToRemember.value.length){
                    if (repeatOnceRadio.checked){
                        stopGame("win");
                    }
                    else if (repeatInfiniteRadio.checked){
                        stopGame("restart");
                    }
                }
            }
            else {
                event.target.style.backgroundColor = "#D30";
                setTimeout(() => event.target.style.backgroundColor = "", 1000);
            }
        }
    })
})

submitBtn.addEventListener("click", () => {
    if (gameRunning){
        inputErrorP.textContent = "The game is running, stop the game to add new numbers to memorise!";
    }
    else if (nameInput.value === "" || valueInput.value === ""){
        inputErrorP.textContent = "The name and/or value cannot be empty!";
    }
    else{
        inputErrorP.textContent = "";
        addToMemoriseList(nameInput.value, valueInput.value);
        nameInput.value = "";
        valueInput.value = "";
    }
})

startBtn.addEventListener("click", () => {
    if (memoriseList.length > 0){
        if (gameRunning){
            stopGame("manual");
        }
        else{
            startGame()
        }
    }
})

function stopGame(type){
    // the value of type can be:
    //  "manual" - when the user clicks the stop button
    //  "restart" - when the game starts again from infinite repeat mode
    //  "win" - when the game ends
    if (type == "restart"){
        nameToRememberP.textContent = "Completed!";
        setTimeout(() => {
            nameToRememberP.textContent = "Get ready!";
            writtenNumberP.textContent = "";
            setTimeout(startGame, 1000);
        }, 1500);
    }
    else{
        gameRunning = false;
        startBtn.classList.remove("stop");
        startBtn.textContent = "Start";
        settingsDiv.style.display = "";
        if (type == "win"){
            nameToRememberP.textContent = "Completed!";
        }
        else if (type == "manual"){
            nameToRememberP.textContent = "Game ended.";
        }
        setTimeout(() => {
            if (!gameRunning){
                nameToRememberP.textContent = "";
            }
            if (writtenNumberP.textContent == nameToRemember){
                writtenNumberP.textContent = "";
            }
        }, 2500);
    }
}

function startGame(){

    nameToRemember = memoriseList[Math.floor(Math.random() * memoriseList.length)];
    nameToRememberP.textContent = "What is the value of: " + nameToRemember.name;
    nameToRememberIdx = 0;
    settingsDiv.style.display = "none";
    gameRunning = true;
    startBtn.classList.add("stop");
    startBtn.textContent = "Stop";
}

function addToMemoriseList(name, value){
    // This creates the following structure:
    /*
    <div class="nameValue">
    <div>
    <p class="name">Name: pi</p>
    <p class="value">Value: 31415926535</p>
    </div>
    <button class="delete">❌</button>
    </div>
    */
   // Add to list
   memoriseList.push({"name": name,
                      "value": value});
   // 1st layer 
   let outerDiv = document.createElement("div");
   outerDiv.classList.add("nameValue");
   // 2nd layer
   let innerDiv = document.createElement("div");
    let delButton = document.createElement("button");
    delButton.classList.add("delete");
    delButton.textContent = "❌";
    // 3rd layer
    let nameP = document.createElement("p");
    nameP.classList.add("name");
    nameP.textContent = `Name: ${name}`;
    let valueP = document.createElement("p");
    valueP.classList.add("value");
    valueP.textContent = `Value: ${value}`;
    // Merging
    innerDiv.appendChild(nameP);
    innerDiv.appendChild(valueP);
    outerDiv.appendChild(innerDiv);
    outerDiv.appendChild(delButton);
    // Add to DOM
    memoriseListDiv.appendChild(outerDiv);
    // Listen for delete button clicks
    delButton.addEventListener("click", (event) => {
        console.log(memoriseList);
        memoriseList = memoriseList.filter((element) => {
            const matchesListItem = ("Name: " + element.name == event.target.parentElement.children[0].children[0].textContent);
//            if (matchesListItem){
//                document.cookie = `${element.name}=${element.value}; expiry=Mon, 2 June 1001, 12:00:00 UTC; path=/`;
//            }
            return !matchesListItem
        });
        event.target.parentElement.parentElement.removeChild(event.target.parentElement);
    });
}