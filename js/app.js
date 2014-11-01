/**
 * Created by michaeldang on 10/28/14.
 */
"use strict";
var tiles = [];
var idx;
var numPairs = 8;
var remainingPairs;
var missed = 0;
var matched = 0;
var previousImg = null;
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
    $('#start-game').click(function() {
        console.log('start game button clicked!');
        tiles = _.shuffle(tiles);
        var selectedTiles = tiles.slice(0, 8);
        remainingPairs = selectedTiles.length;
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

        //get starting milliseconds
        var startTime = Date.now();
        window.setInterval(function() {
            var elapsedSeconds = (Date.now() - startTime) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
        }, 1000);

        $('#game-board img').click(function () {
            var clickedImg = $(this);
            var tile = clickedImg.data('tile');
            if (!tile.flipped) {
                flipTile(tile, clickedImg);
                if (previousImg != null) {
                    var previousTile = previousImg.data('tile');
                    if (previousTile.src == tile.src) {
                        remainingPairs -= 2;
                        previousImg = null;
                    } else {
                        window.setTimeout(function() {
                            flipTile(tile, clickedImg);
                            flipTile(previousTile, previousImg);
                            previousImg = null;
                        }, 1000);
                    }

                } else {
                    previousImg = clickedImg;
                }
            }
        });
    }); //start game button clicked
});  // document ready function

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