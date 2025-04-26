//This function is for showing idol name suggestions when the user
//enters the idol name in the input box.
function showSuggestions(input){
    const dropdown = document.getElementById("dropdownList");
    dropdown.innerHTML = ""; //Clear previous suggestions!
    if(input.trim() === ""){
        dropdown.style.display = "none"; //Hide options if input is empty
        return;
    }
    //Fetch data from Django API for idols
    fetch(API_IDOL_URL)
        .then(response => response.json())
        .then(data => {
            //Access the list of idols
            const idols = data.idol_list; 
            //Filter idols based on the input
            const suggestions = idols.filter(idol =>
                idol.name.toUpperCase().startsWith(input.toUpperCase())
            );
            if(suggestions.length > 0){
                dropdown.style.display = "block";
                suggestions.forEach(idol => {
                    const listItem = document.createElement("li");
                    //This is the idol's name from the API
                    listItem.textContent = idol.name; 
                    listItem.classList.add("dropdown-item");
                    listItem.addEventListener("click", () => {
                        //Set input value to the clicked suggestion
                        document.querySelector(".userGuessInput").value = idol.name; 
                        //Hide the dropdown list when an item is clicked
                        dropdown.style.display = "none"; 
                    });
                    dropdown.appendChild(listItem);
                });
            }
            else{
                //Hide the dropdown list if there are no suggestions
                dropdown.style.display = "none";
            }
        })
        .catch(error => console.error("Error getting data:", error));
}

let idolList = [];
let ansIdol = null;
const isUsed = {};

//Load the idol data to idolList and ansIdol so that I can use it for my game logic
function loadIdols() {
    //Fetch data from my API
    fetch(API_IDOL_URL)
        .then(response => response.json())
        .then(data => {
            //Store idols in idolList
            idolList = data.idol_list;
            //Get a random idol as the answer
            ansIdol = data.random_idol;
        })
        .catch(error => console.error("Error getting data:", error));
}

//Load the loadIdols function when the page loads
document.addEventListener("DOMContentLoaded", loadIdols);

//Function to get the guessed idol name and search it from the idol list
function getIdolNum(guessIdolName) {
    //Find the idol in the list
    const idol = idolList.find(idol =>idol.name.toLowerCase() === guessIdolName.toLowerCase());
    if(idol){
        //Check if the idol has already been guessed
        if(!isUsed[idol.name]){
            //Mark the idol as true meaning it was searched already
            isUsed[idol.name] = true;
            return idol;
        }
        else{
            //Error catch
            console.log("You've already guessed this idol!");
            return null;
        }
    }else{
        //Error catch
        console.log("Idol not found!");
        return null;
    }
}

const userGuessForm = document.querySelector(".userGuessForm");
const userGuessInput = document.querySelector(".userGuessInput");
const tableBody = document.querySelector("#idol-table tbody");

//When the user submits their guess, the following function is called
userGuessForm.addEventListener("submit", async event => {
    //Check the console for the random idol name to check answer
    console.log(ansIdol.name);
    event.preventDefault();
    const selectedIdolName = userGuessInput.value.trim();
    if(!selectedIdolName){
        alert("Please select an Idol!");
        return;
    }
    const idolGuess = getIdolNum(selectedIdolName);
    //Check if the idolGuess and the answer matches
    if(idolGuess){
        await compareIdolInfo(idolGuess, ansIdol);
    } 
    //Invalid entry check
    else{
        alert("Idol not found or already guessed!");
    }
});

//Sleep function!!!
function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds));
}

//Function to get CSRF token from cookies!!!!!!!!!!!!!!!!
function getCSRFToken(){
    let cookieValue = null;
    const cookies = document.cookie.split(";");
    for(let i = 0; i < cookies.length; i++){
        const cookie = cookies[i].trim();
        if(cookie.startsWith("csrftoken=")){
            cookieValue = cookie.substring("csrftoken=".length, cookie.length);
            break;
        }
    }
    return cookieValue;
}

