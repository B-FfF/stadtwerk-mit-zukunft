---
layout: right-sidebar
permalink: stadtwerke-flensburg/die-herausforderung/
preview_image: assets/images/flensburg-insel-erneuerbare-energien-new-4.0.png
title: Die Herausforderung
caption: >-
  Obwohl es auf der Profitseite zurzeit gut aussieht, bedarf es umfassender Umbauten
  in der Erzeugungsstruktur der Stadtwerke Flensburg, um auch in kommenden Jahrzehnten solide aufgestellt zu sein.
description: |
  Sowohl Fernwärmenetz als auch Strommix der Stadtwerke Flensburg haben nur einen sehr geringen Anteil an erneuerbaren Energien. Gleichzeitig ist sind die Treibhausgasemissionen besorgniserregend hoch. Dies hat auch wirtschaftliche Implikationen.
sidebar:
  box:
    header: Work in progress
    content: Dieser Bereich wird zurzeit fast täglich um weitere Informationen ergänzt. Falls Sie noch offene Fragen haben, schauen Sie morgen doch noch einmal vorbei oder wenden sich an uns direkt.
    button:
      text: Schreiben Sie uns
      link: mailto:info@stadtwerk-mit-zukunft.de?subject=stadtwerk-mit-zukunft.de
---

> „Wir befinden uns im Jahre 2020 n. Chr.  
 Ganz Schleswig-Flensburg ist von den erneuerbaren Energien besetzt... Ganz Schleswig-Flensburg? Nein! Eine von unbeugsamen Anhängern der fossilen Energie bevölkerte Stadt hört nicht auf, dem Eindringling Widerstand zu leisten...“

<figure>
  <img class="image featured" src="{{ "assets/images/flensburg-insel-erneuerbare-energien-new-4.0.png" | relative_url }}">
  <figcaption>
    Quelle: EKSH – „<a href="https://www.eksh.org/fileadmin/downloads/publikationen/Broschuere_Energieforschung_Final_Download_0205.pdf">„Energieforschung in Schleswig-Holstein“</a> S.23
  </figcaption>
</figure>

In Anlehnung an den bekanntesten Comic-Prolog der Welt könnte sich diese Formulierung bei der Betrachtung der Situation südlich der Grenze zu Dänemark geradezu aufdrängen.  

Wie aus der Grafik ersichtlich wird, liegt der Anteil erneuerbarer Energien in der Stromerzeugung in Flensburg unter 15 Prozent, während diese im Umland sogar den Bedarf übersteigen. Die Küstenstadt ist quasi eine Insel der fossilen Energien in einem Meer von erneuerbaren und mit diesem Wert sogar das traurige Schlusslicht Schleswig-Holsteins. 

## Das greenco<sub>2</sub>ncept-Ziel

Die Stadtwerke Flensburg haben sich bereits 2007 das Ziel gesteckt, bis 2050 CO₂-neutral zu sein. Dabei stellen sie auch ihren eigenen Präsentationen zum Thema immer voran, dass es nicht reiche, irgendwann vor 2050 die Emissionen abrupt auf Null sinken zu lassen (Ziel 1), sondern diese auch bis dahin begrenzt werden (sprich: einem Zielpfad folgen) müssen (Ziel 2). Es wird sich also an einem CO₂-Budget orientiert, wie es die Klimawissenschaft auch tut.

Seitdem ist die Menge der jährlichen Emissionen im Schnitt um 100.000 Tonnen reduziert worden. Sie liegen dennoch in den meisten Jahren deutlich über dem Zielpfad, wodurch bis heute rund 800.000 Tonnen mehr CO₂ emittiert wurde:

<figure class=chart>
    <div id="co2-emissionen-der-stadtwerke-flensburg"></div>
</figure>

Nach der Inbetriebnahme des GuD-Kessel 12 (Leistung [75 MWₑₗ + 75 MWₜₕ][swfl-kessel-12-web]) am 21.04.2016 wurden die beiden kohlebefeuerten Kessel 7 & 8 (zusammen [64 MWₑₗ][ebc-kessel78-mwel] + [125 MWₜₕ][swfl-kessel12-poster]) stillgelegt. Seitdem sind die CO₂-Emissionen um etwa **70.000 Tonnen** gesunken.

Nach der für 2022 geplanten Inbetriebnahme von Kessel 13 (Leistung [55 MWₑₗ](ndr-kessel-13) + [70 MWₜₕ][swfl-kessel-13-web]) ist die Stilllegung der Kessel 9 & 10 (zusammen [64 MWₑₗ + 124 MWₜₕ][uba-kkw]) geplant. Dadurch sollen »[jährlich bis zu **120.000 Tonnen** CO₂][swfl-kessel-13-web]« eingespart werden - unter dieser optimistischen Annahme würde sich bis zum Jahr 2030 folgendes Bild ergeben:

<figure class=chart>
    <div id="co2-emissionen-der-stadtwerke-flensburg-bis-2025"></div>
</figure>

  [ndr-kessel-13]: https://web.archive.org/web/20190423101117/https://www.ndr.de/nachrichten/schleswig-holstein/Flensburger-Meilenstein-auf-dem-Weg-zum-Kohleausstieg,gaskraftwerk140.html
  [swfl-kessel-12-web]: https://web.archive.org/web/20191230235758/https://www.stadtwerke-flensburg.de/unternehmen/umwelt/kessel-12/zusaetzliche-informationen/
  [ebc-kessel78-mwel]: https://d3ihh3ce7usp68.cloudfront.net/wp-content/uploads/2020/04/2020-04-21_Europe_Beyond_Coal-European_Coal_Database_hc.xlsx
  [swfl-kessel12-poster]: https://www.stadtwerke-flensburg.de/fileadmin/user_upload/pdf/kessel12/faltplakat-kessel-12.pdf
  [uba-kkw]: https://www.umweltbundesamt.de/sites/default/files/medien/1410/publikationen/171207_uba_hg_braunsteinkohle_bf.pdf "Umweltbundesamt: Daten und Fakten zu Braun- und  Steinkohlen, Seite 48"
  [swfl-kessel-13-web]: https://www.stadtwerke-flensburg.de/unternehmen/umwelt/kessel-13/

<script>
  window.SWFL = {
    Emissions: {{ site.data.swfl_emissions | jsonify }}
  }
</script>
<script src="{{ "assets/js/lib/highcharts/highcharts.js" | relative_url }}"></script>
<script src="{{ "assets/js/lib/highcharts/highcharts-more.js" | relative_url }}"></script>
<script src="{{ "assets/js/lib/highcharts/pattern-fill.js" | relative_url }}"></script>
<script src="{{ "assets/js/charting/global.js" | relative_url }}"></script>
<script src="{{ "assets/js/charting/challenges.js" | relative_url }}"></script>
