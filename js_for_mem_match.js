/*  Memory Match project v1.0    Vernon Louie    C11.16      11/18/2016     */

var first_card_clicked = null;
var second_card_clicked = null;

var total_possible_matches = 9;
var match_counter = 0;
var attempts = 0;
var accuracy = 0;
var games_played = 0;

$(document).ready(function () {
    var card;
    var slot_a;
    var slot_b;

    $(".back").click(card_clicked);     // Call function card_clicked when clicking on a card
    $(".reset").click(reset_clicked);   // Call function reset_clicked when clicking on the reset button

    randomizedArray = generateRandomCardSlots();
    console.log("randomizedArray: " + randomizedArray);

    // for (var i=1; i < 10; i++) {
    //     if (i === 4) {
    //         card = "pony4.png";
    //         slot_a = "#slot7";
    //         slot_b = "#slot8";
    //     } else {
    //         card = "pony" + i + "b.jpg";
    //         slot_a = "#slot" + i;
    //         slot_b = "#slot" + (i+1);
    //     }
    //
    //     var card_img = $("<img>",
    //         {
    //             src:    card,
    //             alt:    "pony" + i,
    //             width:  90
    //         });
    //
    //     $(slot_a).append(card_img);
    //     $(slot_b).append(card_img);
    //     // $("<img src>").attr("width","95");
    // }

    // var card_img = $("<img src=card alt='pony 3' width='95'>", {
    //     alt:    "pony 3",
    //     width:  95
    // });



});

function generateRandomCardSlots () {
    var array_ordered = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    var array_randomized = [];
    var count = 0;
    var rndm_num;

    while (array_ordered.length > 0) {
        rndm_num = Math.floor(Math.random() * 18);

        for (var j=0; j < array_ordered.length; j++) {
            if (rndm_num === array_ordered[j]) {
                array_ordered.splice(j,1);
                array_randomized.push(rndm_num);
                console.log("array_randomized: " + array_randomized + ".  array_ordered: " + array_ordered);
            }
        }
        console.log("count: " + count++);
    }
    return array_randomized;
}

function resetTwoCards () {
    $(first_card_clicked).toggleClass("make_opaque");
    $(second_card_clicked).toggleClass("make_opaque");
    first_card_clicked = null;
    second_card_clicked = null;
}

function display_stats () {
    $(".games_played .value").text(games_played);
    $(".matches .value").text(match_counter);
    $(".attempts .value").text(attempts);

    var percent_accuracy = accuracy * 100;          // convert to a number betweeen 0 and 100
    percent_accuracy = percent_accuracy.toFixed(1); // round number to 1 decimal point
    $(".accuracy .value").text(percent_accuracy + "%");
}

function reset_stats () {
    accuracy = 0;
    match_counter = 0;
    attempts = 0;
    display_stats();
}

function reset_clicked () {
    // if (match_counter === total_possible_matches) {
        games_played++;  // only if player has completed game then player gets credit for a game played
        console.log('games played: ' + games_played);
    // }

    reset_stats();
    $(".back").removeClass("make_opaque"); // card backs are put back in place by making them visible again
    $('#game_area h3').remove(); // removes h3 element containing "You have won! Word to the mother!"
    $(".reset").click(reset_clicked);   // Call function reset_clicked when clicking on the reset button
}

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
        // console.log("attempts: ", attempts);

        if (first_img == second_img) {
            match_counter++;
            accuracy = match_counter / attempts;
            display_stats();

            first_card_clicked = null;
            second_card_clicked = null;
            // console.log("match counter is: ", match_counter);

            if (match_counter === total_possible_matches) {
                $('#game_area').append("<h3>You have won!  Word to the mother!</h3>");
            }
            else {
                return;
            } // end of 3rd if block
        }
        else {
            setTimeout(resetTwoCards, 1500);
            return;
        } // end of 2nd if block

    } // end of 1st if block

} // end of function card_clicked