//This function displays which part of the idol criteria the user got correct
//by inserting cells into a table row with either correct or incorrect
async function compareIdolInfo(idolGuess, ansIdol) {
    let row = tableBody.insertRow(0);
    
    //Name and Image cell
    const iconCell = row.insertCell(-1);
    const idolImg = document.createElement("img");
    idolImg.src = `/static/myApp/images/facecard/${idolGuess.name.replace(' ', '_').toLowerCase()}.jpg`;
    idolImg.classList.add("idol-img");
    iconCell.appendChild(idolImg);

    //Group
    const groupCell = row.insertCell(-1);
    const groupContent = document.createElement("div");
    groupContent.classList.add("inner");
    groupContent.textContent = idolGuess.group;
    groupCell.appendChild(groupContent);
    if(idolGuess.group === ansIdol.group){
        groupCell.classList.add("rotating-cell-correct");
    }
    else{
        groupCell.classList.add("rotating-cell-incorrect");
    }
    await sleep(500);

    //Birthday
    const birthdayCell = row.insertCell(-1);
    const birthdayContent = document.createElement("div");
    birthdayContent.classList.add("inner");
    birthdayContent.textContent = idolGuess.birthday;
    birthdayCell.appendChild(birthdayContent);
    //Make birthdays to Date objects for comparison
    let guessedDate = new Date(idolGuess.birthday);
    let answerDate = new Date(ansIdol.birthday);
    if(guessedDate.getTime() === answerDate.getTime()){
        birthdayCell.classList.add("rotating-cell-correct");
    }
    else{
        birthdayCell.classList.add("rotating-cell-incorrect");
        //Arrow for higher or lower birthdays
        let arrowIndicator = document.createElement("span");
        arrowIndicator.textContent = guessedDate < answerDate ? "↑" : "↓"; 
        arrowIndicator.style.marginLeft = "8px";
        birthdayContent.appendChild(arrowIndicator);
    }
    await sleep(500);

    //Height
    const heightCell = row.insertCell(-1);
    const heightContent = document.createElement("div");
    heightContent.classList.add("inner");
    heightContent.textContent = idolGuess.height;
    heightCell.appendChild(heightContent);
    if(idolGuess.height === ansIdol.height){
        heightCell.classList.add("rotating-cell-correct");
    }
    else{
        heightCell.classList.add("rotating-cell-incorrect");
        let arrowIndicator = document.createElement("span");
        arrowIndicator.textContent = idolGuess.height < ansIdol.height ? "↑" : "↓";
        arrowIndicator.style.marginLeft = "8px"; 
        heightContent.appendChild(arrowIndicator);
    }
    await sleep(500);

    //Gender
    const genderCell = row.insertCell(-1);
    const genderContent = document.createElement("div");
    genderContent.classList.add("inner");
    genderContent.textContent = idolGuess.gender;
    genderCell.appendChild(genderContent);
    if(idolGuess.gender === ansIdol.gender){
        genderCell.classList.add("rotating-cell-correct");
    }
    else{
        genderCell.classList.add("rotating-cell-incorrect");
    }
    await sleep(500);

    //Company
    const companyCell = row.insertCell(-1);
    const companyContent = document.createElement("div");
    companyContent.classList.add("inner");
    companyContent.textContent = idolGuess.company;
    companyCell.appendChild(companyContent);
    if(idolGuess.company === ansIdol.company){
        companyCell.classList.add("rotating-cell-correct");
    }
    else{
        companyCell.classList.add("rotating-cell-incorrect");
    }
    await sleep(500);

    //Nationality
    const nationalityCell = row.insertCell(-1);
    const nationalityContent = document.createElement("div");
    nationalityContent.classList.add("inner");
    nationalityContent.textContent = idolGuess.nationality;
    nationalityCell.appendChild(nationalityContent);
    if(idolGuess.nationality === ansIdol.nationality){
        nationalityCell.classList.add("rotating-cell-correct");
    }
    else{
        nationalityCell.classList.add("rotating-cell-incorrect");
    }
    await sleep(500);

    //Read the hidden input from HTML and store it here o.o
    const isUserLoggedIn = document.getElementById("isUserLoggedIn").value === "true";
    //Checking if the user won by comparing guessed idol name and answer idol name
    if(idolGuess.name === ansIdol.name){
        //this is popup-js implementation. I want to use this pop up for when the user guesses the correct idol. I followed
        //the documentation here: https://popup-js.readthedocs.io/en/latest/usage/
        const ansImage = `/static/myApp/images/facecard/${ansIdol.name.replace(' ', '_').toLowerCase()}.jpg`;
        const myPopup = new Popup({
            id: "my-popup",
            title: "You Win!",
            content: `
                <p>Correct Answer: <strong>${ansIdol.name}</strong></p>
                <img src="${ansImage}" alt="${ansIdol.name}" style="width:100px; height:100px; border-radius:10px;">`,
        });
        myPopup.show();
        console.log("You Win");

        //Checking if the user is logged in. This is from the hidden input in home.html
        if(!isUserLoggedIn){
            console.log("User is not logged in.");
            //Stop execution meaning don't make fetch request
            return;
        }

        //If the user is logged in, this will run
        //Send request to increment wins
        fetch("/increment_wins/", {method: "POST", headers: {"X-CSRFToken": getCSRFToken(), "Content-Type": "application/json"}})
        //I am converting response to json here
        .then(response => {
            if(!response.ok){
                throw new Error(`error: ${response.status}`);
            }
            return response.json();
        })
        //Access data.wins
        .then(data => {
            if(data){
                console.log(`Wins updated: ${data.wins}`);
            }
        })
    }
}
