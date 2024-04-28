(function(hc, smz, airportData) {

  var data = {
    flight_ops: smz.fn.extractColumn(airportData, "flight_ops_total")
  };

  var missingYears = [2002, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2017, 2018, 2019, 2020, 2021];

  var airportChartConfig = {
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
      name: "Flugbewegungen",
      data: data.flight_ops.map(function(thousandFlights) { return thousandFlights * 1000 || null }),
      color: smz.gradient[3]
    }],
    xAxis: {
      missing: missingYears
    },
    yAxis: [{
      title: { text: "Tausend Flugbewegungen" },
      min: 0
    }]
  };

  smz.chart = smz.chart || {};
  smz.chart.Waste = hc.chart("flugbewegungen", airportChartConfig)

})(window.Highcharts, window.smz, window.SWFL.Business.Airport);
