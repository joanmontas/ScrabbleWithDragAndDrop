/*
	Name: Joan Montas
	Email: Joan_Montas@student.uml.edu
	File: multable.js
	GUI Assignment: GUI, HW5:  Implementing a Bit of Scrabble with Drag-and-Drop
	Date:06/29/2023
	Description: Implementing a Bit of Scrabble with Drag-and-Drop.
    Implemented using some basic bootstrap functionality.
	Copyright (c) 2023 by Joan Montas. All rights reserved.
*/

// hyper global
const originaldatadistribution = 
  // "Cross origin requests are only supported for HTTP." error when loading a local file
  // so I prevented it using this
  {"pieces": [
	{"letter":"A", "value":1, "amount":9},
	{"letter":"B", "value":3, "amount":2},
	{"letter":"C", "value":3, "amount":2},
	{"letter":"D", "value":2, "amount":4},
	{"letter":"E", "value":1, "amount":12},
	{"letter":"F", "value":4, "amount":2},
	{"letter":"G", "value":2, "amount":3},
	{"letter":"H", "value":4, "amount":2},
	{"letter":"I", "value":1, "amount":9},
	{"letter":"J", "value":8, "amount":1},
	{"letter":"K", "value":5, "amount":1},
	{"letter":"L", "value":1, "amount":4},
	{"letter":"M", "value":3, "amount":2},
	{"letter":"N", "value":1, "amount":5},
	{"letter":"O", "value":1, "amount":8},
	{"letter":"P", "value":3, "amount":2},
	{"letter":"Q", "value":10, "amount":1},
	{"letter":"R", "value":1, "amount":6},
	{"letter":"S", "value":1, "amount":4},
	{"letter":"T", "value":1, "amount":6},
	{"letter":"U", "value":1, "amount":4},
	{"letter":"V", "value":4, "amount":2},
	{"letter":"W", "value":4, "amount":2},
	{"letter":"X", "value":8, "amount":1},
	{"letter":"Y", "value":4, "amount":2},
	{"letter":"Z", "value":10, "amount":1}
],
"creator":"Ramon Meza"
};

const letterskins = {
  "A" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_A.jpg",
  "B": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_B.jpg",
  "C": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_C.jpg",
  "D": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_D.jpg",
  "E": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_E.jpg",
  "F": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_F.jpg",
  "G": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_G.jpg",
  "H": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_H.jpg",
  "I": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_I.jpg",
  "J": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_J.jpg",
  "K": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_K.jpg",
  "L": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_L.jpg",
  "M": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_M.jpg",
  "N": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_N.jpg",
  "O": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_O.jpg",
  "P": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_P.jpg",
  "Q": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_Q.jpg",
  "R": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_R.jpg",
  "S": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_S.jpg",
  "T": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_T.jpg",
  "U": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_U.jpg",
  "V": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_V.jpg",
  "W": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_W.jpg",
  "X": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_X.jpg",
  "Y": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_Y.jpg",
  "Z": "./graphics_data/Scrabble_Tiles/Scrabble_Tile_Z.jpg",
};

// global
var availablecharacter;
var $currentdatadistribution;
var lettersinboard =  new Array(15); // keeps track of which letter is where
var numberoflettersonboard;
var hand = {};                        // will hold available hand
var previousroundscore = 0;

// (4) board includes bonus square
const $doublewordscore = [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1];
const $doubleletterscore = [1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1];

/*
  @description    Given an alphabetical character returns 
                  numerical value
  *@param Name    c - character whose value to find
  *@return        integer
  *@throws        None
*/
function lettertonumber(c) {
  // letter to array
  return c.charCodeAt() - "A".charCodeAt();
}

/*
  @description    Shuffle given array in place
  *@param Name    a - character array to be randomized
  *@return        None
  *@throws        None
*/
function knuthshuffle(a) {
  // in place knuth-shuffle
  // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  for (var i = 0; i < a.length; i++) {
    // https://www.w3schools.com/js/js_random.asp
    var j = Math.floor(Math.random() * i);
    var temp = a[i];
    a[i] = a[j]
    a[j] = temp;
  }
}

