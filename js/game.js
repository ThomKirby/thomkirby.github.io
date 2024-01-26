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


$(window).on('load', function () {
  setTimeout(function () {
      $('.loader').fadeOut();
  }, 4000);
});


var allPics = [
  "Adam Botha.jpg", "Adolph Janse van Rensburg.jpg", "Adriaan Johannes du Toit", "Aidan Akdogan.jpg", "Akshay Lalla.jpg",
  "Albert Kleynhans.jpg", "Albert Matthee.jpg", "Alexander Warrington.jpg", "Andrikus Huisamen.jpg",
  "Ayabonga Hlumkeza.jpg", "Benediction Bahumile.jpg", "Benjamin Shirley.jpg", "Bomi Khawula.jpg",
  "Bradley Tristan du Toit.jpg", "Bulelani Mazibuko.jpg", "Byron Frans.jpg", "Caleb Marais.jpg",
  "Cameron Burchell.jpg", "Cameron van Coller.jpg", "Charl de Beer.jpg", "Christopher Cocks.jpg", "Corné Prinsloo.jpg",
  "Daniel Kok.jpg", "Deomarco Rhode.jpg", "Dirk Bester.jpg", "Ebube Onyeme.jpg",
  "Eduard Albertyn.jpg", "Emile Hendricks.jpg", "Ewan Bouwer.jpg", "FJ Bezuidenhout.jpg",
  "Fanny Maahlo.jpg", "Finlay Davison.jpg", "Francois van Niekerk.jpg", "Gabriel Brocker-Corns.jpg", "Hamilton Slater.jpg",
  "Hendrik Pelser.jpg", "Herman Augustyn.jpg", "Jack Noussis.jpg", "Jacques Adriaan van Zyl.jpg",
  "James Erasmus.jpg", "James Robert Wiggill.jpg", "JD le Roux", "Jean Blignaut.jpg", "JW Visagie.jpg",
  "Jaco Steyn.jpg", "Johannes Christiaan Portwig.jpg", "John-Matt le Roux.jpg", "Josh Beckley.jpg",
  "Joubert du Toit.jpg", "Khanya Hlabahlaba.jpg", "Kristian Matthew Mongie.jpg", "Leigh-Hagen Cornelissen.jpg",
  "Louis van Heerden.jpg", "Lucas Marthinus Kruger.jpg", "Lucian Booysen.jpg",
  "Luke Blaire van Wyngaard.jpg", "Luke Swartz.jpg", "Luveni Mahelu.jpg", "Marchand Nel.jpg",
  "Matthew Duk.jpg", "Matthew Halbert.jpg", "Matthew James Vos.jpg", "Matthew Peter Van Rooyen.jpg", "Mduduzi Sihlangu.jpg",
  "Michael Neuper.jpg", "Michael James Solecki.jpg", "Michael Mulcahy.jpg", "Michael Newton.jpg",
  "Michael Shepstone.jpg", "Ngoni Zvenyika.jpg", "Neelsie van Dyk.jpg",
  "Ntsika Vellem.jpg", "Onako Mqeni.jpg", "Pieter Roux.jpg", "Prim Du Preez.jpg",
  "Rahul Daya.jpg", "Righardt Pretorius.jpg", "Ross Jacobs.jpg", "Ryan Bennett.jpg",
  "Sauvan Sewsunker.jpg", "Tshepang Semenya.jpg", "Tokelo Motloli.jpg",
  "Wafiq Madatt.jpg", "Wuhan Mare.jpg", "Willem Visagie.jpg", "Wilry Williams.jpg"
];



var selectedPics = [];

var opponentCharacterIndex = Math.floor(rng() * selectedPics.length);
var opponentCharacter = selectedPics[opponentCharacterIndex];

function myCharacter() {

  const playerSeed = generateRandomSeed();


  const playerRng = new Math.seedrandom(playerSeed);


  var remainingPics = selectedPics.slice();


  var opponentCharacterIndex = remainingPics.indexOf(opponentCharacter);
  if (opponentCharacterIndex !== -1) {
      remainingPics.splice(opponentCharacterIndex, 1);
  }


  var myPicIndex = Math.floor(playerRng() * remainingPics.length);
  var myPic = remainingPics[myPicIndex];

  $("#me").html('<img src="img/' + myPic + '">');

  var name = myPic.substr(0, myPic.lastIndexOf("."));
  name = name.charAt(0).toUpperCase() + name.slice(1);
  $("#name").html('You are ' + name);
}

function displayRandomPhotos() {

  var allPicsCopy = allPics.slice();


  for (var i = allPicsCopy.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var temp = allPicsCopy[i];
      allPicsCopy[i] = allPicsCopy[j];
      allPicsCopy[j] = temp;
  }


  selectedPics = allPicsCopy.slice(0, 24);

  for (var i = 0; i < selectedPics.length; i++) {

      var cardContainer = $('<div class="card-container">');


      cardContainer.append('<div class="card"><img src="img/' + selectedPics[i] + '"></div>');


      var name = selectedPics[i].substr(0, selectedPics[i].lastIndexOf("."));
      name = name.charAt(0).toUpperCase() + name.slice(1);


      cardContainer.append('<div class="card-name">' + name + '</div>');


      $("#gameboard").append(cardContainer);
  }
}





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


function reset() {
  var play = confirm('Do you want to play again?');
  if (play == true) {
      $('#gameboard').html('');
      selectedPics = [];
      displayRandomPhotos();
      myCharacter();
  } else {
      alert('Thanks for playing!');
  }
}


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
