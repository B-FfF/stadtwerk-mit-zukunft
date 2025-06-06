(function(hc, smz, waterData) {

  var data = {
    sales: smz.fn.extractColumn(waterData, "sales"),
    grid: smz.fn.extractColumn(waterData, "grid"),
    production: smz.fn.extractColumn(waterData, "production"),
    meters: smz.fn.extractColumn(waterData, "meters"),
    households: smz.fn.extractColumn(waterData, "households"),
    production_daily: smz.fn.extractColumn(waterData, "production_daily"),
    peak_day: smz.fn.extractColumn(waterData, "peak_day"),
  }

  var missingYears = [2000, 2001, 2002, 2003, 2006, 2018, 2019, 2020, 2021, 2022, 2023];

  var waterChartConfig = {
    chart: {
      type: 'column'
    },
    plotOptions: {
      column: {
        pointStart: 2000,
        borderWidth: 0,
        groupPadding: 0.05,
        grouping: false
      },
      line: {
        connectNulls: true,
        pointStart: 2000,
        zoneAxis: "x",
        zones: [{
          dashStyle: "Solid",
          value: 2005
        },{
          dashStyle: "Dot",
          value: 2007
        }]
      }
    },
    tooltip: {
      valueSuffix: ' Mio. m³'
    },
    series: [{
      name: "Wasserförderung",
      data: data.production,
      color: smz.gradient[7],
      pointPadding: 0
    },{
      name: "Wasserabgabe",
      data: data.sales,
      color: smz.gradient[0],
      pointPadding: 0.15
    },{
      type: "line",
      name: "ø Absatz pro Zähler",
      data: data.meters.map(function(meterCount, idx) { return Math.round(data.sales[idx] * 1000000 / meterCount, 0) }),
      color: '#333',
      yAxis: 1,
      shadow: smz.chart.getBoldLineShadow(),
      zIndex: 1,
      tooltip: { valueSuffix: ' m³' }
    }],
    xAxis: {
      missing: missingYears
    },
    yAxis: [{
      title: { text: "Wasser in Mio. m³" }
    },{
      title: { text: "Absatz pro Zähler in m³" },
      opposite: true,
      min: 0
    }]
  };

  var waterGridConfig = {
    chart: {
      type: 'line'
    },
    plotOptions: {
      line: waterChartConfig.plotOptions.line
    },
    series: [{
      name: "Leitungsnetz",
      data: data.grid,
      color: smz.gradient[7],
      tooltip: { valueSuffix: ' km' },
      zIndex: 1
    },{
      name: "Zähler im Netz",
      data: data.meters,
      color: '#333',
      visible: false,
      yAxis: 1
    },{
      name: "Hausanschlüsse",
      data: data.households,
      color: '#999',
      visible: false,
      yAxis: 1
    },{
      name: "Verluste (Absatz / Erzeugung)",
      color: smz.gradient[8],
      data: data.production.map(function(produced, idx) { 
        return produced ? (1 - (data.sales[idx] / produced)) * 100 : produced
      }),
      tooltip: { valueSuffix: ' %' },
      yAxis: 2
    }],
    xAxis: {
      missing: missingYears
    },
    yAxis: [{
      title: { text: "Leitungsnetz in km" }
    },{
      title: null,
      opposite: true
    },{
      title: null,
      opposite: true,
      labels: { format: "{value} %" },
      max: 14
    }]
  };

  smz.chart = smz.chart || {};
  smz.chart.Water = hc.chart("wasserabsatz", waterChartConfig)
  smz.chart.WaterGrid = hc.chart("wassernetz", waterGridConfig)

})(window.Highcharts, window.smz, window.SWFL.Business.Water);