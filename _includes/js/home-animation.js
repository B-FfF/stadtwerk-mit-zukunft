(function(){

  var dotsDuration = 3000;
  var fadeDuration = 2500;
  var typeDuration = 2000;
  var startDelay = 1000;

  var logo = document.getElementById("logo");
  var logoText = logo.firstElementChild;

  function addDots(el, speed) {

    var counter = 1;
    function addDot() {
      el.innerText += ".";
    }

    for (; counter <= 2; counter++) {
      window.setTimeout(addDot, counter * speed / 2);
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

  var currentDelay = startDelay;
  window.setTimeout(addDots.bind(this, logoText, dotsDuration), currentDelay);
  currentDelay += fadeDuration;
  window.setTimeout(addClass.bind(this, 'is-black'), currentDelay);
  currentDelay += dotsDuration;
  window.setTimeout(addNextText.bind(this, logoText, "...aber mit Ihnen...", typeDuration), currentDelay);
  currentDelay += typeDuration + 1500;
  window.setTimeout(addClass.bind(this, 'is-postload'), currentDelay)
  currentDelay += fadeDuration - 2000;
  window.setTimeout(addNextText.bind(this, logoText, "Mit Ihnen blicken wir in die Zukunft!", typeDuration * 1.5), currentDelay);

})()