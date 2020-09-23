(function(){

  var dotsDuration = 3000;
  var fadeDuration = 2500;
  var typeDuration = 2000;
  var startDelay = 1000;

  var logoText = document.getElementById("logo-text");
  var cursor = document.getElementById("blinking-cursor");
  var stopBlinking = false;

  function blink() {

    var set = (cursor.style.opacity === "1") ? 0 : 1;
    cursor.style.opacity = set;
    if (stopBlinking === true && set === 0) {
      return;
    }

    window.setTimeout(blink, 1000);
  }

  function addDots(el, speed) {

    var counter = 1;
    function addDot(no) {
      el.innerText += (no === 1 ? " " : "") + ".";
    }

    for (; counter <= 3; counter++) {
      window.setTimeout(addDot.bind(this, counter), counter * speed / 3);
    }
  }

  function addNextText(el, text, speed) {
    el.innerText = " ";
    function addChar(charidx) {
      var add = text[charidx]
      if (text[charidx-1] === " ") {
        add = " " + add;
      }
      el.innerText += add;
    }

    for (var counter = 1; counter <= text.length; counter++) {
      window.setTimeout(addChar.bind(this, counter-1), counter * speed / text.length);
    }
  }

  function addClass(cssClass) {
    document.getElementsByTagName("BODY")[0].classList.add(cssClass);
  }

  var currentDelay = startDelay*2;
  blink();
  window.setTimeout(function() { logoText.innerText = logoText.innerText.substring(0, logoText.innerText.length-1);}, currentDelay);
  currentDelay += 500;
  window.setTimeout(addDots.bind(this, logoText, dotsDuration), currentDelay);
  currentDelay += fadeDuration;
  function startAnimation() {
    // console.log("First image loaded! Starting animation")
    document.getElementsByTagName("BODY")[0].classList.remove("is-preload");
  }

  function continueAnimation() {
    // console.log("Second image loaded!")
    if (document.getElementsByTagName("BODY")[0].classList.contains("is-preload") || logoText.innerText.indexOf("...") === -1) {
      // Waiting until earlier animations are finished.
      return setTimeout(continueAnimation, 50);
    }

    var currentDelay = startDelay;
    window.setTimeout(addClass.bind(this, 'is-black'), currentDelay);
    currentDelay += fadeDuration;
    window.setTimeout(addNextText.bind(this, logoText, "... aber mit ihnen ...", typeDuration), currentDelay);
    currentDelay += typeDuration + 1500;
    window.setTimeout(addClass.bind(this, 'is-postload'), currentDelay)
    currentDelay += fadeDuration - 2000;
    window.setTimeout(addNextText.bind(this, logoText, "Mit ihnen blicken wir in die Zukunft!", typeDuration * 1.5), currentDelay);
    window.setTimeout(function(){ stopBlinking = true}, currentDelay + (typeDuration * 1.5));
  }

  var firstImageUrl = window.getComputedStyle (document.querySelector('#header')).getPropertyValue('background-image');
  firstImageUrl = firstImageUrl.substring(firstImageUrl.indexOf("http"), firstImageUrl.indexOf(".jpg") + 4);
  var firstImage = new Image();
  firstImage.onload = startAnimation;
  firstImage.src = firstImageUrl;

  var secondImageUrl = window.getComputedStyle (document.querySelector('#header'), ':after').getPropertyValue('background-image');
  secondImageUrl = secondImageUrl.substring(secondImageUrl.indexOf("http"), secondImageUrl.indexOf(".jpg") + 4);
  window.secondImage = new Image();
  window.secondImage.onload = continueAnimation;
  window.secondImage.src = secondImageUrl;


})()