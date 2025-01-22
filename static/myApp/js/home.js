//This function is for showing champion name suggestions when the user
//enters the champion name in the input box.
function showSuggestions(input) {
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
