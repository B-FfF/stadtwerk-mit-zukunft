(function(hc, fibreData, smz) {

  var data = {
    grid: smz.fn.extractColumn(fibreData, "grid"),
    households: smz.fn.extractColumn(fibreData, "households"),
    customers: smz.fn.extractColumn(fibreData, "customers"),
  };

  function markMissing(label) {
    if ([2018, 2019].indexOf(label.value) === -1) {
      return label.value;
    }

    return label.value + "<strong style='color: #000'>*</strong>";
  }

  var fibreChartConfig = {
    chart: {
      type: 'line'
    },
    plotOptions: {
      line: {
        pointStart: 2015,
      }
    },
    series: [{
      name: "Leitungsnetz",
      data: data.grid,
      color: '#333',
      tooltip: {
        valueSuffix: ' km',
      },
      zIndex: 1
    },{
      name: "Hausanschlüsse",
      data: data.households,
      color: smz.color.swfl.lightGreen,
      yAxis: 1
    },{
      name: "Kund*innen",
      color: smz.color.swfl.DarkGreen,
      data: data.customers,
      yAxis: 1
    }],
    xAxis: {
      labels: {
        formatter: markMissing
      }
    },
    yAxis: [{
      title: {text: "Leitungsnetz in km"}
    },{
      title: {text: "Anschlüsse"},
      opposite: true
    }]
  };

  smz.chart = smz.chart || {};
  smz.chart.Fibre = hc.chart("glasfaser-chart", fibreChartConfig)

})(window.Highcharts, window.SWFL.Business.Fibre, window.smz);
