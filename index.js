/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
 */

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from "./games.js";

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
 */
// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
  // loop over each item in the data
  for (let i = 0; i < games.length; i++) {
    // create a new div element, which will become the game card
    const newGameCardDiv = document.createElement("div");
    // add the class game-card to the list
    newGameCardDiv.classList.add("game-card");
    // set the inner HTML using a template literal to display some info
    // about each game
    newGameCardDiv.innerHTML = `
    <img src="${games[i].img}" class="game-img">
    <h3>${games[i].name}</h3>
    <p>${games[i].description}</p>
    <p>${games[i].backers}</p>
    `;
    // TIP: if your images are not displaying, make sure there is space
    // between the end of the src attribute and the end of the tag ("/>")

    // append the game to the games-container
    gamesContainer.appendChild(newGameCardDiv);
  }
}

// call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON);
// later, we'll call this function using a different list of games

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
 */
// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((acc, game) => {
  return acc + game.backers;
}, 0);
// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `$${totalContributions.toLocaleString("en-US")}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((acc, game) => {
  return acc + game.pledged;
}, 0);
// set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString("en-US")}`;
// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const totalNumberOfGames = GAMES_JSON.length;
gamesCard.textContent = totalNumberOfGames;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
 */

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have not yet met their goal
  const underfunded = GAMES_JSON.filter((game) => {
    return game.pledged < game.goal;
    // use the function we previously created to add the unfunded games to the DOM
  });
  addGamesToPage(underfunded);
  console.log(underfunded.length);
}
// show only games that are fully funded
function filterFundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have met or exceeded their goal
  const fundedGames = GAMES_JSON.filter((game) => {
    return game.pledged >= game.goal;
  });
  // use the function we previously created to add unfunded games to the DOM
  addGamesToPage(fundedGames);
  console.log(fundedGames.length);
}

// error handling for searched game function
function displayNotification() {
  const notification = document.createElement("div");
  notification.innerHTML = `<p>Searched game is not available</p><p>Search again or click on one of the buttons above</p>`;
  notification.classList.add("notification");
  gamesContainer.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000);
}
// show searched game
function showSearchedGame(searchTerm) {
  deleteChildElements(gamesContainer);
  const searchedGame = GAMES_JSON.filter((game) => {
    return game.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  if (searchedGame.length > 0) {
    addGamesToPage(searchedGame);
    gamesContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    gamesContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    displayNotification();
  }
}
// show all games
function showAllGames() {
  deleteChildElements(gamesContainer);
  // add all games from the JSON data to the DOM
  addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// ------------ Student Note ---------------
// For this one I have two ideas, one is selecting each button and then attaching
// event handlers, and the second oen is event delegation for scalability
// and performance
// ----------- End of Student Note ----------

// add event listeners with the correct functions to each button

unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

// -------------- ^^ Better Solution ^^ ----------------
// const buttonContainer = document.getElementById("button-container");
// buttonContainer.addEventListener("click", function (e) {
//   console.log("Button clicked:", e.target.id); // Check which button is clicked
//   if (e.target.tagName === "BUTTON") {
//     switch (e.target.id) {
//       case "unfunded-btn":
//         filterUnfundedOnly();
//         break;
//       case "funded-btn":
//         filterFundedOnly();
//         break;
//       case "all-btn":
//         showAllGames();
//         break;
//     }
//   }
// });

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
 */

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const numberOfUnfundedGames = GAMES_JSON.reduce((acc, game) => {
  return acc + (game.pledged < game.goal ? 1 : 0);
}, 0);
// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${totalRaised.toLocaleString(
  "en-US"
)} has been raised for ${totalNumberOfGames} games. Currently, ${numberOfUnfundedGames} game${
  numberOfUnfundedGames === 1 ? "" : "s"
} remain${
  numberOfUnfundedGames === 1 ? "s" : ""
} unfunded. We need your help to fund these amazing games!`;

console.log(displayStr);
// create a new DOM element containing the template string and append it to the description container
const newDescription = document.createElement("p");
newDescription.textContent = displayStr;
descriptionContainer.appendChild(newDescription);
/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
  return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [mostFundedGame, secondMostFundedGame, ...rest] = sortedGames;
console.log(mostFundedGame, secondMostFundedGame);
// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameElement = document.createElement("p");
firstGameElement.textContent = mostFundedGame.name;
firstGameContainer.appendChild(firstGameElement);
// do the same for the runner up item
const secondGameElement = document.createElement("p");
secondGameElement.textContent = secondMostFundedGame.name;
secondGameContainer.appendChild(secondGameElement);

// implementing search bar
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
let inputValue;

searchBtn.addEventListener("click", function () {
  inputValue = searchInput.value.trim();
  if (inputValue) {
    showSearchedGame(inputValue);
  } else {
    displayNotification();
  }
});
