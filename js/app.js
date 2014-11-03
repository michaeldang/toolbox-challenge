/**
 * Created by michaeldang on 10/28/14.
 */
"use strict";
var tiles = [];
var idx;
var totalNumPairs = 8;
var remainingNumPairs;
var missed;
var previousImg;
var detectClick;
var gameTimer;

for (idx = 1; idx <= 32; idx++) {
    tiles.push({
        tileNum: idx,
        src: 'img/tile' + idx + '.jpg',
        flipped: false,
        matched: false
    })
}
console.log(tiles);

$(document).ready(function () {
    $('#instructions').click(function () {
        window.alert("Click a tile to reveal its image.\nClick two tiles to match them.\nMatch all images to win!");
    });

    $('#start-game').click(function() {
        resetAllVariables();
        updateGameInfo();
        buildBoard();

        //get starting milliseconds
        var startTime = Date.now();
        gameTimer = window.setInterval(function() {
            var elapsedSeconds = (Date.now() - startTime) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
        }, 1000);

        runGame();
    }); //start game button clicked
});  // document ready function

function updateGameInfo() {
    $('#wrong-matches').text(" " + missed);
    $('#matches-left').text(" " + remainingNumPairs);
    $('#matches-made').text(" " + (totalNumPairs - remainingNumPairs));
}

function flipTile(tile, img) {
    img.fadeOut(100, function() {
        if (tile.flipped) {
            img.attr('src', 'img/tile-back.png');
        } else {
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    });
}

function resetAllVariables() {
    $('#game-board').empty();
    missed = 0;
    detectClick = true;
    previousImg = null;
    remainingNumPairs = totalNumPairs;
    window.clearInterval(gameTimer);
}

function runGame() {
    $('#game-board img').click(function () {
        if(detectClick) {
            var clickedImg = $(this);
            var tile = clickedImg.data('tile');
            if (!tile.flipped) {
                flipTile(tile, clickedImg);
                if (previousImg != null) {
                    var previousTile = previousImg.data('tile');
                    if (previousTile.src == tile.src) {
                        remainingNumPairs--;
                        previousImg = null;
                        if (remainingNumPairs == 0) {
                            window.setTimeout(function() {
                                window.alert("( ͡ᵔ ͜ʖ ͡ᵔ ) You win! ( ͡ᵔ ͜ʖ ͡ᵔ )");
                            }, 250);
                        }
                    } else {
                        detectClick = false;
                        missed++;
                        window.setTimeout(function() {
                            flipTile(tile, clickedImg);
                            flipTile(previousTile, previousImg);
                            previousImg = null;
                            detectClick = true;
                        }, 1000);

                    }
                } else {
                    previousImg = clickedImg;
                }
            }
        }
        updateGameInfo();
    });
}

function buildBoard() {
    tiles = _.shuffle(tiles);
    var selectedTiles = tiles.slice(0, totalNumPairs);
    var tilePairs = [];
    _.forEach(selectedTiles, function(tile) {
        tilePairs.push(tile);
        tilePairs.push(_.clone(tile));
    });
    tilePairs = _.shuffle(tilePairs);
    var gameBoard = $('#game-board');
    var row = $(document.createElement('div'));
    var img;
    _.forEach(tilePairs, function(tile, elemIndex) {
        if (elemIndex > 0 && elemIndex % 4 == 0) {
            gameBoard.append(row);
            row = $(document.createElement('div'));
        }
        img = $(document.createElement('img'));
        img.attr({
            src: 'img/tile-back.png',
            alt: 'tile ' + tile.tileNum
        });
        img.data('tile', tile);
        row.append(img);
    });
    gameBoard.append(row);
}