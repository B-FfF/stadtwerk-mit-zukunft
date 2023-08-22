(function(hc, smz, heatData) {

  hc.setOptions({
    tooltip: {
      backgroundColor: '#ffffff',
      useHTML: true,
      shared: true,
      valueDecimals: 1
    },
  });

  var data = {
    sales: smz.fn.extractColumn(heatData, "sales"),
    production: smz.fn.extractColumn(heatData, "production"),
    meters: smz.fn.extractColumn(heatData, "meters"),
    households: smz.fn.extractColumn(heatData, "households"),
    grid: smz.fn.extractColumn(heatData, "grid"),
  }

  var missingYears = [2000, 2001, 2002, 2003, 2006, 2018, 2019, 2020, 2021];

  var heatChartConfig = {
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
      valueSuffix: ' GWh'
    },
    series: [{
      name: "Wärmeerzeugung gesamt",
      data: data.production,
      color: smz.gradient[8],
      pointPadding: 0
    },{
      name: "Wärmeabsatz gesamt",
      data: data.sales,
      color: smz.gradient[11],
      pointPadding: 0.15,
    },{
      type: "line",
      name: "ø Absatz pro Zähler",
      data: data.meters.map(function(meterCount, idx) { return Math.round(data.sales[idx] * 1000000 / meterCount, 1) }),
      color: '#333',
      yAxis: 1,
      shadow: smz.chart.getBoldLineShadow(),
      zIndex: 1,
      tooltip: {
        valueSuffix: ' kWh',
        valueDecimals: 0
      }
    }],
    xAxis: {
      missing: missingYears
    },
    yAxis: [{
      title: {
        text: "Wärme in Mio. kWh"
      }
    },{
      title: {
        text: "Absatz pro Zähler in kWh"
      },
      opposite: true,
      min: 0
    }]
  }

  var heatGridConfig = {
    chart: {
      type: 'line'
    },
    plotOptions: {
      line: heatChartConfig.plotOptions.line
    },
    series: [{
      name: "Leitungsnetz",
      data: data.grid,
      color: smz.gradient[11],
      tooltip: {
        valueSuffix: ' km'
      },
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
      name: "Fernwärmeverluste (Absatz / Erzeugung)",
      color: smz.gradient[8],
      data: data.production.map(function(produced, idx) { 
        return produced ? (1 - (data.sales[idx] / produced)) * 100 : produced
      }),
      tooltip: {
        valueSuffix: ' %'
      },
      yAxis: 2
    }],
    xAxis: {
      missing: missingYears
    },
    yAxis: [{
      title: {text: "Leitungsnetz in km"}
    },{
      title: {text: undefined},
      opposite: true
    },{
      title: {text: undefined},
      opposite: true,
      labels: {
        format: "{value} %"
      },
      max: 20
    }]
  }

  smz.chart = smz.chart || {};
  smz.chart.Heat = hc.chart("waermeabsatz", heatChartConfig)
  smz.chart.HeatGrid = hc.chart("waermenetz", heatGridConfig)

})(window.Highcharts, window.smz, window.SWFL.Business.Heat);