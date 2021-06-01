(function(hc, wasteData) {

  var data = {
    waste_handled: smz.fn.extractColumn(wasteData, "handling")
  };

  var missingYears = [2003, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2017, 2018, 2019];

  var wasteChartConfig = {
    chart: {
      type: 'column'
    },
    plotOptions: {
      column: {
        pointStart: 2000,
        tooltip: {
          valueDecimals: 0
        }
      }
    },
    series: [{
      name: "Aufbereiteter Müll",
      data: data.waste_handled.map(function(wasteInThousands) { return wasteInThousands * 1000 || null }),
      color: smz.fn.getGradient("#666"),
      tooltip: {
        valueSuffix: ' t',
      },
    }],
    xAxis: {
      missing: missingYears
    },
    yAxis: [{
      title: {text: "Umschlag in Tonnen"},
      min: 0
    }]
  };

  smz.chart = smz.chart || {};
  smz.chart.Waste = hc.chart("awz-umschlag", wasteChartConfig)

})(window.Highcharts, window.SWFL.Business.Waste);
