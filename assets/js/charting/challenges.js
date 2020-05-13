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
    for (var i in should) {
      var difference = is[i] - should[i];
      range.push([should[i], is[i]]);
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
      throw RangeError(`Cannot generate Path starting ${startYear}, as earliest available year in data series is ${swflDataStartYear}.`);
    }
    let startValue = parseInt(swflData[startYear - swflDataStartYear].co2);
    let returnArray = [startValue];
    let divisor = GC_END_YEAR - startYear;
    for (startYear++; startYear <= stopYear; startYear++) {
      returnArray.push(
        returnArray[returnArray.length-1] - startValue/divisor
      );
    }
    return returnArray;
  }

  function getSeries(startYear) {
    return smz.fn.extractColumn(swflData, "co2", startYear);
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
    },
    xAxis: {
      categories: smz.fn.getYearSeries(startYear, 2020),
      tickWidth: 1,
      tickmarkPlacement: 'on'
    },
    yAxis: {
      labels: {
        format: '{value} t',
      },        
      title: {
        text: 'CO₂-Emissionen in Tonnen'
      }
    },
    series: [{
      name: 'CO₂-Emissionen',
      color: 'red',
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>"
      },
        data: emissionSeries,
      zIndex: 1      
    },{
      name: 'greenco₂ncept Pfad',
      color: 'green',
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>"
      },
        data: greenconceptPath
    },{
      type: 'arearange',
      name: 'Mehrausstoß',
      color: '#e88',
      fillColor: {
        pattern: {
            color: '#d11'
        }
      },
      data: shouldIs.range,
      linkedTo: ':previous',
      zIndex: -1,
      marker: {
        enabled: false
      },
      tooltip: {
        pointFormatter: function() {

          return `<tr>
              <td>${this.series.name}:</td><td style="text-align: right"><strong>${Highcharts.numberFormat(shouldIs.overshoot[this.x], 0)} t</strong></td><br>
              <td>Gesamt / Kumuliert: </td><td style="text-align: right"><strong>${Highcharts.numberFormat(shouldIs.accumulated[this.x], 0)} t</strong></td>
            </tr>`;
        }
      },
      showInLegend: true
    }]
  };

  function drawEmissionsChart() {
    var template = Object.assign({}, emissionsChartTemplate);
    template.xAxis.max = 2019 - startYear;
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

  function drawEmissionsChart2025() {
    var template = Object.assign({}, emissionsChartTemplate);
    template.xAxis.categories = template.xAxis.categories.concat(smz.fn.getYearSeries(2021, 2030));
    template.xAxis.max = 2030 - startYear;
    template.series[0].data = template.series[0].data.concat([560000, 560000, 560000, 420000, 420000, 420000, 420000, 420000, 420000, 420000, 420000]);
    shouldIs = getOvershootRangeSeries(startYear, 2030, greenconceptPath, template.series[0].data);
    template.series[2].data = shouldIs.range;

    return hc.chart('co2-emissionen-der-stadtwerke-flensburg-bis-2025', template);
  }

  function drawCertificatePriceChart() {

    var requiredCertificatesSeries = [],
        freeOfChargeAllocationsSeries = smz.fn.extractColumn(swflData, "foc_certificates", 2012),
        emissionsSeries = getSeries(2012);
    
    for (var i in freeOfChargeAllocationsSeries) {
      requiredCertificatesSeries.push(emissionSeries[i] - freeOfChargeAllocationsSeries[i]);
    }

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
          yAxis: 1,
          pointWidth: 50,
          pointPlacement: "between",
          pointRange: 365 * 24 * 3600 * 1000,
          pointIntervalUnit: "year",
          pointStart: new Date("Jan 2 2012").getTime(),
          zIndex: 0
        }
      },
      tooltip: {
        shared: true,
        useHTML: true
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: [{
        labels: {
          format: '<b>{value} €</b>',
          style: {
            color: Highcharts.defaultOptions.colors[7]
          }
        },
        title: {
          text: "Preis in € pro Tonne CO₂-Emissionsrechte"
        },
        opposite: true
      },{
        labels: {
          style: {
            color: Highcharts.defaultOptions.colors[8]
          }
        },
        title: {
          text: "Zertifkate-Bedarf der Stadtwerke Flensburg"
        },
        max: 800000,
        min: 0,
      }],
      series: [{
        gapSize: 7,
        name: "EU ETS",
        color: Highcharts.defaultOptions.colors[7],
        data: window.SWFL.EUA,
        tooltip: {
          valueSuffix: ' €'
        },
        zIndex: 1
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
              color: Highcharts.defaultOptions.colors[7]
          }
        },
        visible: false
      },{
        type: "column",
        stack: 0,
        name: "Benötigte Zertifikate",
        data: requiredCertificatesSeries,
        color: Highcharts.defaultOptions.colors[8],
      },{
        type: "column",
        name: "Gratis-Zertifikate",
        data: freeOfChargeAllocationsSeries,
        stack: 0,
        color: Highcharts.defaultOptions.colors[2],
      }]
    })
  }

  // https://jsfiddle.net/gz6053p2/

  window.smz.chart = window.smz.chart || {};
  window.smz.chart.Emissions = drawEmissionsChart();
  window.smz.chart.Emissions2025 = drawEmissionsChart2025();
  window.smz.chart.CertificatePrices = drawCertificatePriceChart();

})(window.Highcharts, window.SWFL.Emissions, window.smz)