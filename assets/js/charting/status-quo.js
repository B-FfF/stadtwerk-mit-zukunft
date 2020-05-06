(function(hc, swflData){

  function getDatarowByYear(data, year) {
    for (var i in data) {
      if (data[i]["year"] == year) {
        return data[i];
      }
    }
  }

  var pieData = getDatarowByYear(swflData.ProductSplit, 2018);
  var resultsData = getDatarowByYear(swflData.Results, 2018);
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

  hc.chart('umsatz-nach-produkten-2018', {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Umsatz nach Produkten (2018)'
    },
    tooltip: {
      headerFormat: null,
      pointFormat: '{series.name}: <b>{point.percentage:.1f} %</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          useHtml: true,
          formatter: function() {
            return `<b>${this.key}</b><br>` + 
              Highcharts.numberFormat(resultsData["sales"] * this.y / 100, 0, ',', '.') + ' EUR ';
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