---
layout: right-sidebar
permalink: bewerben/stadtwerke-flensburg/status-quo/
preview_image: assets/images/swfl/swfl_logo_2014.svg
title: Die Stadtwerke Flensburg
description: Ein Überblick über die Geschichte der Stadtwerke Flensburg, ihrer Erzeugungsstuktur und wirtschaftlichen Daten der einzelnen Geschäftsbereiche.
---

<div class="row">
  <figure id="umsatz-nach-produkten-2018" class="col-8 col-12-normal col-12-mobile">
  </figure>
</div>

<br>

### Geschäftsberichte

|------|------|------|------|------|------|------|------|------|------|
|      |      |      |      |      |      |      |      |[2008]&nbsp;|[2009]|
|[2010]&nbsp;|[2011]&nbsp;|[2012]&nbsp;|[2013]&nbsp;|[2014]&nbsp;|[2015]&nbsp;|[2016]&nbsp;|[2017]&nbsp;|[2018]&nbsp;|      |


  [2018]: https://www.stadtwerke-flensburg.de/fileadmin/user_upload/pdf/geschaeftsberichte/swfl-geschaeftsbericht-2018.pdf
  [2017]: https://www.stadtwerke-flensburg.de/fileadmin/user_upload/pdf/geschaeftsberichte/swfl-geschaeftsbericht-2017.pdf
  [2016]: https://www.stadtwerke-flensburg.de/fileadmin/user_upload/pdf/geschaeftsberichte/swfl-geschaeftsbericht-2016.pdf
  [2015]: https://www.stadtwerke-flensburg.de/fileadmin/user_upload/pdf/geschaeftsberichte/swfl-geschaeftsbericht-2015.pdf
  [2014]: https://www.stadtwerke-flensburg.de/fileadmin/_migrated/content_uploads/swfl-geschaeftsbericht-2014.pdf
  [2013]: https://www.stadtwerke-flensburg.de/fileadmin/_migrated/content_uploads/geschaeftsbericht-swfl-2013.pdf
  [2012]: https://www.stadtwerke-flensburg.de/fileadmin/_migrated/content_uploads/GB2012_11.pdf
  [2011]: https://www.stadtwerke-flensburg.de/fileadmin/_migrated/content_uploads/GB2011_12.pdf
  [2010]: https://www.stadtwerke-flensburg.de/fileadmin/_migrated/content_uploads/GB2010_11.pdf
  [2009]: https://www.stadtwerke-flensburg.de/fileadmin/_migrated/content_uploads/GB2009_11.pdf
  [2008]: https://www.stadtwerke-flensburg.de/fileadmin/_migrated/content_uploads/GB2008_11.pdf


<script>
  window.SWFL = {
    Business: {
      ProductSplit: {{ site.data.swfl_business_by_product | jsonify }},
      Results: {{ site.data.swfl_business | jsonify }}
    }
  }
</script>
<script src="{{ "assets/js/lib/highcharts/highcharts.js" | relative_url }}"></script>
<script src="{{ "assets/js/charting/global.js" | relative_url }}"></script>
<script src="{{ "assets/js/charting/status-quo.js" | relative_url }}"></script>