---
layout: default
permalink: bewerben/
preview_image: assets/images/maritime/captain.svg
title: Geschäftsführer*in (m/w/d)
caption: >-
  Nicht jede*r ist aus dem nötigen Holz geschnitzt. Wir hoffen, dass Sie es sind oder einen Menschen kennen, der es ist! Erhalten Sie hier einen Überblick über das Anforderungsprofil der höchstdotierten Stelle Flensburgs.
description: Neue Geschäftsleitung für die Stadtwerke Flensburg gesucht!
noindex: true
---

## Hallo, sind Sie unser neuer [Prinz\*][prinz]?

Die Stadtwerke Flensburg GmbH ist das zentrale Unternehmen, das alle Flensburger*innen mit der nötigen Infrastruktur zum Leben versorgt. Das Firmengelände liegt direkt am Wasser der „schönsten Förde der Welt“. Die Stadtwerke blicken auf eine über 150-jährige Unternehmensgeschichte zurück und beschäftigen nahezu 700 Arbeitnehmer\*innen. Weitere Informationen sind unter anderem [auf dieser Seite]({% link pages/job/swfl.md %}) und auf der [Unternehmensseite der Stadtwerke Flensburg](https://www.stadtwerke-flensburg.de/unternehmen/ueber-uns/) verfügbar.

Der bisherige Geschäftsführer verlässt die Stadtwerke nach nunmehr zehn Jahren und bleibt **spätestens bis zum 31.12.2020**.

{%- include carousel.html -%}


### Ihre Aufgaben

* **Transformation** des Unternehmens zur Unabhängigkeit von fossilen Import-Brennstoffen
* Entwicklung und Erschließung von Kooperationen 
* Ausbau von Dienstleistungen der Stadtwerke, insbesondere auf dem Gebiet der dezentralen Energieversorgung auf Basis erneuerbarer Energien 
* Strategische und operative Führung des Unternehmens und seiner Geschäftsbereiche
* Mitarbeiter\*innenführung und -motivation 
* Berichterstattung an Aufsichtsrat und Gesellschafterinversammlung
* öffentliches, transparentes Monitoring aller klimaschutzrelevanten Daten

### Das wünschen wir uns von Ihnen

* Eine **Vision** und die Bereitschaft, dafür zu kämpfen
* Hohe Expertise im Bereich der erneuerbaren Energien
* Politisches Geschick sowie hohe Führungs- und Sozialkompetenz
* das „Übliche“:
    * Technische Vorbildung (Anlagentechnik, Ingenieurswissenschaften) & fundierte betriebswirtschaftliche Kenntnisse
    * Berufserfahrung in leitender Position eines Betriebes der Energie- und Umweltwirtschaft oder im kommunalen Umfeld  
    * Ausgeprägte Zahlensicherheit, Exaktheit und Organisationstalent
    * Bereitschaft zu einem dauerhaften Engagement

### Ihre Vorteile

* Die Möglichkeit, **Geschichte zu schreiben** und die Energiewende im Norden voranzubringen
* Eine vielfältige und herausfordernde Aufgabe, bei der Sie alle Ihre Talente, Fähigkeiten und Kenntnisse entfalten können
* Tätigkeit in einer der attraktivsten Städte Deutschlands (*[„Wohnen, wo andere Leute Urlaub machen“][schoenste-foerde]*)
* Eine außertarifliche Vergütung mit Erfolgsbeteiligung und den üblichen Nebenleistungen

Haben wir Ihr Interesse geweckt? Dann möchten wir Sie unbedingt zu einer [Initiativbewerbung](https://www.stadtwerke-flensburg.de/unternehmen/jobs-karriere/richtig-bewerben/) ermutigen!  

Gerne können Sie uns auch [direkt kontaktieren](mailto:bewerben@stadtwerk-mit-zukunft.de?subject=Geschäftsführung Stadtwerke Flensburg), sollten Sie vorab Fragen oder Rückmeldungen haben - oder uns einfach nur darüber in Kenntnis setzen wollen, dass Sie sich beworben haben. Wir freuen uns über jede Nachricht.

<script>

var checkReadyState = setInterval(function() {

  if ((document.readyState === "interactive" || document.readyState === "complete") && $) {
    clearInterval(checkReadyState)
    startCarousel();
  }
}, 100)

  function startCarousel() {

    $.getScript("{{ "assets/js/lib/jquery.scrollex-0.2.1.min.js" | relative_url }}")
    var	$window = $(window),
      settings = {

			// Carousels
				carousels: {
					speed: 4,
					fadeIn: true,
					fadeDelay: 250
				}
		};    
		$('.carousel').each(function() {
			var	$t = $(this),
				$forward = $('<span class="forward"></span>'),
				$backward = $('<span class="backward"></span>'),
				$reel = $t.children('.reel'),
				$items = $reel.children('article');

			var	pos = 0,
				leftLimit,
				rightLimit,
				itemWidth,
				reelWidth,
				timerId;

			// Items.
				if (settings.carousels.fadeIn) {

//					$items.addClass('loading');

					$t.scrollex({
						mode: 'middle',
						top: '-20vh',
						bottom: '-20vh',
						enter: function() {

							var	timerId,
								limit = $items.length - Math.ceil($window.width() / itemWidth);

							timerId = window.setInterval(function() {
								var x = $items.filter('.loading'), xf = x.first();

								if (x.length <= limit) {

									window.clearInterval(timerId);
									$items.removeClass('loading');
									return;

								}

								xf.removeClass('loading');

							}, settings.carousels.fadeDelay);

						}
					});

				}

			// Main.
				$t._update = function() {
					pos = 0;
					rightLimit = (-1 * reelWidth) + $window.width();
					leftLimit = 0;
          $t._updatePos();
				};

				$t._updatePos = function() { $reel.css('transform', 'translate(' + pos + 'px, 0)'); };

			// Forward.
				$forward
					.appendTo($t)
					// .hide()
					.mouseenter(function(e) {
						timerId = window.setInterval(function() {
							pos -= settings.carousels.speed;

							if (pos <= rightLimit)
							{
								window.clearInterval(timerId);
								pos = rightLimit;
							}

							$t._updatePos();
						}, 10);
					})
					.mouseleave(function(e) {
						window.clearInterval(timerId);
					});

			// Backward.
				$backward
					.appendTo($t)
					// .hide()
					.mouseenter(function(e) {
						timerId = window.setInterval(function() {
							pos += settings.carousels.speed;

							if (pos >= leftLimit) {
								window.clearInterval(timerId);
								pos = leftLimit;

							}

							$t._updatePos();
						}, 10);
					})
					.mouseleave(function(e) {
						window.clearInterval(timerId);
					});

			// Init.
      reelWidth = $reel[0].scrollWidth;

      if (browser.mobile) {

        $reel
          .css('overflow-y', 'hidden')
          .css('overflow-x', 'scroll')
          .scrollLeft(0);
        $forward.hide();
        $backward.hide();

      }
      else {

        $reel
          .css('overflow', 'visible')
          .scrollLeft(0);
        $forward.show();
        $backward.show();

      }

      $t._update();

      $window.on('resize', function() {
        reelWidth = $reel[0].scrollWidth;
        $t._update();
      }).trigger('resize');

    });
  }
</script>


  [prinz]: {% link pages/job/swfl.md %}#die-erste-krise "Wolfgang Prinz war technischer Direktor der Stadtwerke und setzte seine Vision trotz politischen Widerstandes und negativer Einschätzungen aller Expert*innen mit großem Erfolg um."
  [schoenste-foerde]: https://www.youtube.com/watch?v=kURCht9BRfY