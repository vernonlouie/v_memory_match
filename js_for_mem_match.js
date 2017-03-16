/*  Vernon Louie     March 2017     */

var first_card_clicked = null;
var second_card_clicked = null;

var total_possible_matches = 9;
var match_counter = 0;
var attempts = 0;
var accuracy = 0;
var games_played = 0;

$(document).ready(function () {
    insertFrontCards();
    insertBackCards();
    $(".lift").click(lift_clicked);     // Call function lift_clicked when clicking on "Lift Cards" button
    $(".back").click(card_clicked);     // Call function card_clicked when clicking on a card back
    $(".reset").click(reset_clicked);   // Call function reset_clicked when clicking on the "Reset Game" button
});

/* Appends the 9 card fronts (2x) randomly into the 18 slots. */
function insertFrontCards () {
    var card;
    var card_img;
    var slot;
    var randomizedArray;

    randomizedArray = generateRandomCardSlots();

    for (var h=0; h <= 9; h+=9) {
        for (var i=1; i <= 9; i++) {            // go thru this loop 2x, when h=0 and h=9.
            if (i === 4) {
                card = "images/pony4b.png";     // pony4 is a png; all the rest are jpg
            } else {
                card = "images/pony" + i + "b.jpg";
            }

            slot = "#slot" + randomizedArray[i-1+h] + " .front";

            card_img = $("<img>",
                {
                    src:    card,
                    alt:    "pony" + i,
                    class:  "card_front"
                });

            $(slot).append(card_img);
        }
    }
    $("img").width("90%").height("100%");
}

function insertBackCards () {
    var card_img;
    var slot;

    for (var i=0; i <= 17; i++) {
        slot = "#slot" + i + " .back";

        card_img = $("<img>",
            {
                src:    "images/card_back_ponyb.jpg",
                alt:    "back of card"
            });

        $(slot).append(card_img);
    }
    $("img").width("90%").height("100%");
}

/* Takes an array (18 elements long) and returns an array of the same elements in random order. */
function generateRandomCardSlots () {
    var array_ordered = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    var array_randomized = [];
    var rndm_num;

    while (array_ordered.length > 0) {
        rndm_num = Math.floor(Math.random() * 18);

        for (var j=0; j < array_ordered.length; j++) {
            if (rndm_num === array_ordered[j]) {
                array_ordered.splice(j,1);          // remove element from original array if rndm_num matches that element
                array_randomized.push(rndm_num);
            }
        }
    }
    return array_randomized;
}

/* Assuming there are 2 cards clicked and therefore opaque (card front is visible), makes the card back visible so card front is no longer visible to user. */
function resetTwoCards () {
    $(first_card_clicked).toggleClass("make_opaque");
    $(second_card_clicked).toggleClass("make_opaque");
    first_card_clicked = null;
    second_card_clicked = null;
}

/* Generates or affects text in "stats" area (left_side div). */
function display_stats () {
    $(".games_played .value").text(games_played);
    $(".matches .value").text(match_counter);
    $(".attempts .value").text(attempts);

    var percent_accuracy = accuracy * 100;          // convert to a number betweeen 0 and 100
    percent_accuracy = percent_accuracy.toFixed(1); // round number to 1 decimal point
    $(".accuracy .value").text(percent_accuracy + "%");
}

/* Resets to zero and then displays. */
function reset_stats () {
    accuracy = 0;
    match_counter = 0;
    attempts = 0;
    display_stats();
}

/* "Lifts" card backs for 1/2 second so users can see card fronts momentarily. */
function lift_clicked () {
    var audioOhNo = document.getElementById("ohNo");
    audioOhNo.play();

    $(".back").addClass("make_opaque");
    setTimeout(function() {$(".back").removeClass("make_opaque")}, 500);
}

/* Removes vestiges of old game and sets up for new game. */
function reset_clicked () {
    var audioCardShuffle = document.getElementById("cardShuffle");
    audioCardShuffle.play();
    reset_stats();

    $('#game_area h3').remove();            // remove h3 element "You have won!"
    $(".card_front").remove();              // remove the old card front elements
    insertFrontCards();
    $(".back").removeClass("make_opaque");  // card backs are put back in place by making them visible again
    $(".reset").click(reset_clicked);       // Call function reset_clicked when clicking on the reset button
}

/* If 1st card clicked, then simply shows card front.  If 2nd card clicked, then checks to see if there is a match with the 1st card. */
function card_clicked () {
    $(this).toggleClass("make_opaque");
    var audioCardFlip = document.getElementById("cardFlip");
    audioCardFlip.play();

    if (first_card_clicked === null) {
        first_card_clicked = this;
    }
    else {
        second_card_clicked = this;

        attempts++;
        accuracy = match_counter / attempts;
        display_stats();

        var first_img = $(first_card_clicked).parent().children(".front").find("img").attr('src');
        var second_img = $(second_card_clicked).parent().children(".front").find("img").attr('src');

        if (first_img == second_img) {
            var audioYeah = document.getElementById("yeah");
            audioYeah.play();

            match_counter++;
            accuracy = match_counter / attempts;
            display_stats();

            first_card_clicked = null;
            second_card_clicked = null;

            if (match_counter === total_possible_matches) {
                $('#game_area').append("<h3>You have won!  Word to the mother!</h3>");
                games_played++;
                var audioSuccess = document.getElementById("success");
                audioSuccess.play();
            }
        }
        else {
            setTimeout(resetTwoCards, 1500);
        }
    }
}