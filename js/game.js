function getSeedFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('seed');
}

function generateRandomSeed() {
  return Math.floor(Math.random() * 1000000).toString();
}

let seed = getSeedFromURL() || generateRandomSeed();

$('#seedDisplay').text(seed);

let rng = new Math.seedrandom(seed);

var allPics = [];

$.ajax({
  url: '/blob/live/img/',
  success: function (data) {
    $(data).find('a').attr('href', function (i, val) {
      if (val.match(/\.(jpe?g|png|gif)$/)) {
        allPics.push('/img/'+ val);
      }
    });
    setupGame();
  }
});
var selectedPics = [];

function myCharacter() {
  const playerSeed = generateRandomSeed();
  const playerRng = new Math.seedrandom(playerSeed);

  var remainingPics = selectedPics.slice();

  var opponentCharacterIndex = remainingPics.indexOf(opponentCharacter);
  if (opponentCharacterIndex !== -1) {
    remainingPics.splice(opponentCharacterIndex, 1);
  }

  if (remainingPics.length > 0) {
    var myPicIndex = Math.floor(playerRng() * remainingPics.length);
    var myPic = remainingPics[myPicIndex];

    console.log(myPic);

    $("#me").html('<img src="' + myPic + '">');

    var name = myPic.split('.jpg')[0];
    name = name.split('/').pop().split('%20').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    $("#name").html('You are ' + name);
  } else {
    console.error("No remaining pictures available for myCharacter");
  }
}

function displayRandomPhotos() {
  $('#gameboard').html('');
  console.log("displayRandomPhotos");
  var allPicsCopy = allPics.slice();

  for (var i = allPicsCopy.length - 1; i > 0; i--) {
    var j = Math.floor(rng() * (i + 1));
    var temp = allPicsCopy[i];
    allPicsCopy[i] = allPicsCopy[j];
    allPicsCopy[j] = temp;
  }

  selectedPics = allPicsCopy.slice(0, 15);

  if (selectedPics.length > 0) {
    var opponentCharacterIndex = Math.floor(rng() * selectedPics.length);
    opponentCharacter = selectedPics[opponentCharacterIndex];
    console.log(opponentCharacter);

    for (var i = 0; i < selectedPics.length; i++) {
      var cardContainer = $('<div class="card-container">');
      cardContainer.append('<div class="card"><img src="' + selectedPics[i] + '"></div>');

      var name = selectedPics[i].split('.jpg')[0];
      name = name.split('/').pop().split('%20').map(function (part) {
        return part.charAt(0).toUpperCase() + part.slice(1);
      }).join(' ');

      cardContainer.append('<div class="card-name">' + name + '</div>');

      $("#gameboard").append(cardContainer);
    }
  } else {
    console.error("No pictures available in selectedPics");
  }
}

function setupGame() {
  console.log("Setup game called");
  displayRandomPhotos();
  myCharacter();

  $("#gameboard").on('click', '.card', function () {
    $(this).toggleClass("flipped");
  });

  var win = 0;
  var loss = 0;

  $('#score').html(win + ' - ' + loss);

  function updateScore(win, loss) {
    $('#score').html(win + ' - ' + loss);
  }

  $('#win').click(function () {
    win += 1;
    updateScore(win, loss);
    reset();
  });

  $('#loss').click(function () {
    loss += 1;
    updateScore(win, loss);
    reset();
  });
}

function reset() {
  $('#customPopup').css('display', 'flex');

  $('#yesButton').click(function () {
    $('#customPopup').css('display', 'none');
    $('#gameboard').html('');
    selectedPics = [];
    displayRandomPhotos();
    myCharacter();
  });

  $('#noButton').click(function () {
    $('#customPopup').css('display', 'none');
    alert('Thanks for playing!');
  });

  $('#cancelButton').click(function () {
    $('#customPopup').css('display', 'none');
  });
}

$(window).on('load', function () {
  setTimeout(function () {
    $('.loader').fadeOut();
    if (typeof setupGameCalled === 'undefined') {
      setupGameCalled = true;
      setupGame();
    }
  }, 4000);

  setupGame();
});

$(document).on('submit', '#roomCodeForm', function (event) {
  event.preventDefault();

  const enteredSeed = $('#roomCodeInput').val();

  if (enteredSeed && !isNaN(enteredSeed)) {
    seed = enteredSeed;
    $('#seedDisplay').text(seed);
    rng = new Math.seedrandom(seed);

    location.href = `?seed=${seed}`;
  }
});
