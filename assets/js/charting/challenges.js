(function(hc, swflData, smz) {

  var carbonFactor = {
    beforeK13: {
      coal: .79464588275161,
      gas:  .20535411724839,
    },
    afterK13: {
      coal: .293088363954506,
      gas: .706911636045494
    }
  }

  var startYear = 2007;
  /**
   * @type {Number} greenco₂ncept end year
   */
  var GC_END_YEAR = 2050;

  /**
   * @type {Number} assumed year of Kessel 13 going into full production
   */
  var K13_START_YEAR = 2023;
  var swflDataStartYear = swflData[0].year;

  function getCarbonCausedByGas(year) {
    return swflData
  }

  function getOvershootRangeSeries(startYear, stopYear, shouldSeries, isSeries) {
    var should = shouldSeries || getGreenconceptPath(startYear, stopYear);
    var is = isSeries || getSeries(startYear);

    var range = [], overshoot = [], accumulatedOvershoot = [];
    var accumulated = 0;
    var valuesToGenerate = stopYear - startYear + 1;
    for (var i in should) {

      if (i == valuesToGenerate) {
        break;
      }

      if (is[i] !== undefined) {
        range.push([should[i], is[i]]);
      }
      var difference = (is[i] - should[i]) || 0;
      overshoot.push(difference);
      accumulated += difference;
      accumulatedOvershoot.push(accumulated);

    }
    return {
      range: range,
      overshoot: overshoot,
      accumulated: accumulatedOvershoot
    }
  }

  /**
   * @param {Number} startYear 
   * @param {Number} stopYear 
   * @returns {Array}
   */
  function getGreenconceptPath(startYear, stopYear) {
    stopYear = stopYear || GC_END_YEAR;
    if (startYear < swflDataStartYear) {
      throw RangeError("Cannot generate Path starting " + startYear + ", as earliest available year in data series is " + swflDataStartYear);
    }
    let startValue = parseInt(swflData[startYear - swflDataStartYear].co2);
    let returnArray = [startValue];
    let divisor = GC_END_YEAR - startYear;
    for (startYear++; startYear <= stopYear; startYear++) {

      if (startYear === stopYear) {
        returnArray.push(0);
        break;
      }

      returnArray.push(
        returnArray[returnArray.length-1] - startValue/divisor
      );
    }
    return returnArray;
  }

  function getSeries(startYear) {
    return smz.fn.extractColumn(swflData, "co2", startYear);
  }

  function getConsumedBudgetSeries(greenconceptPath, consumedBudget) {
    var sinkRate = greenconceptPath[0] - greenconceptPath[1];
    var consumedBudgetSeries = [], accumulatedBudgetSeries = [];

    var remainingAccumulatedBudget = 0;
    for (var i = 0; ; i++) {
      var currentYearBudget = i * sinkRate
      remainingAccumulatedBudget += currentYearBudget;
      if (remainingAccumulatedBudget > consumedBudget || i > 50) {
        var budgetPercentageConsumedCurrentYear = (remainingAccumulatedBudget - consumedBudget) / currentYearBudget;
        var budgetEndYear = GC_END_YEAR - i + budgetPercentageConsumedCurrentYear;

        consumedBudgetSeries.unshift([budgetEndYear, 0, greenconceptPath[greenconceptPath.length - 1 - i] - sinkRate * (budgetPercentageConsumedCurrentYear)]);
        accumulatedBudgetSeries.unshift([budgetEndYear, consumedBudget]);
        break;
      }
      consumedBudgetSeries.unshift([GC_END_YEAR - i, 0, greenconceptPath[greenconceptPath.length - 1 - i]]);
      accumulatedBudgetSeries.unshift([GC_END_YEAR - i, remainingAccumulatedBudget]);
    }

    return {
      area: consumedBudgetSeries,
      accumulated: accumulatedBudgetSeries
    };
  }

  var greenconceptPath = getGreenconceptPath(startYear);
  var emissionSeries = getSeries(startYear);
  var shouldIs = getOvershootRangeSeries(startYear, 2019, greenconceptPath, emissionSeries);
  var emissionsChartTemplate = {
    chart: {
      height: '50%'
    },
    tooltip: {
      valueSuffix: ' t',
      valueDecimals: 0,
      shared: true,
      split: true,
      formatter: function(tooltip) {
        if (this.x === undefined) {
          // for some reason function is called multiple times
          return;
        }
        
        var tooltipArray = tooltip.defaultFormatter.call(this, tooltip);
        tooltipArray[0] = "<strong>Ende " + this.x + "</strong>"
        if (this.x % 1 !== 0) {
          var remainder = this.x % 1;
          var monthSplit = 1 / 12;
          var monthEnd = Math.ceil(remainder / monthSplit);
          var monthString = new Date(monthEnd + "/01/2000").toLocaleDateString("de", {month: "short"});
          tooltipArray[0] = "<strong>" + monthString + " " + Math.ceil(this.x) + "</strong>"
        }
        return tooltipArray;
      },
    },
    xAxis: {
      tickInterval: 1,
      tickmarkPlacement: 'on'
    },
    yAxis: {
      labels: {
        format: '{value} t',
      },        
      title: {
        text: 'CO₂-Emissionen in Tonnen'
      },
      tickInterval: 100000
    },
    plotOptions: {
      arearange: {
        fillColor: {
          pattern: {
              color: '#d11'
          }
        }
      }
    },
    series: [{
      name: 'CO₂-Emissionen',
      color: 'red',
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>"
      },
      data: emissionSeries,
      pointStart: startYear,
      zIndex: 1,
      zoneAxis: 'x',
      zones: [{
        value: 2019
      },{
        dashStyle: "Dot",
        fillColor: "#ffffff"
      }]
    },{
      id: "gc",
      name: 'greenco₂ncept Pfad',
      color: 'green',
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>"
      },
      data: greenconceptPath,
      pointStart: startYear
    },{
      type: 'arearange',
      name: 'Mehrausstoß',
      color: '#e88',
      data: shouldIs.range,
      pointStart: startYear,
      linkedTo: 'gc',
      zIndex: -1,
      marker: {
        enabled: false
      },
      tooltip: {
        pointFormatter: function() {

          return "<tr>"
              + "<td>" + this.series.name + ': </td><td style="text-align: right"><strong>'+ Highcharts.numberFormat(shouldIs.overshoot[this.index], 0) + " t</strong></td><br>"
              + '<td>Gesamt / Kumuliert: </td><td style="text-align: right"><strong>' + Highcharts.numberFormat(shouldIs.accumulated[this.index], 0) + " t</strong></td>"
              + "</tr>";
        }
      },
      showInLegend: true
    }]
  };

  function drawEmissionsChart() {
    var template = Object.assign({}, emissionsChartTemplate);
    template.xAxis.max = 2019.5;
    template.credits = {
      enabled: true,
      text: "Quelle: EU ETS",
      href: "https://ec.europa.eu/clima/policies/ets/registry_en#tab-0-1",
      position: {
        y: -24
      }
    }
    return hc.chart('co2-emissionen-der-stadtwerke-flensburg', template);
  }

  function drawEmissionsChart2030() {
    var template = Object.assign({}, emissionsChartTemplate);
    template.xAxis.max = null;
    template.yAxis.min = 0;
    template.series[0].data = template.series[0].data.concat([560000, 560000, 560000, 420000, 420000, 420000, 420000, 420000, 420000, 420000, 420000]);
    shouldIs = getOvershootRangeSeries(startYear, 2030, greenconceptPath, template.series[0].data);
    var consumedBudgetSeries = getConsumedBudgetSeries(greenconceptPath, shouldIs.accumulated[shouldIs.accumulated.length - 1]);
    
    template.series[2].data = shouldIs.range;
    template.series[3] = {
      type: "arearange",
      name: "Fehlendes Budget",
      linkedTo: "gc",
      color: '#e88',
      marker: {enabled: false, symbol: "diamond"},
      zIndex: -1,
      data: consumedBudgetSeries.area,
      tooltip: {
        pointFormatter: function() {
          return "Verbleibendes Budget: <strong>" + Highcharts.numberFormat(consumedBudgetSeries.accumulated[this.index][1], 0) + " t</strong>"
        }
      },
      showInLegend: false
    };

    return hc.chart('co2-emissionen-der-stadtwerke-flensburg-bis-2030', template);
  }

  function drawCertificatePriceChart() {

    var requiredCertificatesSeries = [],
        freeOfChargeAllocationsSeries = smz.fn.extractColumn(swflData, "foc_certificates", 2012),
        emissionsSeries = getSeries(2012),
        responsiveRule = Highcharts.defaultOptions.responsive.rules[0];
    
    for (var i in freeOfChargeAllocationsSeries) {
      requiredCertificatesSeries.push(emissionSeries[i] - freeOfChargeAllocationsSeries[i]);
    }

    responsiveRule.chartOptions.xAxis.minPadding = 0.06;
    responsiveRule.chartOptions.yAxis[1].offset = 0;
    return hc.chart("entwicklung-co2-zertifikatspreise", {
      plotOptions: {
        column: {
          stacking: "normal",
          tooltip: {
            headerFormat: '<span style="font-size: 1.5em; font-weight: bold">{point.key}</span><table>',
            pointFormat: '<tr><td>{series.name}: </td>' +
            '<td style="color: {series.color}; text-align: right; font-weight: bold">&nbsp;{point.y} t</b></td></tr>',
            footerFormat: '</table>',
            xDateFormat: "%Y",
          },
          groupPadding: 0,
          pointPlacement: "between",
          pointRange: 365 * 24 * 3600 * 1000,
          pointIntervalUnit: "year",
          pointPadding: 0.1,
          pointStart: new Date("Jan 2 2012").getTime(),
          yAxis: 0,
          zIndex: 0
        }
      },
      responsive: {
        rules: [ responsiveRule ]
      },
      tooltip: {
        shared: true,
        useHTML: true
      },
      xAxis: {
        type: 'datetime',
        tickInterval: "year"
      },
      yAxis: [{
        labels: {
          style: {
            color: Highcharts.defaultOptions.colors[8]
          }
        },
        title: {
          text: "Zertifkate-Bedarf der Stadtwerke Flensburg"
        },
        min: 0,
        ceiling: 800000,  // not working with 2 axis' unless using endOnTick
        max: 800000       // not working with 2 axis'
      },
      {
        labels: {
          format: '<b>{value} €</b>',
          style: {
            color: Highcharts.defaultOptions.colors[7]
          },
          y: -2,
          x: -10
        },
        title: {
          text: "Preis in € pro Tonne CO₂-Emissionsrechte"
        },
        offset: -10,
        opposite: true,
        min: 0,
        softMax: 32,
      }],
      series: [{
        type: "column",
        name: "Gratis-Zertifikate",
        data: freeOfChargeAllocationsSeries,
        stack: 0,
        color: Highcharts.defaultOptions.colors[2],
        yAxis: 0

      },{
        type: "column",
        stack: 0,
        name: "Benötigte Zertifikate",
        data: requiredCertificatesSeries,
        color: Highcharts.defaultOptions.colors[8],
        yAxis: 0
      },{
        gapSize: 7,
        name: "EU ETS",
        color: Highcharts.defaultOptions.colors[7],
        data: window.SWFL.EUA,
        tooltip: {
          valueSuffix: ' €'
        },
        zIndex: 1,
        yAxis: 1
      },{
        name: "Prognose Fraunhofer ISE",
        type: "arearange",
        data: SWFL.EUE_ISE_forecast,
        marker: {
          enabled: false
        },
        color: Highcharts.defaultOptions.colors[7],
        fillColor: {
          pattern: {
            color: Highcharts.defaultOptions.colors[3],
          }
        },
        visible: false,
        yAxis: 1
      }]
    })
  }

  // https://jsfiddle.net/gz6053p2/

  window.smz.chart = window.smz.chart || {};
  window.smz.chart.Emissions = drawEmissionsChart();
  window.smz.chart.Emissions2030 = drawEmissionsChart2030();
  window.smz.chart.CertificatePrices = drawCertificatePriceChart();

})(window.Highcharts, window.SWFL.Emissions, window.smz)