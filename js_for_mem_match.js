/*  Vernon Louie     March 2017     */

var theme = "pokemon";
var first_card_clicked = null;
var second_card_clicked = null;

var total_possible_matches = 2;         // win condition
var match_counter = 0;
var attempts = 0;
var accuracy = 0;
var games_played = 0;

$(document).ready(function () {
    insertTitle();
    insertFrontCards();
    insertBackCards();
    $(".lift").click(lift_clicked);     // "Lift Cards" button
    $(".back").click(card_clicked);     // card back
    $(".reset").click(reset_clicked);   // "Reset Game" button

});

function insertTitle () {
    if (theme === "pokemon") {
        $('.title h2').prepend("Pokemon ").css("font-family", "pokeFont").css("color", "yellow");
    } else {
        $('.title h2').prepend("My Little Pony ").css("font-family", "kinkie").css("color", "rebeccapurple");
    }
}

/* Called by "$(document).ready" and "reset_clicked".  Appends the 9 card fronts (2x) randomly into the 18 slots. */
function insertFrontCards () {
    var card;
    var card_img;
    var slot;
    var randomizedArray;

    randomizedArray = generateRandomCardSlots();

    for (var h=0; h <= 9; h+=9) {
        for (var i=1; i <= 9; i++) {            // go thru this loop 2x, when h=0 and h=9.
            if (theme === "pokemon") {
                if (i === 3 || i === 4) {
                    card = "images/pkmn_" + i + ".png";
                } else {
                    card = "images/pkmn_" + i + ".jpg";
                }

            } else {    // My Little Pony theme
                if (i === 4) {
                    card = "images/pony4b.png";     // pony4 is a png; all the rest are jpg
                } else {
                    card = "images/pony" + i + "b.jpg";
                }
            }

            card_img = $("<img>",
                {
                    src:    card,
                    alt:    "pony or pkmn" + i,
                    class:  "card_front"
                });
            slot = "#slot" + randomizedArray[i-1+h] + " .front";
            $(slot).append(card_img);
        }
    }
    $("img").width("90%").height("100%");
}

/* Called by "$(document).ready".  This function is called only once, since the card backs are never destroyed/removed. */
function insertBackCards () {
    var card_img;
    var slot;

    if (theme === "pokemon") {
        imageForBackCard = "images/card_back_pkmn.png";
    } else {
        imageForBackCard = "images/card_back_ponyb.jpg";
    }

    for (var i=0; i <= 17; i++) {
        slot = "#slot" + i + " .back";

        card_img = $("<img>",
            {
                src:    imageForBackCard,
                alt:    "back of card"
            });

        $(slot).append(card_img);
    }
    $("img").width("90%").height("100%");
}

/* Called by "insertFrontCards".  Takes an array (18 elements long) and returns an array of the same elements in random order. */
function generateRandomCardSlots () {
    var array_ordered = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    var array_randomized = [];
    var rndm_num1;

    while (array_ordered.length > 0) {
        rndm_num1 = Math.floor(Math.random() * 18);

        for (var j=0; j < array_ordered.length; j++) {
            if (rndm_num1 === array_ordered[j]) {
                array_ordered.splice(j,1);          // remove element from original array if rndm_num matches that element
                array_randomized.push(rndm_num1);
            }
        }
    }
    return array_randomized;
}

/* Called by "card_clicked".  Assuming there are 2 cards clicked and therefore opaque (card front is visible), makes the card back visible so card front is no longer visible to user. */
function resetTwoCards () {
    $(first_card_clicked).toggleClass("make_opaque");
    $(second_card_clicked).toggleClass("make_opaque");
    first_card_clicked = null;
    second_card_clicked = null;
}

/* Called by multiple functions.  Generates or affects text in "stats" area (left_side div). */
function display_stats () {
    $(".games_played .value").text(games_played);
    $(".matches .value").text(match_counter);
    $(".attempts .value").text(attempts);

    var percent_accuracy = accuracy * 100;          // convert to a number betweeen 0 and 100
    percent_accuracy = percent_accuracy.toFixed(1); // round number to 1 decimal point
    $(".accuracy .value").text(percent_accuracy + "%");
}

/* Called by "reset_clicked".  Resets to zero and then displays. */
function reset_stats () {
    accuracy = 0;
    match_counter = 0;
    attempts = 0;
    display_stats();
}

/* Called by "Lift Cards" button.  "Lifts" card backs for 1/2 second so users can see card fronts momentarily. */
function lift_clicked () {
    var audioOhNo = document.getElementById("ohNo");
    audioOhNo.play();

    $(".back").toggleClass("make_opaque");
    setTimeout(function() {$(".back").toggleClass("make_opaque")}, 500);
}

