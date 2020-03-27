/*
3. Memory Game
For this assignment, you’ll be building a memory game in the 
browser using HTML, CSS, and JavaScript. Your goal is to build
a card-based memory game.

Players will be shown a collection of cards, face down, and can
click on a card to reveal what’s underneath. After clicking on 
two cards, the game should check to see whether they match. If 
they do, they will remain facing up. If not, the cards should 
remain displayed to the player for a couple of seconds, and then 
flip back down. The goal of the game is to match up pairs of 
cards in as few clicks as possible.

Be sure to style your game! It should be functional but also look nice.

Requirements
- User should be able to start a new game.
- Clicking a card should reveal what’s underneath it. 
- The game should keep track and display the number of times 
  cards have been turned over.
- Users should only be able to see at most two cards at a time.
- Clicking on two matching cards should be a “match” — those 
  cards should stay face up. (Make sure this works only if you 
  click on two different cards — clicking the same card twice 
  shouldn’t count as a match!)
- When clicking two cards that are not a match, they should 
  stay turned over for at least 1 second before they flip over 
  again

  (Bonus) Store the lowest-scoring game in local storage, so that 
  players can see a record of the best game played.
*/

// How to play memory game
// 1. Mix up the cards.
// 2. Lay them in rows, face down.
// 3. Turn over any two cards
// 4. If the two cards match, keep them.
// 5. If they don't match, turn them back over.
// 6. Remember what was on each card and where it was.
// 7. Watch and remember during the other player's turn.
// 8. The game is over when all the cards have been matched.

// Game features
// x Single or multiple player game
// x Easy, Normal, or Hard game level (12, 18, 24 sets)
// x Count number of matched pairs per player
// - Count number of turns, also for single player
// x Count number of flips per card.
// x Random new pictures in every game
// - Option for Trump card; loos
// - Option for Obama card; click tree for this turn
// - Select theme for images 

// Process
// Select number of players (default 1)
// Enter player name(s)
// Select game level (default Normal/18)
// Click New Game button
// Cards are layed
// Player 1 pickes two cards
// If cards match
//  cards remain turned, player gets point
//  if all cards turned, 
//      game over!
//  else
//      player picks again
// else
//  carrs are turned back, player looses turn
// If multiplayer
//  next player gets turn
// else 
//  player goes again

