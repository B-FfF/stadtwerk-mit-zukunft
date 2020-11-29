(function(hc, swflData){

  var pieData = smz.fn.getDatarowByYear(swflData.ByProduct, 2019);

  Highcharts.setOptions({
    colors: Highcharts.map([ "#f45b5b", "#f7a35c", "#7cb5ec", "#90ed7d", "#f15c80", "#434348", "#e4d354"], function (color) {
        return {
            radialGradient: {
                cx: 0.5,
                cy: 0.3,
                r: 0.7
            },
            stops: [
                [0, color],
                [1, Highcharts.color(color).brighten(-0.3).get('rgb')] // darken
            ]
        };
    })
  });

  hc.chart('umsatz-nach-produkten', {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Umsatz nach Produkten (2019)'
    },
    tooltip: {
      headerFormat: null,
      pointFormat: '{series.name}: <b>{point.percentage:.1f} %</b>',
      formatter: function(point) {
        return "Umsatz: <strong>" + Highcharts.numberFormat(this.y * 1000000, 0) + " EUR </strong><br>"
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
              Highcharts.numberFormat(this.y, 1, ',', '.') + ' Mio. EUR ';
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
        name: "Fernwärme",
        y: parseFloat(pieData['heat']),
        sliced: true
      },{
        name: "Erdgas",
        y: parseFloat(pieData['gas']),
        sliced: true
      },{
        name: "Wasser",
        y: parseFloat(pieData['water']),
        sliced: true
      },{
        name: "Glasfaser",
        y: parseFloat(pieData['fibre']),
        sliced: true
      },{
        name: "Sonstige Erlöse",
        y: parseFloat(pieData['other']),
        sliced: true
      },{
        name: "Strom",
        y: parseFloat(pieData['electricity'])
      }]
    }]
  });

})(window.Highcharts, window.SWFL.Business)