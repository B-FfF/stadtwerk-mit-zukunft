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

  function getCarbonCausedByGas(year) {
    return swflData
  }

  /**
   * @type {Number} greenco₂ncept end year
   */
  var GC_END_YEAR = 2050;

  /**
   * @type {Number} assumed year of Kessel 13 going into full production
   */
  var K13_START_YEAR = 2023;
  var swflDataStartYear = swflData[0].year;

  function getOvershootRangeSeries(startYear, stopYear) {
    var should = getGreenconceptPath(startYear, stopYear);
    var is = getSeries(startYear);

    var range = [], overshoot = [], accumulatedOvershoot = [];
    var accumulated = 0;
    for (var i in should) {
      range.push([should[i], is[i]]);
      var difference = is[i] - should[i];
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

  // https://jsfiddle.net/gz6053p2/
  let startYear = 2007;
  var shouldIs = getOvershootRangeSeries(startYear, 2019);
  let etcSource = "https://ec.europa.eu/clima/policies/ets/registry_en#tab-0-1";
  var emissionsChart = hc.chart('co2-emissionen-der-stadtwerke-flensburg', {
    chart: {
      height: '50%'
    },
    tooltip: {
      valueSuffix: ' t',
      valueDecimals: 0,
      shared: true,
      split: true,
    },
    plotOptions: {
      arearange: {
        fillColor: {
          pattern: {
            path: {
              d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
              strokeWidth: 3
            },
            width: 10,
            height: 10,
            opacity: 0.6
          }
        }
      }
    },
    xAxis: {
      categories: smz.fn.getYearSeries(startYear, 2020),
      tickWidth: 1,
      tickmarkPlacement: 'on'
    },
    yAxis: {
      title: {
        text: 'CO₂-Emissionen in Tonnen'
      }
    },
    series: [{
      type: 'line',
      name: 'CO₂-Emissionen',
      color: 'red',
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>"
      },
        data: getSeries(startYear),
      zIndex: 1      
    },{
      type: 'line',
      name: 'greenco₂ncept Pfad',
      color: 'green',
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>"
      },
        data: getGreenconceptPath(startYear, 2019)
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
  });

  window.smz.chart = window.smz.chart || {};
  window.smz.chart.Emissions = emissionsChart;

})(window.Highcharts, window.SWFL.Emissions, window.smz)