window.addEventListener("load", function(){

    let imageGeneratorUrl = "https://picsum.photos/100/100",
        listOfPlayers = [],
        currentPlayer = 0,
        openCards = [],
        hideCardDelay = 3000;

    document.getElementById("start").addEventListener("click", startGame);
    document.getElementById("quit").addEventListener("click", confirmQuitGame);

    function startGame() {
        let setsSelectlist =  document.getElementById("sets")
        let numberOfSets = setsSelectlist.value;
        
        listOfPlayers = getPlayers();
        if(listOfPlayers.length === 0) {
            alert("See step 2; enter at least one name, brain.");
            return;
        }

        setGameMode(true);
        switchScreens("main", "setup");

        getImages(numberOfSets).then( function(images) {
            let imageElements = getImageElements(images);
            let cardSet = getCardSet(imageElements);

            layCardSet(cardSet);
            switchScreens("setup", "game");
            playerGetsTurn(listOfPlayers[currentPlayer]);

        }).catch( function(error) {
            console.log("Error laying the cards.");
            switchScreens("setup", "error");
            // Switch screen to SORRY, ERROR page
            document.querySelector("#error .message").innerHTML = error;
        })
    }

    function stopGame(keepScore = true) {
        switchScreens("game", "main");
        setGameMode(false);
    }

    function confirmQuitGame() {
        if(confirm("Are you sure you want to quit the game? Select OK to quit, or Cancel to continue the game.")) {
            stopGame(false);
        } else {

        }
    }

    function switchScreens(fromScreen, toScreen) {
        let from = document.getElementById(fromScreen);
        let to = document.getElementById(toScreen);
        from.hidden = true;
        to.hidden = false;
    }

    function cardClicked(event) {
        let card = event.target;
        let player = listOfPlayers[currentPlayer];

        if (openCards.length === 0) {
            // Handle first card
            showCard(card);
            updatePlayerClicks(player);
        } else if (openCards.length === 1) {
            // Handle second card
            if (openCards[0] === card) {
                alert("Brainfart! Same card clicked again.");
                return;
            } else {
                showCard(card);
                updatePlayerClicks(player);
                if(openCardsMatch()) {
                    updatePlayerPoints(player);
                    freezeCards();
                    if(isGameOver()) {
                        setGameMode(false);
                    }    
                } else {
                    hideCards();
                }
            }
        }
    }

    function setGameMode(gameOn = true){
        let inputFields = document.getElementsByClassName("player");
        let startButton = document.getElementById("start");
        let quitButton = document.getElementById("quit");
        for(let i = 0; i < inputFields.length; i++ ) {
            inputFields[i].disabled = gameOn;
        }
        startButton.hidden = gameOn;
        quitButton.hidden = !gameOn;
    }

    function isGameOver() {
        if
    }

    function updatePlayerClicks(player) {
        let clicksElement = document.querySelector("#stats-" + player.id + " span.clicks");
        player.clicks++;
        clicksElement.innerText = player.clicks;
    }

    function updatePlayerPoints(player) {
        let pointsElement = document.querySelector("#stats-" + player.id + " span.points");
        player.points++;
        pointsElement.innerText = player.points;
    }

    function getPlayers() {
        let players = [];
        let inputElements = document.getElementsByClassName("player");
        for (let i = 0; i < inputElements.length; i++) {
            if(inputElements[i].value.length > 0) {
                let player = {
                    name: inputElements[i].value,
                    id: inputElements[i].id, 
                    clicks: 0,
                    points: 0,
                    games: 0
                }
                players.push(player);
            }
        }
        console.log(players);
        return players;
    }

    function playerLosesTurn(player) {
        let inputElement = document.getElementById(player.id);
        inputElement.classList.remove("turn");
    }

    function playerGetsTurn(player) {
        let inputElement = document.getElementById(player.id);
        let title = document.querySelector("#game h2");
        inputElement.classList.add("turn");
        title.innerText = `Your turn, ${ player.name }`;
        title.classList.add("turn");
    }

    function playerHasMatch(text) {
        let title = document.querySelector("#game h2");
        title.innerText = text;
        title.classList.add("score");
    }

    function nextPlayer() {
        playerLosesTurn(listOfPlayers[currentPlayer]);
        if(currentPlayer < listOfPlayers.length - 1) {
            currentPlayer++;
        } else {
            currentPlayer = 0;
        }
        playerGetsTurn(listOfPlayers[currentPlayer]);
    }

    function openCardsMatch() {
        let card1 = openCards[0].querySelector("img");
        let card2 = openCards[1].querySelector("img");
        return card1.src === card2.src;
    }

    function freezeCards() {
        openCards.forEach(function(card) {
            card.removeEventListener("click", cardClicked);
        });
        openCards = [];
    }

    function hideCards() {
        let timer = setTimeout(function() {
            openCards.forEach(function(card) {
                card.classList.toggle("open");
            });
            openCards = [];
            nextPlayer();
        }, hideCardDelay);
    }

    function showCard(card) {
        let counter = card.querySelector("span");
        openCards.push(card);
        card.classList.toggle("open");
        card.dataset.timesFlipped++;
        counter.innerText = card.dataset.timesFlipped;
    }

    function layCardSet(cardSet) {
        let cards = document.getElementById("cards");
        cardSet.forEach(card => {
            card.style.transform = "rotate(" + ((Math.random() * 4) - (Math.random() * 4))  + "deg)";
            console.log(card);
            cards.appendChild(card);
        });
    }

    function getCardSet(imageElements) {
        let cardSet = [];
        imageElements.forEach( function(imageElement) {
            let card = document.createElement("div")
            let counter = document.createElement("span");
            counter.innerText = 0;
            card.className = 'card';
            card.dataset.timesFlipped = 0;
            card.addEventListener("click", cardClicked);
            card.appendChild(imageElement)
            card.appendChild(counter);
            cardSet.push(card);
        })
       return shuffleCardSet(cardSet);
    }

    function shuffleCardSet(cardSet) {
        for (let i = 0; i < cardSet.length; i++) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]];
        }
        return cardSet;
    }

    function getImageElements(images) {
        let imageElements = [];
        for (let i = 0; i < images.length; i++) {
            // Create set of two elements per image
            imageElements.push(
                getImageElement(images[i]), 
                getImageElement(images[i])
            );
        }
        return imageElements;
    }

    function getImageElement(image) {
        let element = document.createElement("img");
        element.src = image.url;
        return element;
    }

    function getImages(numberOfSets) {
        let imagePromises = [];
        return new Promise( function(resolve, reject) {
            for(let i = 0; i < numberOfSets; i++) {
                imagePromises.push(fetchImage());
            }
            Promise.all(imagePromises).then( function(images) {
                resolve(images);
            }).catch( function(error) {
                reject(error);
            })
        })
    }

    function fetchImage() {
        return fetch(imageGeneratorUrl).then( function(response) {
            return response;
        }).catch( function(error) {
            console.log(error);
            return error;
        });
    }

})