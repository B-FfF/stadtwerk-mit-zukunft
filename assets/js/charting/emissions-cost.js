(function(hc, smz, swflData) {

  var euaCostConfig = {
    chart: { type: 'column' },
    plotOptions: { column: {
      groupPadding: 0,
      // pointPlacement: "between",
      pointRange: 365 * 24 * 3600 * 1000,
      pointIntervalUnit: "year",
      pointStart: new Date("Jan 2 " + 2012).getTime(),
      pointPadding: 0.1,
    }},
    series: [{
      color: smz.gradient[8],
      data: smz.fn.extractColumn(swflData.Emissions, "total_eua_cost", 2012)
              .concat(64 * 500000),
      dataLabels: {
        align: 'left',
        inside: true,
        enabled: true,
        formatter: function(e) {
          if (new Date(this.x).getFullYear() !== 2022) return
          return 'Prognose (500.000 x 64 €)'
        },
        rotation: -90,
        verticalAlign: 'bottom',
        y: -16,
      },                      
      name: 'Aufwendungen für Emissionrechte',
      zoneAxis: 'x',
      zones: [{
        value: new Date("Jan 2 " + 2022).getTime(),
      },{
        color: hc.defaultOptions.colors[3],
      }]
    },{
      gapSize: 40,
      name: "EU ETS",
      color: hc.defaultOptions.colors[7],
      data: swflData.EUA,
      shadow: {
        color: "#FFF",
        width: 4,
        opacity: 1
      },
      tooltip: {
        valueSuffix: ' €'
      },
      type: 'line',
      zIndex: 1,
      yAxis: 1
    }],
    tooltip: { headerFormat: '<strong>{point.key:%Y}</strong><br>', pointFormat: '{point.y:,.0f} €' },
    xAxis: {
      type: 'datetime',
      tickInterval: 'year',
      tickmarkPlacement: 'on'
    },    
    yAxis: [{
      labels: { 
        format: '<strong>{value:,.0f} €</strong>',
        style: { color: hc.defaultOptions.colors[8] },
      },
      opposite: true,
      title: { enabled: false },
    },{
      labels: {
        format: '<b>{value} €</b>',
        style: { color: hc.defaultOptions.colors[7] },
      },
      title: {
        text: "Preis in € pro Tonne CO₂-Emissionsrechte",
        style: { color: hc.defaultOptions.colors[7] },
      },
    }]
  }  
  
  smz.chart = smz.chart || {};
  smz.chart.EuaExpenses = hc.chart('aufwendungen-fuer-emissionsrechte', euaCostConfig)
    
})(window.Highcharts, window.smz, window.SWFL)