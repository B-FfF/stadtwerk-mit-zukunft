/**
 * Plugin to allow plot band Z indexes in between series
 */
Highcharts.wrap(Highcharts.PlotLineOrBand.prototype, 'render', function (proceed) {
	var chart = this.axis.chart;
    
    proceed.call(this);

	if (!chart.seriesGroup) {
		chart.seriesGroup = chart.renderer.g('series-group')
			.attr({ zIndex: 3 })
			.add();
	}

    if (this.svgElem.parentGroup !== chart.seriesGroup) {
    	this.svgElem
        	.attr({ zIndex: this.options.zIndex })
        	.add(chart.seriesGroup);
    }
    return this;
});

(function(hc, smz, swflData) {

  var missingYears = [2017, 2018, 2019, 2020, 2021];

  function getMissingAsterisk(missingYears, currentYear) {
    if (!missingYears || missingYears.indexOf(currentYear) === -1) {
      return "";
    }

    return "<strong style='color: #000;'>*</strong>";
  }

  function markMissing(label) {
    return getMissingAsterisk(this.axis.userOptions.missing, label.value) + label.value;
  }

  hc.setOptions({
    chart: {
      height: 400
    },
    xAxis: {
      tickInterval: 1,
      labels: {
        formatter: markMissing
      }
    },
    tooltip: {
      useHTML: true,
      shared: true,
      formatter: function (e) {
        var missingYears = e.chart.userOptions.xAxis ? e.chart.userOptions.xAxis.missing : undefined;
        return ['<span style="font-size: 1.5em; font-weight: bold">' + this.x
        + getMissingAsterisk(missingYears, this.x) + '</span><table>']
        .concat(this.points.map(function(point) {

          if (point.series.tooltipOptions.pointFormatter) {
            return point.series.tooltipOptions.pointFormatter.apply(point);
          }

          var color = point.color.stops !== undefined ? point.color.stops[0][1] : point.color;

          var seriesName = point.series.userOptions.id === "energy_taxes" ? 'davon Strom & Erdgassteuern' : point.series.name;
          return '<tr><td><span style="color:'+ color +'; padding-top: 20px">●</span>&nbsp;' + seriesName + ':&nbsp;</td>'
          + '<td style="text-align: right"><b>' + hc.numberFormat(point.y, point.series.tooltipOptions.valueDecimals) 
          + (point.series.tooltipOptions.valueSuffix ? point.series.tooltipOptions.valueSuffix : '') + '</b></td></tr>';
        }), ['</table>']);

      }
   },
  });

  var data = {
    ebit: smz.fn.extractColumn(swflData.Results, "EBIT"),
    ebitCorporation: smz.fn.extractColumn(swflData.Results, "EBIT_corp"),
    earnings: smz.fn.extractColumn(swflData.Results, "earnings"),
    earningsCorporation: smz.fn.extractColumn(swflData.Results, "earnings_corp"),
    dividend: smz.fn.extractColumn(swflData.Results, "dividend"),
    sales: smz.fn.extractColumn(swflData.Results, "sales"),
    energyTaxes: smz.fn.extractColumn(swflData.Results, "energy_taxes"),
    salesCorporation: smz.fn.extractColumn(swflData.Results, "sales_corp"),
    equity: smz.fn.extractColumn(swflData.Results, "equity"),
    provision: smz.fn.extractColumn(swflData.Results, "provision"),
    creditLiabilities: smz.fn.extractColumn(swflData.Results, "credit_liabilities"),
    creditLiabilitiesShort: smz.fn.extractColumn(swflData.Results, "credit_liabilities_short"),
    creditLiabilitiesMedium: smz.fn.extractColumn(swflData.Results, "credit_liabilities_medium"),
    creditLiabilitiesLong: smz.fn.extractColumn(swflData.Results, "credit_liabilities_long"),
    otherLiabilities: smz.fn.extractColumn(swflData.Results, "other_liabilities")
  };

    
  function mirror(series) {
    return series.map(function(value) {return -value})
  }

  function drawEarningsChart() {

    hc.chart('gewinn-entwicklung', {
      chart: {
        type: 'column'
      },
      legend: {
        padding: 0
      },
      plotOptions: {
        column: {
          pointStart: 2000,
          grouping: false,
          shadow: false,
          borderWidth: 0,
          groupPadding: 0.1,
          tooltip: {
            valueSuffix: ' €'
          }
        },
        line: {
          tooltip: {
            valueSuffix: ' %'
          }
        }
      },
      title: {
        text: 'Gewinnentwicklung',
        floating: true,
        y: 16
      },
      series: [{
        name: "EBIT Konzern",
        data: data.ebitCorporation,
        color: smz.fn.getGradient("#999"),
        pointPadding: 0.25,
        pointPlacement: -0.22,
      },{
        name: "EBIT GmbH",
        data: data.ebit,
        color: smz.fn.getGradient("#666"),
        pointPadding: 0.25,
        pointPlacement: 0.2,
      },{
        name: "Gewinn Konzern",
        color: smz.gradient[10],
        data: data.earningsCorporation,
        pointPadding: 0.25,
        pointPlacement: -0.22,
        borderWidth: 0.5,
        zones: [{
          value: 0,
          color: smz.fn.getGradient("rgba(255,0,0,.5)")
        }]
      },{
        name: "Gewinn GmbH",
        color: smz.gradient[11],
        data: data.earnings,
        pointPadding: 0.25,
        pointPlacement: 0.2,
        borderWidth: 0.5,
        zones: [{
          value: 0,
          color: smz.fn.getGradient("rgba(255,0,0,.8)")
        }]
      },{
        type: 'line',
        name: "Umsatzrentabilität (EBIT) Konzern",
        data: data.ebitCorporation.map(function(ebitCorporation, i) { return ebitCorporation * 100 / data.salesCorporation[i]; }),
        color: smz.color.swfl.lightGreen,
        pointStart: 2000,
        yAxis: 1,
        shadow: smz.chart.getBoldLineShadow(),
        marker: {
          radius: 2
        },
        visible: false
      },{
        type: 'line',
        name: "Umsatzrentabilität (EBIT) GmbH",
        data: data.ebit.map(function(ebit, i) { return ebit * 100/ data.sales[i]; }),
        color: smz.color.swfl.darkGreen,
        pointStart: 2000,
        shadow: smz.chart.getBoldLineShadow(),
        marker: {
          radius: 2
        },
        yAxis: 1,
        visible: false
      }],
      xAxis: {
        missing: missingYears,
      },
      yAxis: [{
        title: {
          text: "Gewinn in Mio. €"
        },
        min: -12000000,
        max: 36000000
      },{
        labels: {
          format: '{value} %'
        },
        opposite: true,
        title: {
          text: undefined
        }
      }]
    });
  }

  function drawSalesChart() {

    hc.chart('umsatz-entwicklung', {
      chart: {
        type: 'column',
      },
      plotOptions: {
        column: {
          pointStart: 2000,
          grouping: false,
          shadow: false,
          borderWidth: 0,
          groupPadding: 0.05
        }
      },
      title: {
        text: 'Umsatzentwicklung',
        floating: true,
        y: 16
      },
      series: [{
        name: 'Umsätze Konzern',
        color: smz.gradient[10],
        data: data.salesCorporation,
        stack: "konzern",
        pointPadding: 0
      }, {
        name: 'Umsätze GmbH',
        pointPadding: 0.1,
        color: smz.gradient[11],
        data: data.sales,
      },{
        name: 'Strom und Erdgassteuer',
        color: smz.fn.getGradient("#dddddd"),
        id: 'energy_taxes',
        data: data.energyTaxes,
      }],
      tooltip: {
        valueSuffix: ' €'
      },
      xAxis: {
        missing: missingYears,
      },
      yAxis: [{
        tickInterval: 100000000,
        title: {
          text: "Umsätze in Mio. €"
        }
      }]
    });
  }

  function drawCapitalChart() {

    var config = {
      chart: {
        type: 'area'
      },
      legend: {
        padding: 0
      },
      plotOptions: {
        area: {
          pointStart: 2000,
          stacking: "normal",
          marker: {
            enabled: false
          },
          tooltip: {
            valueSuffix: ' €',
            pointFormatter: function () {
              if (this.y == 0) return false;
              var color = this.color.stops !== undefined ? this.color.stops[0][1] : this.color;
              return '<tr><td><span style="color:' + color + '; padding-top: 20px">●</span>&nbsp;' + this.series.name + ':&nbsp;</td>'
              + '<td style="text-align: right"><b>' + hc.numberFormat(Math.abs(this.y), 2) + this.series.tooltipOptions.valueSuffix + '</b></td></tr>';
            }
          }
        },
        line: {
          pointStart: 2000,
          tooltip: {
            valueSuffix: ' %'
          }
        }
      },
      title: {
        text: 'Eigen- vs. Fremdkapital GmbH',
        floating: true,
        y: 20
      },
      series: [{
        name: "Eigenkapital",
        data: data.equity,
        color: smz.gradient[11],
      },{
        name: "Andere Verbindlichkeiten",
        color: smz.fn.getGradient("#333"),
        data: mirror(data.otherLiabilities),
        stack: "debt",
      },{
        name: "Rückstellungen",
        color: smz.fn.getGradient("#666"),
        data: mirror(data.provision),
        stack: "debt"
      },{ // to fill up missing split data for year 2000
        name: "Kredite gesamt",
        color: smz.gradient[5],
        data: mirror([data.creditLiabilities[0]]),
        showInLegend: false,
        stack: "debt"
      },{
        name: "Kredite < 1 Jahr",
        color: smz.gradient[6],
        description: "Verbindlichkeiten gegenüber Kreditinstituten, Laufzeit < 1 Jahr",
        data: mirror(data.creditLiabilitiesShort),
        stack: "debt"
      },{
        name: "Kredite 1 - 5 Jahre",
        color: smz.gradient[3],
        description: "Verbindlichkeiten gegenüber Kreditinstituten, Laufzeit 1 bis 5 Jahre",
        data: mirror(data.creditLiabilitiesMedium),
        stack: "debt"
      },{
        name: "Kredite > 5 Jahre",
        color: smz.gradient[5],
        description: "Verbindlichkeiten gegenüber Kreditinstituten, Laufzeit > 5 Jahre",
        data: mirror(data.creditLiabilitiesLong),
        stack: "debt"
      },{
        color: smz.gradient[11],
        data: data.equity.map(function(equityCapital, i) {
          var totalCapital = equityCapital + data.provision[i] + data.creditLiabilities[i] + data.otherLiabilities[i];
          return Math.round(equityCapital * 100/ totalCapital, 2);
        }),
        name: 'Eigenkapitalquote',
        shadow: smz.chart.getBoldLineShadow(),
        type: 'line',
        visible: false,
        yAxis: 2
      },{
        type: 'line',
        name: "Verschuldungsquote",
        data: data.equity.map(function(equityCapital, i) { 
          var creditLiabilities = (i === 0) 
          ? data.creditLiabilities[0] 
          : data.creditLiabilitiesShort[i] 
          + data.creditLiabilitiesMedium[i] 
          + data.creditLiabilitiesLong[i];

          return (
            data.provision[i] 
            + data.otherLiabilities[i]
            + creditLiabilities
            ) / equityCapital * 100;
        }),
        color: smz.gradient[4],
        pointStart: 2000,
        yAxis: 1,
        shadow: smz.chart.getBoldLineShadow(),
        marker: {
          radius: 2
        },
        zIndex: 2
      }],
      yAxis: [{
        title: {
          text: "Kapital in Mio. €"
        },
        labels: {
          formatter: function () {
              return Math.abs(Math.round(this.value / 1000000)) + 'M';
          }
        },
        max: 200000000,
        min: -350000000,
        tickInterval: 50000000,
        endOnTick: false,
        reversedStacks: false,
        plotLines: [{
          value: 0,
          color: '#fff',
          width: 2,
          zIndex: 1
        }]
      },{
        labels: {
          format: '{value} %',
          style: {
            color: hc.defaultOptions.colors[4],
          }
        },
        opposite: true,
        title: {
          text: "Verschuldungsquote"
        },
        tickInterval: 50,
        startOnTick: false,
        endOnTick: false,
        max: 275,
        min: 0,
        reversed: true
      }, {
        startOnTick: false,
        endOnTick: false,
        max: 100,
        min: -125,
        labels: {
          format: '{value} %',
          style: {
            color: smz.color.swfl.darkGreen,
          }
        },
        opposite: true,
        title: {
          text: "Eigenkapitalquote"
        },
      }]
    }
    
    return hc.chart('kapitalstruktur', config);
  }

  dividendChart = {
    chart: {
      type: 'column'
    },
    plotOptions: {
      column: {
        pointStart: 2000,
        tooltip: {
          valueDecimals: 0,
          valueSuffix: ' €'
        }
      }
    },
    title: {
      text: 'Gewinnabführungen an die Stadt Flensburg'
    },
    series: [{
      groupPadding: 0.1,
      pointPadding: 0.1,
      color: smz.gradient[10],
      data: data.dividend,
      name: 'Ausschüttung'
    }],
    xAxis: {
      tickPositions: smz.fn.getYearSeries(2001, 2021),
    },
    yAxis: {
      title: {
        text: 'Abführung Mio. €'
      },
      endOnTick: false
    }
  }

  smz.chart = smz.chart || {};
  smz.chart.Sales = drawSalesChart();
  smz.chart.Earnings = drawEarningsChart();
  smz.chart.Capital = drawCapitalChart();
  smz.chart.Dividend = hc.chart('gewinnabfuehrung-stadt', dividendChart);

})(window.Highcharts, window.smz, window.SWFL.Business)