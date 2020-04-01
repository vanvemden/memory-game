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