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
    $(".lift").click(lift_clicked);
    $(".back").click(card_clicked);     // Call function card_clicked when clicking on a card
    $(".reset").click(reset_clicked);   // Call function reset_clicked when clicking on the reset button
});

/* Appends the 9 card fronts (2x) randomly into the 18 slots. */
function insertFrontCards () {
    var card;
    var card_img;
    var slot;

    randomizedArray = generateRandomCardSlots();

    for (var h=0; h <= 9; h+=9) {
        for (var i=1; i <= 9; i++) {            // go thru this loop 2x, when h=0 and h=9.
            if (i === 4) {
                card = "images/pony4b.png";     // pony4 is a png; all the rest are jpg
            } else {
                card = "images/pony" + i + "b.jpg";
            }

            slot = "#slot" + randomizedArray[i-1+h];

            card_img = $("<img>",
                {
                    src:    card,
                    alt:    "pony" + i,
                    width:  85
                });

            $(slot).append(card_img);
        }
    }
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
                array_ordered.splice(j,1);
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
    $(".back").addClass("make_opaque");
    setTimeout(function() {$(".back").removeClass("make_opaque")}, 500);
}

/* */
function reset_clicked () {
    // if (match_counter === total_possible_matches) {
        games_played++;  // only if player has completed game then player gets credit for a game played
        console.log('games played: ' + games_played);
    // }

    reset_stats();
    $(".back").removeClass("make_opaque"); // card backs are put back in place by making them visible again
    $('#game_area h3').remove(); // removes h3 element containing "You have won! Word to the mother!"
    $(".front").remove();   // remove the card front elements
    insertFrontCards();
    $(".reset").click(reset_clicked);   // Call function reset_clicked when clicking on the reset button
}

/* If 1st card clicked, then simply shows card front.  If 2nd card clicked, then checks to see if there is a match with the 1st card. */
function card_clicked () {
    $(this).toggleClass("make_opaque");

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
            match_counter++;
            accuracy = match_counter / attempts;
            display_stats();

            first_card_clicked = null;
            second_card_clicked = null;

            if (match_counter === total_possible_matches) {
                $('#game_area').append("<h3>You have won!  Word to the mother!</h3>");
            }
        }
        else {
            setTimeout(resetTwoCards, 1500);
        }
    }
} // end of function card_clicked