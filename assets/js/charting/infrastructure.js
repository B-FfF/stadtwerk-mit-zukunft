(function(hc, swflData){

  hc.setOptions({
    tooltip: {
      backgroundColor: '#ffffff',
      useHTML: true,
      shared: true,
      footerFormat: '</table>',
      pointFormatter: smz.chart.getPointFormatterTableRow()
    },
  });

  function drawPowerChart() {

    var startYear = 2003;
    var data = {
      customers: smz.fn.extractColumn(swflData.Electricity, "customers", startYear),
      production: smz.fn.extractColumn(swflData.Electricity, "production", startYear),
      sales: smz.fn.extractColumn(swflData.Electricity, "sales", startYear),
      salesFL: smz.fn.extractColumn(swflData.Electricity, "sales_flensburg", startYear),
      years: smz.fn.extractColumn(swflData.Electricity, "year", startYear),
      meters: smz.fn.extractColumn(swflData.Electricity, "meters", startYear),
      households: smz.fn.extractColumn(swflData.Electricity, "households", startYear),
    };

    return hc.chart('strom', {
      plotOptions: {
        line: {
          connectNulls: true,
          pointStart: startYear,
          yAxis: 1,
          zoneAxis: "x"
        },
        column: {
          grouping: false,
          shadow: false,
          borderWidth: 1,
          groupPadding: 0.0,
          pointPadding: 0.2,
          pointStart: startYear,
          stacking: "normal",
          tooltip: {
            pointFormatter: smz.chart.getPointFormatterTableRow(1),
            valueSuffix: 'GWh'
          }
        },
        series: {
          events: {
            legendItemClick: function(e) {
              if (['households', 'meters'].indexOf(e.target.options.id) === -1)
                return;

              needsAnnotation = !e.target.options.visible;
              if (!needsAnnotation) {
                // check if annotation may be needed for other series
                for (i in this.chart.series) {
                  if (this.chart.series[i].options.id === e.target.options.id) {
                    // current item, already checked above - will show old visibility state anyway
                    continue;
                  }

                  if (['households', 'meters'].indexOf(this.chart.series[i].options.id) !== -1 &&
                    this.chart.series[i].visible === true) {
                    needsAnnotation = true;
                    break
                  }
                }
              }

              isAnnotated = this.chart.yAxis[1].axisTitle.textStr.indexOf("Potential FL") !== -1
              if (needsAnnotation && !isAnnotated) {
                this.chart.yAxis[1].update({title: {text: "Kund*innen gesamt / Potential FL"}});
              } else if (!needsAnnotation && isAnnotated) {
                this.chart.yAxis[1].update({title: {text: "Kund*innen gesamt"}});
              }
            }
          }
        }
      },
      title: {
        text: 'Stromerzeugung, -abgabe und Kundschaft'
      },
      series: [{
        name: "Kund*innen",
        data: data.customers,
        color: '#333',
        yAxis: 1,
        shadow: smz.chart.getBoldLineShadow(),
        zIndex: 1
      },{
        name: "Stromverkauf Flensburg",
        color: smz.color.swfl.darkGreen,
        type: 'column',
        data: data.sales.map(function(entry, i) { return entry * data.salesFL[i]; }),
        tooltip: {
          pointFormatter: function () {
            return '<tr><td><b>Stromabgabe gesamt:</b></td><td style="text-align: right"><b>'
            + Highcharts.numberFormat(this.stackTotal, 1) + ' GWh'
            + '</td></tr><tr><td><span style="color:' + this.color + '">●</span>&nbsp;' 
            + this.series.name + ':&nbsp;&nbsp;&nbsp;<b>' 
            + Highcharts.numberFormat(data.salesFL[this.index] * 100, 1) 
            + ' % →&nbsp;</b></td><td style="text-align: right"><b>' 
            + Highcharts.numberFormat(this.y, 1) + ' GWh</b></td></tr>';
          }
        },
        borderWidth: 0
      },{
        name: "Stromverkauf außerhalb",
        data: data.sales.map(function(total, i) { return total - (total * data.salesFL[i]); }),
        color: smz.color.swfl.lightGreen,
        opacity: 0.9,
        type: 'column'
      },{
        type: "column",
        name: "Eigene Stromproduktion (Kohle + Gas)",
        data: data.production,
        color: Highcharts.defaultOptions.colors[8],
        pointPadding: 0,
        stack: 1,
        zIndex: -1
      },{
        color: smz.color.swfl.darkGreen,
        data: data.meters,
        id: "meters",
        name: "Zähler im Netz",
        shadow: smz.chart.getBoldLineShadow(),
        visible: false,
        zones: smz.chart.getDottedZone(2005, 2007)
      },{
        color: Highcharts.Color(smz.color.swfl.darkGreen).brighten(-.3).get('rgb'),
        data: data.households,
        id: "households",
        name: "Hausanschlüsse",
        shadow: smz.chart.getBoldLineShadow(),
        visible: false,
        zones: smz.chart.getDottedZone(2005, 2007)
      }],
      xAxis: {
        categories: data.years,
        tickmarkPlacement: "between"
      },
      yAxis: [{
        title: {
          margin: 6,
          text: "Mio. KWh"
        },
        labels: {
          style: {
            color: smz.color.swfl.darkGreen,
          }
        },
        reversedStacks: false
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
      capacity: smz.fn.extractColumn(swflData.Electricity, "capacity", 2004),
      peak: smz.fn.extractColumn(swflData.Electricity, "peak", 2004),
    };

    return hc.chart('stromnetz', {
      plotOptions: {
        area: {
          connectNulls: true,
          marker: {
            enabled: false
          },
          pointStart: 2004,
          tooltip: {
            valueSuffix: 'km'
          },
          zoneAxis: "x",
          zones: smz.chart.getDottedZone(2005, 2007)
        },
        line: {
          connectNulls: true,
          pointStart: 2004,
          yAxis: 1,
          zoneAxis: "x",
          zones: smz.chart.getDottedZone(2005, 2007)
        }
      },
      title: {
        text: 'Stromnetze Flensburg'
      },
      series: [{
        type: 'area',
        name: "Hochspannungsnetz 60/150 kV",
        data: data.gridHigh,
        color: Highcharts.defaultOptions.colors[5],
        zones: smz.chart.getStripedZone(2005, 2007, Highcharts.defaultOptions.colors[5])
      },{
        type: 'area',
        name: "Mittelspannungsnetz 15 (20) kV",
        color: Highcharts.defaultOptions.colors[3],
        data: data.gridMedium,
        zIndex: -1,
        zones: smz.chart.getStripedZone(2005, 2007, Highcharts.defaultOptions.colors[3])
      },{
        name: "Niederspannungsnetz 220V",
        data: data.gridLow,
        color: Highcharts.defaultOptions.colors[6],
        type: 'area',
        zIndex: -2,
        zones: smz.chart.getStripedZone(2005, 2007, Highcharts.defaultOptions.colors[6], .5)
      },{
        data: data.peak,
        color: smz.color.swfl.darkGreen,
        name: "Höchstleistung im Netz",
        shadow: smz.chart.getBoldLineShadow(),
      }, {
        data: data.capacity,
        color: Highcharts.defaultOptions.colors[8],
        name: "Erzeugungskapazität",
        shadow: smz.chart.getBoldLineShadow(),
        visible: false
      }],
      xAxis: {
        min: 2003,
        max: 2019
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
          format: '{value} MW',
          style: {
            color: smz.color.swfl.darkGreen,
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