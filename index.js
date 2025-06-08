const submitBtn = document.getElementById("submitBtn");
const startBtn = document.getElementById("startBtn");
const nameInput = document.getElementById("nameInput");
const valueInput = document.getElementById("valueInput");
const memoriseListDiv = document.getElementById("memoriseList");
const nameToRememberP = document.getElementById("nameToRemember");
const writtenNumberP = document.getElementById("writtenNumber");
const inputErrorP = document.getElementById("inputError");
const numpadBtns = document.querySelectorAll(".num");

let memoriseList = [];
let nameToRemember;
let nameToRememberIdx;
let gameRunning = false;

numpadBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        if (gameRunning){
            const inputKey = event.target.textContent;
            if (inputKey == nameToRemember.value.toString()[nameToRememberIdx]){
                writtenNumberP.textContent += inputKey;
                nameToRememberIdx++;
                if (nameToRememberIdx >= nameToRemember.value.length){
                    stopGame("win");
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
        memoriseList.push({"name": nameInput.value,
                           "value": valueInput.value});
                           addToMemoriseList(nameInput.value, valueInput.value);
                        }
})

startBtn.addEventListener("click", () => {
    if (memoriseList.length > 0){
        if (gameRunning){
            
            stopGame("manual");
        }
        else{

            nameToRemember = memoriseList[Math.floor(Math.random() * memoriseList.length)];
            nameToRememberP.textContent = "What is the value of: " + nameToRemember.name;
            nameToRememberIdx = 0;
            memoriseListDiv.style.display = "none";
            gameRunning = true;
            startBtn.classList.add("stop");
            startBtn.textContent = "Stop";
        }
    }
})

function stopGame(type){
    // the value of type can be:
    //  "manual" - when the user clicks the stop button
    //  "restart" - when the game starts again from infinite repeat mode
    //  "win" - when the game ends  
    gameRunning = false;
    startBtn.classList.remove("stop");
    startBtn.textContent = "Start";
    nameToRememberP.textContent = "Completed!";
    memoriseListDiv.style.display = "";
    setTimeout(() => {
        if (!gameRunning){
            nameToRememberP.textContent = "";
        }
        if (writtenNumberP.textContent == nameToRemember){
            writtenNumberP.textContent = "";
        }
    }, 2500);
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
        memoriseList = memoriseList.filter((element) => {
            return "Name: " + element.name != event.target.parentElement.children[0].children[0].textContent});
        event.target.parentElement.children[0].children[0].textContent
        event.target.parentElement.parentElement.removeChild(event.target.parentElement);
    });
}