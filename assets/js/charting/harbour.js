(function(hc, harbourData, smz) {

  var data = {
    ships: smz.fn.extractColumn(harbourData, "ships"),
    cargo: smz.fn.extractColumn(harbourData, "cargo"),
  };

  var harbourChartConfig = {
    chart: {
      type: 'column'
    },
    plotOptions: {
      column: {
        groupPadding: 0.05,
        pointStart: 2000,
        tooltip: {
          valueDecimals: 0
        },
      }
    },
    series: [{
      name: "Güterumschlag",
      data: data.cargo.map(function(cargoInThousands){ return cargoInThousands * 1000 || null }),
      color: smz.color.swfl.darkGreen,
      tooltip: {
        valueSuffix: ' t'
      }
    },{
      name: "Eingelaufene Schiffe",
      color: smz.color.swfl.lightGreen,
      data: data.ships,
      visible: false,
      yAxis: 1
    }],
    xAxis: {
      missing: [2002, 2003, 2006, 2017, 2018, 2019]
    },
    yAxis: [{
      title: {text: "Umschlag in Tonnen"}
    },{
      title: {text: "Anzahl Schiffe"},
      opposite: true
    }]
  };

  smz.chart = smz.chart || {};
  smz.chart.Harbour = hc.chart("hafen", harbourChartConfig)

})(window.Highcharts, window.SWFL.Business.Harbour, window.smz);
