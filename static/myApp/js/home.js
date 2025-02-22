//This function is for showing champion name suggestions when the user
//enters the champion name in the input box.
function showSuggestions(input){
    const dropdown = document.getElementById("dropdownList");
    dropdown.innerHTML = ""; //Clear previous suggestions!
    if(input.trim() === ""){
        dropdownList.style.display = "none"; //Hide options if input is empty
        return;
    }
    //Fetch data from my Django API
    fetch('http://127.0.0.1:8000/api/champion/')
    .then(response => response.json())
    .then(data => {
        //Access the list of champions
        const champions = data.champion_list;
        //Filter champions based on the input
        const suggestions = champions.filter(champion =>
            champion.name.toUpperCase().startsWith(input.toUpperCase())
        );

        if(suggestions.length > 0){
            dropdown.style.display = "block";
            suggestions.forEach(champion => {
                const listItem = document.createElement("li");
                //This is the champion name from API
                listItem.textContent = champion.name; 
                listItem.classList.add("dropdown-item");
                listItem.addEventListener("click", () => {
                    //Set input value to the clicked suggestion
                    document.querySelector(".userGuessInput").value = champion.name; 
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
}


let champList = [];
let ansChamp = null;
const isUsed = {};


//Load the champion data to champList and ansChamp so that I can use it for my game logic
function loadChampions(){
    //Fetch data from my API
    fetch('http://127.0.0.1:8000/api/champion/')
    .then(response => response.json())
    .then(data => {
        //Store champions in champList
        champList = data.champion_list;
        //Get a random champion as the answer
        ansChamp = data.random_champion;
    })
    //Error catch
    .catch(error => console.error('Error fetching champion data:', error));
}
//load the loadChampions function
document.addEventListener("DOMContentLoaded", loadChampions);


//Function to get the guessed champion name and search it from the champ list
function getChampNum(guessChampName){
    //Find the champion in the list
    const champion = champList.find(champ => 
      champ.name.toLowerCase() === guessChampName.toLowerCase()
    );
    if(champion){
        //Check if the champion has already been guessed
        if(!isUsed[champion.id]){
        //Mark the champion as true meaning it was searched already
        isUsed[champion.id] = true;
        return champion;
        }
        else{
        //ERROR CATCHYYY
        console.log("You've already guessed this champion!");
        return null;
        }
    }
    else{
        //ERROR CATCH AGAIN
        console.log("Champion not found!");
        return null;
    }
}


const userGuessForm = document.querySelector(".userGuessForm");
const userGuessInput = document.querySelector(".userGuessInput");
const tableBody = document.querySelector("#champ-table tbody");
//When the user submits their guess, the follow function is called
userGuessForm.addEventListener("submit", async event => {
    //Check the console for the random champion name to check answer
    console.log(ansChamp.name)
    event.preventDefault();
    const selectedChampionName = userGuessInput.value.trim();
    if(!selectedChampionName){
        alert("Please select a Champion!");
        return;
    }
    const champGuess = getChampNum(selectedChampionName);
    //Check if the champGuess and the answer matches
    if(champGuess){
        await compareChampInfo(champGuess, ansChamp);
    } 
    //Invalid entry check
    else{
        alert("Champion not found or already guessed!");
    }
});


//Sleep function!!!
function sleep(seconds){
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
  

//This function displays which part of the champion criteria the user got correct
//by inserting cells into a table row with either correct or incorrect
async function compareChampInfo(champGuess, ansChamp){
let row = tableBody.insertRow(0);
    //Icon or image cell
    const iconCell = row.insertCell(-1);
    const champImg = document.createElement("img");
    champImg.src = champGuess.image;
    iconCell.appendChild(champImg);
    
    //Gender
    const genderCell = row.insertCell(-1);
    genderCell.textContent = champGuess.gender;
    if(champGuess.gender === ansChamp.gender){
        genderCell.classList.add("rotating-cell-correct");
    }
    else{
        genderCell.classList.add("rotating-cell-incorrect");
    }
    await sleep(500);
    
    //Resource
    const resourceCell = row.insertCell(-1);
    resourceCell.textContent = champGuess.resource;
    if(champGuess.resource === ansChamp.resource){
        resourceCell.classList.add("rotating-cell-correct");
    }
    else{
        resourceCell.classList.add("rotating-cell-incorrect");
    }
    await sleep(500);

    //AttackType
    const attackTypeCell = row.insertCell(-1);
    attackTypeCell.textContent = champGuess.attackType;
    if(champGuess.attackType === ansChamp.attackType){
        attackTypeCell.classList.add("rotating-cell-correct");
    }
    else{
        attackTypeCell.classList.add("rotating-cell-incorrect");
    }
    await sleep(500);

    //Lane
    const laneCell = row.insertCell(-1);
    laneCell.textContent = champGuess.lane;
    if(champGuess.lane === ansChamp.lane){
        laneCell.classList.add("rotating-cell-correct");
    }
    else{
        laneCell.classList.add("rotating-cell-incorrect");
    }
    await sleep(500);
    
    //Genre
    const genreCell = row.insertCell(-1);
    genreCell.textContent = champGuess.genre;
    if(champGuess.genre === ansChamp.genre){
        genreCell.classList.add("rotating-cell-correct");
    }
    else{
        genreCell.classList.add("rotating-cell-incorrect");
    }
    await sleep(500);
    
    //Region
    const regionCell = row.insertCell(-1);
    regionCell.textContent = champGuess.region;
    if(champGuess.region === ansChamp.region){
        regionCell.classList.add("rotating-cell-correct");
    }
    else{
        regionCell.classList.add("rotating-cell-incorrect");
    }
    await sleep(500);
    
    //ReleaseDate
    const releaseCell = row.insertCell(-1);
    releaseCell.textContent = champGuess.releaseDate;
    if(champGuess.releaseDate === ansChamp.releaseDate){
        releaseCell.classList.add("rotating-cell-correct");
    }
    else{
        releaseCell.classList.add("rotating-cell-incorrect");
    }
    await sleep(500);

    
    //Read the hidden input from html and store it here o.o
    const isUserLoggedIn = document.getElementById("isUserLoggedIn").value === "true";
    //Checking if the user won by comparing guessed champ id and answer champ id
    if(champGuess.id === ansChamp.id){
        alert("🎉 Congratulations! You guessed the champion correctly! 🎉");
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
        //access data.wins
        .then(data => {
            if(data){
                console.log(`Wins updated: ${data.wins}`);
            }
        })
    }
}
