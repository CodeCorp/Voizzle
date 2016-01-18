# Voizzle : The Voice Enabled Word Puzzle 

[![game version](https://img.shields.io/badge/version-1.0-red.svg)](https://img.shields.io/badge/version-1.0-red.svg)
[![npm version](https://badge.fury.io/js/npm.svg)](https://badge.fury.io/js/npm)

_For people who enjoy playing word puzzles but are too lazy to move their hands to mark the words._


![Screenshot](http://oi63.tinypic.com/2ajwadg.jpg "Screenshot during game play")

##Requirements
- npm (latest)
- node (latest)

Also, the clients need to play the game in **Google Chrome Browser**. We do not support any other browsers at the moment.

##Installation

```bash
git clone https://github.com/CodeCorp/Voizzle.git
cd Voizzle
npm install
node server.js
```

##Game Play
To start a new game press New Game button after entering the puzzle number in the text field beside the New Game button.

Press the speak button to start when you're ready to speak. The animation in the text field denotes when the app is listening.

The clients are randomly alloted a color (yellow/green) and the alloted color is highlighted in the score board on the top right.

The game begins after you press the New Game button and the timer in the right side starts. Speak a word while the app is listening and watch it get highlighted in the puzzle with the colour alloted to you while your opponents words are highlighted with a different colour. 

The aim is to find maximum number of words before the timer ends.

**Cheat:**
If your word is not getting recognised because of the pronunciation, you can speak phrase containing that word.
*For example, if you speak 'ate' the game may recognise it as '8' or 'eight', so instead try speaking a phrase like "I 'ate' an apple".Hence the app will search for all the words in the phrase namely 'I','ate','an','apple' which includes the required word 'ate'.*




##Contributors
* Pulkit Agarwal ([@thepulkitagarwal](https://github.com/thepulkitagarwal))
* Rohan Goel ([@rohangoel96](https://github.com/rohangoel96))

##License
Voizzle is licensed under the [MIT License](https://github.com/CodeCorp/Voizzle/blob/master/LICENSE.md)
