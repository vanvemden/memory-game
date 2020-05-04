window.addEventListener("load", function() {

    let imageGeneratorUrl = "https://picsum.photos/100/100",
        listOfPlayers = [],
        currentPlayer = 0,
        openCards = [],
        hideCardDelay = 3000;

    document.getElementById("start").addEventListener("click", startGame);
    document.getElementById("quit").addEventListener("click", confirmQuitGame);

    function startGame() {
        let setsSelectlist =  getSetsInputElement();
        let numberOfSets = setsSelectlist.value;
        listOfPlayers = getPlayers();
        if(listOfPlayers.length === 0) {
            alert("Please enter a name in Brain 1.");
            return;
        }
        setGameMode(true);
        switchScreens("main", "setup");
        switchScreens("scores", "setup");
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
        resetGame();
        switchScreens("game", "main");
        setGameMode(false);
    }

    function resetGame() {
        let cards = getCardsContainerElement();
        cards.innerHTML = "";
        for (let i = 0; i < listOfPlayers.length; i++) {
            let points = getPointsElement(listOfPlayers[i])
            let clicks = getClicksElement(listOfPlayers[i]);
            points.innerText = 0;
            clicks.innerText = 0;
        }
        listOfPlayers = [];
        currentPlayer = 0;
        openCards = [];
    }

    function confirmQuitGame() {
        if(confirm("Are you sure you want to quit the game? Select OK to quit, or Cancel to continue the game.")) {
            stopGame(false);
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
                alert("Oops, same card clicked again.");
                return;
            } else {
                showCard(card);
                updatePlayerClicks(player);
                if(openCardsMatch()) {
                    updatePlayerPoints(player);
                    freezeOpenCards();
                    if(isGameOver()) {
                        postScores();
                        switchScreens("game", "scores")
                        resetGame()
                        setGameMode(false);
                    }    
                } else {
                    hideOpenCards();
                }
            }
        }
    }

    function setGameMode(gameOn = true){
        let setsList = document.getElementById("sets");
        let inputFields = document.getElementsByClassName("player");
        let startButton = document.getElementById("start");
        let quitButton = document.getElementById("quit");
        setsList.disabled = gameOn;
        for(let i = 0; i < inputFields.length; i++ ) {
            inputFields[i].disabled = gameOn;
        }
        startButton.hidden = gameOn;
        quitButton.hidden = !gameOn;
    }

    function isGameOver() {
        let cardsOpen = getOpenCardElements();
        let setsInput = getSetsInputElement();
        if (cardsOpen.length === parseInt(setsInput.value) * 2 ) {
            return true;
        }
        return false;
    }

    function updatePlayerClicks(player) {
        let clicksElement = getClicksElement(player);
        player.clicks++;
        clicksElement.innerText = player.clicks;
    }

    function updatePlayerPoints(player) {
        let pointsElement = getPointsElement(player);
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
                    points: 0
                }
                players.push(player);
            }
        }
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

    function postScores() {
        let gameRanking = sortScores(listOfPlayers);
        let gameScoreList = getGameScoreElement();
        addItemsToList(gameRanking, gameScoreList);
        let top10Ranking = loadTop10Ranking();
        let combinedRanking = top10Ranking.concat(gameRanking);
        top10Ranking = sortScores(combinedRanking).slice(0,10);
        saveTop10Ranking(top10Ranking);
        let top10ScoreList = getTop10ScoreElement();
        addItemsToList(top10Ranking, top10ScoreList);
    }

    function addItemsToList(items, list) {
        list.innerHTML = "";
        for (let i = 0; i < items.length; i++) {
            let li = document.createElement("li");
            li.innerText = `${items[i].name}, ${items[i].points} points in ${items[i].clicks} clicks`;
            list.appendChild(li);
        }
    }

    function sortScores(players) {
        return players.sort((a, b) => b.points - a.points || b.clicks - a.clicks); 
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

    function freezeOpenCards() {
        openCards.forEach(function(card) {
            card.removeEventListener("click", cardClicked);
        });
        openCards = [];
    }

    function hideOpenCards() {
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
        let cards = getCardsContainerElement();
        cardSet.forEach(card => {
            card.style.transform = "rotate(" + ((Math.random() * 4) - (Math.random() * 4))  + "deg)";
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

    function saveTop10Ranking(players) {
        let str = JSON.stringify(players);
        localStorage.setItem("memory-game-top10", str);
     }
  
     function loadTop10Ranking() {
        let str = localStorage.getItem("memory-game-top10");
        return JSON.parse(str) || [];
     }
     
    function getCardsContainerElement() {
        return document.getElementById("cards");
    }

    function getOpenCardElements() {
        return document.querySelectorAll(".card.open");
    }

    function getClicksElement(player) {
        return  document.querySelector("#stats-" + player.id + " span.clicks")
    }

    function getPointsElement(player) {
        return document.querySelector("#stats-" + player.id + " span.points");
    }

    function getSetsInputElement() {
        return document.getElementById("sets");
    }

    function getGameScoreElement() {
        return document.getElementById("last");
    }

    function getTop10ScoreElement() {
        return document.getElementById("past");
    }
})