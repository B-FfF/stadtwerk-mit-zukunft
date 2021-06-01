(function(hc, smz, swflData){

  var pieData = smz.fn.getDatarowByYear(swflData.ByProduct, 2020);

  hc.chart('umsatz-nach-produkten', {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Umsatz nach Produkten (2020)'
    },
    tooltip: {
      headerFormat: null,
      pointFormat: '{series.name}: <b>{point.percentage:.1f} %</b>',
      formatter: function(point) {
        return "Umsatz: <strong>" + hc.numberFormat(this.y * 1000000, 0) + " EUR </strong><br>"
          + "Umsatzanteil: <strong>" + hc.numberFormat(this.percentage, 2) + ' %</strong>';
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          useHtml: true,
          formatter: function() {
            return "<b>" + this.key + "</b><br>" + 
              hc.numberFormat(this.y, 1, ',', '.') + ' Mio. EUR ';
          },
          style: {
            fontWeight: 'normal'
          }
        }
      }
    },
    series: [{
      name: 'Umsatzanteil',
      data: [{
        color: smz.gradient[8],
        name: "Fernwärme",
        y: parseFloat(pieData['heat']),
        sliced: true
      },{
        color: smz.gradient[3],
        name: "Erdgas",
        y: parseFloat(pieData['gas']),
        sliced: true
      },{
        color: smz.gradient[0],
        name: "Wasser",
        y: parseFloat(pieData['water']),
        sliced: true
      },{
        color: smz.gradient[2],
        name: "Glasfaser",
        y: parseFloat(pieData['fibre']),
        sliced: true
      },{
        color: smz.gradient[5],
        name: "Sonstige Erlöse",
        y: parseFloat(pieData['other']),
        sliced: true
      },{
        color: smz.gradient[1],
        name: "Strom",
        y: parseFloat(pieData['electricity'])
      }]
    }]
  });

})(window.Highcharts, window.smz, window.SWFL.Business)