/*
  @description    Creates a randomized character array based on
                  The original distribution of letters
  *@param Name    None
  *@return        Character array
  *@throws        None
*/
function randomdistributioncalculation() {
  var temparray = [];
  for (var i = 0; i < (originaldatadistribution["pieces"]).length; i++) {
    var $ii = originaldatadistribution["pieces"][i];
    for (var j = 0; j < $ii["amount"]; j++) {
      temparray.push($ii["letter"]);
    }
  };
  knuthshuffle(temparray);
  return temparray;
}

/*
  @description    Select a random letter from available pieces
                  Updates the currentdatadistribution of letters
  *@param Name    None
  *@return        character
  *@throws        "No more available pieces" - if out of pieces
*/
function getletter () {
  // (4) letters tiles in the player's "hand" are selected randomly from a data structure with
  // proper distribution of the letters
  // we are consenting adults... call at own cost
  if (availablecharacter.length == 0) {
    throw "No more available pieces";
  }
  var ran = Math.floor(Math.random() * (availablecharacter.length) -1 );

  var a = availablecharacter.pop(ran);

  var anumerical = lettertonumber(a);
  $currentdatadistribution["pieces"][anumerical].amount = $currentdatadistribution["pieces"][anumerical].amount - 1;
  return a;
}

/*
  @description    Creates a randomized character array based on
                  The original distribution of letters
  *@param Name    None
  *@return        Character array
  *@throws        None
*/
function gettile(a) {
  $tempelement = $("<div class=" + "\"" + a +" tile\""+ "></div>");
  $tempelement.draggable({revert:true});
  $tempelement.css("background-image", "url(" +letterskins[a]+")");
  return $tempelement;
};

/*
  @description    Modify all the dropable classes to accept
                  Draggables again
  *@param Name    None
  *@return        None
  *@throws        None
*/
function resetdropableclass() {
  var $onelinescrableboards = $("#onelinescrableboards div");
  for (var i = 0; i < $onelinescrableboards.length; i++) {
    $($onelinescrableboards[i]).droppable({ disabled: false});
  };
};

/*
  @description    Looks at the word currently placed in the board
                  It thens modifies the "#word" to display such
                  word to the user
  *@param Name    None
  *@return        None
  *@throws        None
*/
function getwordintable() {
  var tempstring = "";
  for (var i = 0; i < lettersinboard.length; i++) {
    if (lettersinboard[i] != 0) {
      tempstring += lettersinboard[i];
    }
  }
  $("#word").text(tempstring);
}

/*
  @description    Calculates the current score, accounting for
                  double word, double letter and letter value.
                  The previous round's score is also added to
                  have proper value
  *@param Name    None
  *@return        None
  *@throws        None
*/
function getscore() {

  var i = 0;
  var tempscore = 0;
  var doublewordcount = 1;
  // find first letter
  for (i = 0; i < lettersinboard.length; i++) {
    if (lettersinboard[i] != 0) {
      break;
    };
  }

  for (i = i; i < lettersinboard.length; i++) {
    var a = lettersinboard[i];
    if (a == 0) {
      break;
    };

    // (4) score is tallied correctly, including consideration of bonus square
    // multipliers
    if ($doublewordscore[i] == 2) {
      doublewordcount *= 2;
    }

    var anumerical = lettertonumber(a);
    var avalue = originaldatadistribution["pieces"][anumerical]["value"];
    if ($doubleletterscore[i] == 2) {
      tempscore += (avalue)*2
    } else {
      tempscore += avalue;
    }
  }
  tempscore *= doublewordcount
  tempscore += previousroundscore;
  $("#score").text(tempscore);
}

/*
  @description    Close the alert indicating user ran out of tiles
                  and reset the board
  *@param Name    None
  *@return        None
  *@throws        None
*/
function acknowledgeendofgame() {
  $("#endofgame").hide();
  resetscrabble();
}

