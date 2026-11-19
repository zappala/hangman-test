# Hangman Roadmap

Each milestone ends with something you can open in a browser (`index.html`) and test.

## Milestone 1: Smallest working game ✅ (done, tested)
- [x] A page with a short built-in list of about 20 words
- [x] Show the hidden word as blanks (`_ _ _ _`)
- [x] Guess letters with on-screen letter buttons (each button is disabled after you use it)
- [x] Show correct letters in the word, and count wrong guesses
- [x] Wrong guesses allowed = 1.5 × word length, rounded up, with the number remaining shown
- [x] Win or lose message, and the word is revealed when you lose
- [x] "New Game" button

**Test it:** Open the page, play a few rounds, win one and lose one. Check that a 5-letter word allows 8 wrong guesses.

## Milestone 2: Definitions and clue hints ✅ (done, tested)
- [x] Move the words into a separate word file where each word has a definition and part of speech (about 50 words for now)
- [x] Show the definition at the end of every round, win or lose
- [x] "Hint" button that shows clues (part of speech, first letter); free and unlimited

**Test it:** Use the hints during a round and check that the clues are correct. Finish rounds with a win and with a loss, and confirm the definition appears both times.

## Milestone 3: Difficulty choice ✅ (done, tested)
- [x] Add a commonness rating (easy / medium / hard) to each word in the word file
- [x] Easy / Medium / Hard selector before or during a game
- [x] New games pick words only from the chosen difficulty

**Test it:** Play several rounds on each difficulty. Easy should give everyday words and Hard should give rare ones.

## Milestone 4: Full AI-generated word list
- [x] Generate a few thousand words with AI, each with a definition, part of speech, and commonness rating
- [x] Check the file format so every entry has all its fields
- [x] Spot-check a sample of about 30 definitions and difficulty ratings, and fix any errors
- [x] Confirm the game loads quickly and works offline

**Test it:** Turn off your internet, open the page, and play many rounds at each difficulty. Words should rarely repeat, and definitions should be accurate.
