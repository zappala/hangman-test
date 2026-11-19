# Hangman: First Version Plan

## Goal
Build a hangman game as practice for an AI-building class, and have something fun to play solo.

## Foundation (core game)
- Guess one letter at a time
- Wrong guesses allowed = 1.5 × the word length, rounded up (e.g., 4 letters → 6, 5 letters → 8)
- Win or lose message at the end of each round

## Three Must-Have Features
1. **Difficulty choice by commonness:** Easy uses everyday words, Medium uses less common ones, Hard uses rare ones.
2. **Free clue hints:** reveals clues like the part of speech or the first letter, as often as you want.
3. **Definition at the end:** after each round, win or lose, the game shows what the word means.

## Technical Approach
- Plain HTML, CSS, and JavaScript, running in the browser
- A bundled word file (a few thousand words), where each word has its definition, part of speech, and a commonness rating
- The word list is generated with AI; spot-check a sample of definitions for accuracy
- Works offline, with no online services

## Optional, for Later
- Score and win-streak tracking
- Hangman drawing, animations, sounds
- Letter-reveal hints
- Adding your own word lists