/*
  @description    Setups up the initial property of the droppable and 
                  draggable widget. Sets up its functionality and
                  interactivity
  *@param Name    None
  *@return        None
  *@throws        None
*/
function setupwidgetproperty() {
    /* https://jqueryui.com/droppable/#default */

  $( ".onelinescrableboardtab" ).droppable({
    drop: function( event, ui ) {

      // (4) program identifies which letter title is dropped onto which Scrabble square
      // get info of the tile dropped
      var chartype = $(ui.draggable[0]).attr("class")[0];
      var tablelocation = parseInt($(this).attr("id")[3], 16);
      // (2) Except for the first letter, all sub-subsequent letters must be placed directly next to or below
      // another letter with no space. Else, they will bounce back to the “rack”.
      if (numberoflettersonboard != 0) {
        // valid range
        if ((tablelocation-1 > -1 & lettersinboard[tablelocation-1] == 0) & (tablelocation+1 < 15 & lettersinboard[tablelocation+1] == 0)) {
          return;
        }
        // edge case
        if ((tablelocation == 0 & lettersinboard[1] == 0) | (tablelocation == 14 & lettersinboard[13] == 0)) {
          return;
        }
      }
      // (4) program identifies which letter tile is dropped onto which Scrabble square
      $("#whatdroppedwhere").text("The tile \"" + chartype +"\" was dropped in table location " + tablelocation.toString());

      numberoflettersonboard++;

      if (hand[chartype] != undefined) {
        hand[chartype] -= 1;
        if (hand[chartype] == 0) {
          delete hand[chartype];
        }
      }

      lettersinboard[tablelocation] = chartype;

      getwordintable();
      getscore();
    
      var $this = $(this);
      // https://stackoverflow.com/questions/26746823/jquery-ui-drag-and-drop-snap-to-center
      ui.draggable.position({
        my: "center",
        at: "center",
        of: $this,
        using: function(pos) {
          $(this).animate(pos, 200, "linear");
        }
      });

      /*(2) Tiles can only be dragged from the “rack” to Scrabble board. If the user drop them anywhere
      else, they will be bounced back to the \"rack\"*/
      ui.draggable.draggable({
        revert: "invalid"
      }),

      // (4) letter tiles can be dragged-and-dropped onto target Scrable square
      // "(2) Once the tile is placed on the Scrabble board, it can not be moved"
      ui.draggable.draggable({
        disabled: true
      }),
      $this.droppable({ disabled: true}); // prevent other fromt dropping
      if (numberoflettersonboard >= 7) {
        submitscrabble();
      }

      // https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
      // Warned not to use Object.key as is O(n)... oh well...
      if (availablecharacter.length == 0 & Object.keys(hand).length == 0) {
        $("#scoreend").text($("#score").text());
        $("#endofgame").show();
      };
    }
  });

  $( ".tile" ).draggable({
    revert: true
  });

  $( "#rack" ).droppable({
    drop: function( event, ui ) {
      console.log("dropped in rack");
    }
  });
};

/*
  @description    Creates the initial 7 letters of the widget
  *@param Name    None
  *@return        None
  *@throws        None
*/
function dynamicallygeneratewidget(){
  // generate distribution table
  for (var i = 0; i < originaldatadistribution["pieces"].length; i++) {
    var l = originaldatadistribution["pieces"][i]["letter"];
    var a = originaldatadistribution["pieces"][i]["amount"];
    $("th:contains(\""+l+"\")").text(" "+l+"-"+a+"");
  }
  $("p:contains(\"BLANK\")").text("BLANK-2");

  // generate initial 7 letteers
  var $rowdiv = $("#rack").find(".row");
  for (var i = 0; i < 7; i++) {
    try {
      var chartype = getletter();
    } catch (error) {
      return;
    }
    var $tempelement = gettile(chartype);
    if (hand[chartype] == undefined) {
      hand[chartype] = 0;
    }
    hand[chartype] += 1;
    var l = $tempelement.attr("class")[0];
    var anumerical = lettertonumber(l);
    var a =  $currentdatadistribution["pieces"][anumerical].amount;
    $("th:contains(\""+l+"\")").text(" "+l+"-"+a+"");
    $rowdiv.append($tempelement);
  };
};

