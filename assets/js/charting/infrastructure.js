(function(hc, swflData){

  hc.setOptions({
    tooltip: {
      backgroundColor: '#ffffff',
      useHTML: true,
      shared: true,
      headerFormat: '<span style="font-size: 1.5em; font-weight: bold">{point.key}</span><table>',
      footerFormat: '</table>',
      pointFormatter: function () {
        return '<tr><td><span style="color:'+this.color+'">●</span>&nbsp;' + this.series.name + ':&nbsp;</td><td style="text-align: right"><b>' + Highcharts.numberFormat(this.y, 0) + '</b></td></tr>';
      }
    },
  });

  var colorDarkGreen = '#177d35',
    colorLightGreen = '#73c82c';

  function drawPowerChart() {

    var startYear = 2003;
    var data = {
      customers: smz.fn.extractColumn(swflData.Electricity, "customers", startYear),
      production: smz.fn.extractColumn(swflData.Electricity, "production", startYear),
      sales: smz.fn.extractColumn(swflData.Electricity, "sales", startYear),
      salesFL: smz.fn.extractColumn(swflData.Electricity, "sales_flensburg", startYear),
    };    

    hc.chart('strom', {
      plotOptions: {
        line: {
          pointStart: startYear,
        },
        column: {
          pointStart: startYear,
          grouping: false,
          shadow: false,
          borderWidth: 0,
          groupPadding: 0.1,
          tooltip: {
            pointFormatter: function () {
              return '<tr><td><span style="color:'+this.color+'">●</span>&nbsp;' + this.series.name + ':&nbsp;</td><td style="text-align: right"><b>' + Highcharts.numberFormat(this.y, 0) + ' MWh</b></td></tr>';
            }
          }
        }
      },
      title: {
        text: 'Stromabgabe und Kundschaft'
      },
      series: [{
        name: "Stromabgabe gesamt",
        data: data.sales,
        color: colorLightGreen,
        type: 'column',
      },{
        name: "Stromabgabe Flensburg",
        data: data.production,
        color: colorDarkGreen,
        type: 'column',
        data: data.sales.map(function(entry, i) { return entry * data.salesFL[i]; }),
        tooltip: {
          nullFormatter: function () {
            return '<tr><td><span style="color:'+this.color+'">●</span>&nbsp;' + this.series.name + ':&nbsp;</td><td style="text-align: right">keine Angabe</td></tr>';
          },
        }        
      },{
        name: "Kund*innen",
        data: data.customers,
        color: '#333',
        yAxis: 1,
        shadow: true,
        zIndex: 1
      }],
      yAxis: [{
        title: {
          margin: 6,
          text: "Mio. KWh"
        },
        labels: {
          style: {
            color: colorDarkGreen
          }
        }
      },{
        title: {
          text: "Kund*innen",
          style: {
            color: '#333'
          }
        },
        labels: {
          style: {
            color: '#333'
          }
        },
        opposite: true,
        min: 0
      }]
    });
  }

  function drawPowerGridChart() {

    var data = {
      gridHigh: smz.fn.extractColumn(swflData.Electricity, "grid_high", 2004),
      gridMedium: smz.fn.extractColumn(swflData.Electricity, "grid_medium", 2004),
      gridLow: smz.fn.extractColumn(swflData.Electricity, "grid_low", 2004),
      meters: smz.fn.extractColumn(swflData.Electricity, "meters", 2004),
      households: smz.fn.extractColumn(swflData.Electricity, "households", 2004),
      capacity: smz.fn.extractColumn(swflData.Electricity, "capacity", 2004),
      peak: smz.fn.extractColumn(swflData.Electricity, "peak", 2004),
    };

    var zone1 = {
      dashStyle: "Solid",
      value: 2005
    };
    var zone2 = {
      dashStyle: "Dot",
      value: 2007
    };

    hc.chart('stromnetz', {
      plotOptions: {
        area: {
          connectNulls: true,
          marker: {
            enabled: false
          },
          pointStart: 2004,
          tooltip: {
            pointFormatter: function () {
              return '<tr><td><span style="color:'+this.color+'">●</span>&nbsp;' + this.series.name + ':&nbsp;</td><td style="text-align: right"><b>' + this.y + ' km</b></td></tr>';
            }
          },
          zoneAxis: "x",
          zones: [zone1, zone2]
        },
        line: {
          pointStart: 2004,
          connectNulls: true,
          zoneAxis: "x",
          zones: [zone1, zone2]
        }
      },
      title: {
        text: 'Stromnetze'
      },
      series: [{
        type: 'area',
        name: "Hochspannungsnetz 60/150 kV",
        data: data.gridHigh,
        color: Highcharts.defaultOptions.colors[5],
        zones: [
          zone1, Object.assign({
            fillColor: {
              pattern: Object.assign(Highcharts.patterns[2], {color: Highcharts.defaultOptions.colors[5]})
            }
          }, zone2)
        ]
      },{
        type: 'area',
        name: "Mittelspannungsnetz 15 (20) kV",
        color: Highcharts.defaultOptions.colors[3],
        data: data.gridMedium,
        zIndex: -1,
        zones: [
          zone1, Object.assign({
            fillColor: {
              pattern: Object.assign(Highcharts.patterns[2], {color: Highcharts.defaultOptions.colors[3]})
            }
          }, zone2)
        ]
      },{
        name: "Niederspannungsnetz 220V",
        data: data.gridLow,
        color: Highcharts.defaultOptions.colors[6],
        type: 'area',
        zIndex: -2,
        zones: [
          zone1, Object.assign({
            fillColor: {
              pattern: Object.assign(Highcharts.patterns[2], {color: Highcharts.defaultOptions.colors[6], opacity: 0.5})
            }
          }, zone2)
        ]
      },{
        name: "Zähler im Netz",
        color: colorLightGreen,
        data: data.meters,
        yAxis: 1
      },{
        name: "Hausanschlüsse",
        data: data.households,
        color: colorDarkGreen,
        yAxis: 1
      }],
      xAxis: {
        max: 2017
      },
      yAxis: [{
        title: {
          margin: 0,
          text: "Netz in km"
        },
        labels: {
          style: {
            color: Highcharts.defaultOptions.colors[3]
          }
        }
      },{
        title: {
          enabled: false
        },
        labels: {
          style: {
            color: colorDarkGreen
          }
        },
        opposite: true
      },{
        visible: false
      }],
    });
  }

  window.smz.chart = window.smz.chart || {};
  window.smz.chart.Power = drawPowerChart();
  window.smz.chart.PowerGrid = drawPowerGridChart();

})(window.Highcharts, window.SWFL.Business)