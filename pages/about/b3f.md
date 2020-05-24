---
title: Bündnis Fossilfreies Flensburg
layout: default
description: Wir bündeln Synergien in den Klimaschutzzielen von Fridays for Future, Greenpeace, Attac, Aktionsgruppe KLIMA Flensburg und vielen anderen. Unser Hauptziel ist, dass die Stadtwerke Flensburg schadstofffrei und emissionsarm werden.
permalink: /flensburg-fossilfrei/
---

## Das Bündnis Fossilfreies Flensburg [B:FfF]

Wir bündeln Synergien in den Klimaschutzzielen verschiedener zivilgesellschaftlicher Gruppen.  
Unser Hauptziel ist, dass unsere Stadtwerke schadstofffrei und emissionsarm werden.

### Wer wir sind

Das Bündnis besteht unter anderem aus Mitgliedern von:

<div id="members" class="grid">
    <a href="https://www.facebook.com/Fridays-for-Future-Flensburg-2423163701300656/" class="grid-item fff">
      <img src="{{ "assets/images/members/fff-flensburg.png" | relative_url }}" alt="Fridays for Future Flensburg">
    </a>
    <a href="https://www.flensburg.greenpeace.de/" class="grid-item greenpeace">
      <img src="{{ "assets/images/members/greenpeace_logo.svg" | relative_url }}" alt="Greenpeace">
      <span>Flensburg</span>
    </a>
    <a class="sff grid-item" href="https://klimaschutz.campus-flensburg.de/?page_id=4533">
      <div class="trim">
        <img alt="Students for Future Flensburg" src="{{ "assets/images/members/sff-flensburg.jpg" | relative_url }}">
      </div>
    </a>
    <a class="ag-klima grid-item">
      <img alt="Aktionsgruppe KLIMA Flensburg" src="{{ "assets/images/members/akf.jpg" | relative_url }}">
    </a>
    <a class="attac grid-item" href="https://www.attac-netzwerk.de/flensburg/startseite/">
      <img alt="attac" src="{{ "assets/images/members/attac.png" | relative_url }}">
      <span>Flensburg</span>
    </a>
    <a class="xr grid-item" href="https://twitter.com/XR_Flensburg">
      <img src="{{ "assets/images/members/xr-flensburg.png" | relative_url }}" alt="Extinction Rebellion Flensburg">
    </a>
    <a class="ees grid-item" href="https://ees-ev.de/"  title="Erneuerbare Energie und Speicher e.V.">
      <img alt="Erneuerbare Energie und Speicher e.V." src="{{ "assets/images/members/ees.png" | relative_url }}">
    </a>
    <a class="menleb grid-item" href="https://menschlichkeit-leben.de/" title="Menschlichkeit Leben e.V.">
      <img alt="Menschlichkeit Leben e.V." src="{{ "assets/images/members/menleb.jpg" | relative_url }}">
    </a>
</div>


### Was wir wollen

* Dass die Politik handelt
* Monitoring der Klimaschutzmaßnahmen
* Stärkung des partizipatorischen Prozesses
  → Bürger*innen reden mit!
* Für die Stadtwerke Flensburg:
    * Generationenübergreifender Erhalt der Kommunalität
    * Unabhängigkeit von importierten fossilen Energien
    * statt dessen: regionale, nachhaltige Erzeugung und Kooperationen

### Was wir machen

* Informationsveranstaltungen
* Anregung politischer Diskurse
* Wissensvernetzung
* Bewusstsein für erneuerbare Energien
* [Klimawende von unten][b3f-klimawende]


  [b3f-klimawende]: https://www.klimawende.org/flensburg-fossilfrei


<style>
	#members {
		margin-bottom: 1em;
  }

  .grid-item {
    float: left;
    border-bottom: none;
    min-width: 200px;
    min-height: 120px;
    max-height: 150px;
    position: relative;
    text-align: center;
    margin-bottom: 10px;
    vertical-align: middle;
    user-select: none;
  }

  .grid-item span {
    position: absolute;
    right: 0;
  }

  .grid-item img {
    max-height: 140px;
    max-width: 200px;
    vertical-align: middle;
  }

  .greenpeace, .greenpeace:hover {
    color: #73c82c;
  }
  
  .greenpeace img {
    width: 200px;
    height: 120px;
    margin-top: -10px;
  }

  .greenpeace	span {
    top: 56px;
  }

  .sff .trim {
    overflow: hidden;
    border-radius: 50%;
    display: inline-block
  }

  .sff img {
    margin-top: -2px;
    margin-left: -1px;
    max-height: 144px;    
  }

  .attac, .attac:hover {
    color: #eb6721;
    font-style: italic;
    font-weight: 600;
    font-size: 16px;
    height: 120px;
    text-align: center;
    padding: 1em 0;
  }
  
  .attac img {
      height: 70px;
  }
    
  .attac span {
    bottom: 30px;
  }

  .ees img {
    max-height: 140px;
    border-radius: 10px;
  }

  .ag-klima img {
    margin-top: 22px;
  }
  
  .menleb img {
    border-radius: 50%;
  }  
</style>
<script src="{{ "assets/js/lib/masonry-layout-4.2.2.min.js" | relative_url }}"></script>
<script>
  var elem = document.querySelector('.grid');
  var msnry = new Masonry(elem, {
    itemSelector: '.grid-item',
    gutter: 10,
    fitWidth: true
//    columnWidth: 140
  });
</script>