/*
  @description    Initialize the reset process. Resets hand, remove board
                  piecease, score, and words
  *@param Name    None
  *@return        None
  *@throws        None
*/
function resetscrabble() {
  // (2) user can always restart the game.
  // https://stackoverflow.com/questions/4120475/how-to-create-and-clone-a-json-object
  // why can I modify an inmutable object?!?! ok... whatever
  $currentdatadistribution = {};
  $currentdatadistribution = JSON.parse(JSON.stringify(originaldatadistribution));

  // reset available character
  availablecharacter = randomdistributioncalculation();

  // remove pieaces
  $("#racksrow div").remove()
  for (var i = 0; i < 15; i++) {
      lettersinboard[i] = 0;
  }

  // hand is cleared
  hand = {};

  numberoflettersonboard = 0;
  resetdropableclass();
  // generates widges again
  dynamicallygeneratewidget();

  // (3) score is kept for multiple words until the user restart a new game
  $("#score").text("0");
  $("#word").text("");
  previousroundscore = 0;

  $("#endofgame").hide();
};

/*
  @description    Submit current word, toast validity and replenish
                  titles used.
  *@param Name    None
  *@return        None
  *@throws        None
*/
function submitscrabble() {
  // (2 points) Validating to see if a word that the user enters is valid
  // https://www.w3schools.com/jquery/ajax_ajax.asp
  var validity = "invalid";
  $.ajax({
    async: false,
    type: 'GET',
    url: "https://api.dictionaryapi.dev/api/v2/entries/en/" + $("#word").text(),
    success: function(data) {
      validity = "valid";
      $("#toastwordvaliditybody").text($("#word").text() + " is a(n) " + validity + " word");
    },
    error: function (xhr, status, error) {
      console.log("not such word");
    $("#toastwordvaliditybody").text($("#word").text() + " is a(n) " + validity + " word");
    }
  });

  $("#toastwordvalidity").toast("show");
  // (3) the board is cleared after each round so that a new word can be played
  // remove pieaces
  // clear tiles
  $("#racksrow div").remove();
  for (var i = 0; i < 15; i++) {
      lettersinboard[i] = 0;
  }

  numberoflettersonboard = 0;

  resetdropableclass();
  // (3) after playing a word, only the number of letter tiles needed to bring the
  // player's "hand" back to 7 tiles are selected
  // replenish rack
  var handcount = 0;
  var $rowdiv = $("#rack").find(".row");
  for (var i in hand) {
    for (var j = 0; j < hand[i]; j++) {
      var chartype = i;
      var $tempelement = gettile(chartype);
      var l = $tempelement.attr("class")[0];
      $rowdiv.append($tempelement);
      handcount += 1;
    }
  }
  for (var i = handcount; i < 7; i++) {
    try {
      var chartype = getletter();
    } catch (error) {
      return;
    }
    var $tempelement = gettile(chartype);
    if (hand[chartype] == undefined) {
      hand[chartype] = 0;
    }
    hand[chartype] += 1;
    var l = $tempelement.attr("class")[0];
    var anumerical = lettertonumber(l);
    var a =  $currentdatadistribution["pieces"][anumerical].amount;
    $("th:contains(\""+l+"\")").text(" "+l+"-"+a+"");
    $rowdiv.append($tempelement);
  }
  $("#word").text("");
  previousroundscore =  parseInt($("#score").text(), 10);
  console.log("Previouscore saved: ",previousroundscore);
  $("#whatdroppedwhere").text("");

}

/*
  @description    Main entry of the program running initial widget property
                  and utilizing reset function to clear boards
  *@param Name    None
  *@return        None
  *@throws        None
*/
$(document).ready(function(){
  // main entry
  setupwidgetproperty();
  resetscrabble();
  $("#endofgame").hide();
})