/* Called by: "Reset button".  Removes vestiges of old game and sets up for new game. */
function reset_clicked () {
    var audioCardShuffle = document.getElementById("cardShuffle");
    audioCardShuffle.play();
    reset_stats();

    $('#game_area h3').remove();            // remove h3 element "You have won!"
    $(".card_front").remove();              // remove the old card front elements
    insertFrontCards();
    $(".back").removeClass("make_opaque").removeClass("matched");  // card backs are put back in place by making them visible again
    $(".reset").click(reset_clicked);       // Call function reset_clicked when clicking on the reset button
}

/* Called by: "card_clicked".  Plays sound clip and flips over the 1 card that was clicked on. */
function flip_card (cardBack) {
    var audioCardFlip = document.getElementById("cardFlip");
    audioCardFlip.play();

    $(cardBack).toggleClass("make_opaque");
}

/* Called by: "card_clicked".  Removes old phrase, if any, and displays phrase "Choose an unflipped card" in a random color. */
function card_already_flipped () {
    var rndm_num2;
    var phrase_color;
    var colorArray = ["purple", "deeppink", "blue", "darkblue", "magenta", "hotpink", "darkmagenta", "green", "darkgreen"];

    $('#game_area h3').remove();

    rndm_num2 = Math.floor(Math.random() * 9);
    phrase_color = colorArray[rndm_num2];
    $('#game_area').append("<h3> Choose an unflipped card </h3>");
    $('#game_area h3').css("color", phrase_color);
}

/* If 1st card clicked, then simply shows card front.  If 2nd card clicked, then checks to see if there is a match with the 1st card. */
function card_clicked () {
    // var audioCardFlip;
    var audioYeah;
    var audioSuccess;

    var first_img;
    var second_img;

    var rndm_num3;
    var phrase;
    var phrase_element;
    var winningPhrasesArray_pokemon =
        [
            "You have won!  Word to the mother!",
            "Squirtle says you're the best!",
            "Congratulations!  Pikachu's coming to high-five you!",
            "You finished!  Ivysaur will now eat you!",
            "Oh Yeah...Bulbasaur is proud of you!"
        ];
    var winningPhrasesArray_pony =
        [
            "You've won!  Fluttershy can sparkle!",
            "Great!  Pinkie Pie will get a perm for her mane!",
            "Well done, Rainbow Dash is showing her true colors!",
            "You got them all...Princess Luna is proud of you!",
            "Well played...Twilight Sparkle can fly again!"
        ];

    if ($(this).hasClass("matched")) {
        card_already_flipped();

    } else {
        if (first_card_clicked === null) {
            first_card_clicked = this;
            flip_card(this);
            $('#game_area h3').remove();
        }
        else if (second_card_clicked === null) {
            second_card_clicked = this;
            if (first_card_clicked === second_card_clicked) {
                card_already_flipped();
                second_card_clicked = null;

            } else {
                $('#game_area h3').remove();
                flip_card(this);

                attempts++;
                accuracy = match_counter / attempts;
                display_stats();

                first_img = $(first_card_clicked).parent().children(".front").find("img").attr('src');
                second_img = $(second_card_clicked).parent().children(".front").find("img").attr('src');

                if (first_img === second_img) {                     // if legitimate match
                    audioYeah = document.getElementById("yeah");
                    audioYeah.play();

                    $(first_card_clicked).addClass("matched");
                    $(second_card_clicked).addClass("matched");

                    match_counter++;
                    accuracy = match_counter / attempts;
                    display_stats();

                    first_card_clicked = null;
                    second_card_clicked = null;

                    if (match_counter === total_possible_matches) {
                        audioSuccess = document.getElementById("success");
                        audioSuccess.play();

                        rndm_num3 = Math.floor(Math.random() * 5);
                        if (theme === "pokemon") {
                            phrase = winningPhrasesArray_pokemon[rndm_num3];
                        } else {
                            phrase = winningPhrasesArray_pony[rndm_num3];
                        }

                        phrase_element = $("<h3>",
                            {
                                text:   phrase
                            });
                        $('#game_area').append(phrase_element);
                        // $('#game_area h3').css("color", "purple");

                        if (theme === "pokemon") {
                            $('#game_area h3').css("font-family", "pokeFont").css("color", "yellow");
                        } else {
                            $('#game_area h3').css("font-family", "kinkie").css("color", "rebeccapurple");
                        }

                        games_played++;
                    }
                }
                else {
                    setTimeout(resetTwoCards, 1500);
                }
            }
        }
        else {  // This handles the case where you click on more than 2 cards; i.e., doesn't do anything
            console.log("2 cards have already been clicked");
        }
    }
}