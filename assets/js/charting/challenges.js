(function(hc, swflData, smz) {

  var startYear = 2007;
  /**
   * @type {Number} greenco₂ncept end year
   */
  var GC_END_YEAR = 2050;

  var swflDataStartYear = swflData[0].year;

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

  function getEndDate(value) {
    var remainder = value % 1;
    var monthSplit = 1 / 12;
    var monthEnd = Math.ceil(remainder / monthSplit);
    var monthString = new Date(monthEnd + "/01/2000").toLocaleDateString("de", {month: "short"});
    return monthString + " " + Math.ceil(value);
  }

  var greenconceptPath = getGreenconceptPath(startYear);
  var emissionSeries = getSeries(startYear);
  var shouldIs = getOvershootRangeSeries(startYear, 2020, greenconceptPath, emissionSeries);
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
          tooltipArray[0] = "<strong>" + getEndDate(this.x) + "</strong>"
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
        formatter: function() {
          return Highcharts.numberFormat(this.value, 0) + " t";
        }
      },        
      title: {
        text: 'CO₂-Emissionen in Tonnen'
      },
      tickInterval: 100000
    },
    plotOptions: {
      line: {
        pointStart: startYear
      },
      arearange: {
        pointStart: startYear,
        fillColor: {
          pattern: {
              color: '#d11'
          }
        }
      }
    },
    series: [{  // 0
      id: "gc",
      name: 'greenco₂ncept Pfad',
      color: 'green',
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>"
      },
      data: greenconceptPath,
    },{         // 1
      name: 'CO₂-Emissionen',
      color: 'red',
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>"
      },
      data: emissionSeries,
      zIndex: 1,
      zoneAxis: 'x',
      zones: [{
        value: 2020
      },{
        dashStyle: "Dot"
      }]
    },{         // 2
      type: 'arearange',
      name: 'Mehrausstoß',
      color: '#e88',
      data: shouldIs.range,
      id: 'overshoot',
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
    template.xAxis.max = 2020.5;
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

  var animation = {
    duration: 2000,
    easing: 'linear'    
  };

  function drawEmissionsChart2030() {
    var template = Object.assign({}, emissionsChartTemplate);

    template.title = {
      align: 'right',
      verticalAlign: 'middle',
      floating: true,
      style: {
        color: 'rgba(250,0,0,1)',
        fontSize: '1.5em'
      }
    };
    template.xAxis.max = null;
    template.yAxis.min = 0;
    template.yAxis.max = 700000;
    template.series[1].animation = animation;
    template.series[1].data = template.series[1].data.concat([520000, 520000, 400000, 400000, 400000, 400000, 400000, 400000, 400000, 400000]);
    shouldIs = getOvershootRangeSeries(startYear, 2030, greenconceptPath, template.series[1].data);
    var consumedBudgetSeries = getConsumedBudgetSeries(greenconceptPath, shouldIs.accumulated[ shouldIs.accumulated.length - 1]);
    var motionData = [
      template.series[1].data,
      shouldIs.range,
      shouldIs.accumulated
    ];

    template.series[1].visible = true;
    template.series[2].visible = true;
    template.xAxis.plotLines = [{
      label: {
        text: 'Kessel 12',
        style: {
          color: '#999'
        },
        verticalAlign: 'middle'
      },
      value: 2015.3
    },{
      label: {
        text: 'Kessel 13',
        style: {
          color: '#999'
        },
        verticalAlign: 'middle'
      },
      value: 2022
    }];

    template.series[3] = {
      type: "arearange",
      name: "Fehlendes Budget",
      linkedTo: "overshoot",
      color: '#e88',
      marker: {enabled: false, symbol: "diamond"},
      zIndex: -1,
      data: consumedBudgetSeries.area[0],
      tooltip: {
        pointFormatter: function() {
          return "Verbleibendes Budget: <strong>" + Highcharts.numberFormat(consumedBudgetSeries.accumulated[this.index][1], 0) + " t</strong>"
        }
      },
      showInLegend: false
    };

    var chart = hc.chart('co2-emissionen-der-stadtwerke-flensburg-bis-2030', template);
    prepareMotion(chart, motionData);
    return chart;
  }

  function prepareMotion(chart, data) {

    var input = document.getElementById('play-range'),
      output = document.getElementById('play-output'),
      $playPauseButton = document.getElementById('play-pause-button')

    /**
    * Update the chart. This happens either on updating (moving) the range input,
    * or from a timer when the timeline is playing.
    */
    function update(increment) {

      var currentIndex = parseInt(input.value); 
      if (increment) {
        currentIndex++;
        input.value = currentIndex;
      }

      chart.series[1].setData(data[0].slice(0, currentIndex + 1), false, animation); // Increment emissions
      chart.series[2].setData(data[1].slice(0, currentIndex + 1), false, animation); // Increment overshoot area

      var consumedBudgetSeries = getConsumedBudgetSeries(greenconceptPath, data[2][currentIndex]);
      chart.series[3].setData(consumedBudgetSeries.area); // Increment consumed budget
      if (consumedBudgetSeries.area[0][0] !== 2050) {
        chart.setTitle({text: "greenco₂ncept-<br>Budget endet<br/>" + getEndDate(consumedBudgetSeries.area[0][0]) });
      } else {
        chart.setTitle({text: undefined });
      }

      output.innerHTML = startYear + currentIndex // Output value
      
      if (currentIndex >= parseInt(input.max)) { // Auto-pause
          pause($playPauseButton);
      }
    }

    /**
    * Play the timeline.
    */
    function play(button) {
      if (parseInt(input.value) >= parseInt(input.max)) {
        return;
      }

      button.title = 'pause';
      button.className = 'fa fa-pause';
      chart.sequenceTimer = setInterval(function () {
          update(1);
      }, 800);
    }

    /**
    * Pause the timeline, either when the range is ended, or when clicking the pause button.
    * Pausing stops the timer and resets the button to play mode.
    */
    function pause(button) {
      button.title = 'play';
      button.className = 'fa fa-play';
      clearTimeout(chart.sequenceTimer);
      chart.sequenceTimer = undefined;
    }

    $playPauseButton.addEventListener('click', function () {
      if (chart.sequenceTimer === undefined) {
          play(this);
      } else {
          pause(this);
      }
    });

    /**
    * Update the chart when the input is changed
    */
   document.getElementById('play-range').addEventListener('input', function() {update();});
   update();
  }

  function drawCertificatePriceChart() {

    var requiredCertificatesSeries = [],
        freeOfChargeAllocationsSeries = smz.fn.extractColumn(swflData, "foc_certificates", 2012),
        emissionsSeries = getSeries(2012),
        responsiveRule = Highcharts.defaultOptions.responsive.rules[0];
    
    for (var i in freeOfChargeAllocationsSeries) {
      requiredCertificatesSeries.push(emissionsSeries[i] - freeOfChargeAllocationsSeries[i]);
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
        softMax: 42,
      }],
      series: [{  // 0
        type: "column",
        name: "Gratis-Zertifikate",
        data: freeOfChargeAllocationsSeries,
        stack: 0,
        color: Highcharts.defaultOptions.colors[2],
        yAxis: 0
      },{   // 1
        type: "column",
        stack: 0,
        name: "Benötigte Zertifikate",
        data: requiredCertificatesSeries,
        color: Highcharts.defaultOptions.colors[8],
        yAxis: 0
      },{
        gapSize: 40,
        name: "EU ETS",
        color: Highcharts.defaultOptions.colors[7],
        data: window.SWFL.EUA,
        shadow: {
          color: "#FFF",
          width: 4,
          opacity: 1
        },
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

  function drawMethaneChart() {
    var emissionsSeries = emissionsChartTemplate.series[1].data,
      methaneSeriesStartYear = 2016,
      template = emissionsChartTemplate;

    var carbonByGasPerNormCubic = 2,
        gasKilogramPerNormCubic = 0.671,
        carbonEquivalentOfGas100Years = 30,
        carbonEquivalentOfGas20Years = 84,
        assumedLeakageFactor = 0.02,
        assumedMethaneConcentrationInGas = 0.9;

    var carbonFactor = {
      startK12: {
        coal: .869001297016861,
        gas:  .130998702983139
      },
      beforeK13: {
        coal: .79464588275161,
        gas:  .20535411724839,
      },
      afterK13: {
        coal: .293088363954506,
        gas:  .706911636045494
      }
    };

    function calculateGasSeries() {

      var emissionsShareForGasSeries = [],
          gasUsedSeries = [],
          greenhouseEffectGas100YearsSeries = [],
          greenhouseEffectGas20YearsSeries = [];

      for (var currentYear = 2016; currentYear <= 2030; currentYear++) {

        var emissionsFactorGas = currentYear === 2016 ? carbonFactor.startK12.gas : currentYear < 2023 ? carbonFactor.beforeK13.gas : carbonFactor.afterK13.gas;
        var emissionsByGasInTons = emissionsSeries[currentYear - startYear] * emissionsFactorGas;
        emissionsShareForGasSeries.push(emissionsByGasInTons);
        
        var gasUsedTonnes = emissionsByGasInTons / carbonByGasPerNormCubic * gasKilogramPerNormCubic;
        gasUsedSeries.push(gasUsedTonnes);
        greenhouseEffectGas100YearsSeries.push(gasUsedTonnes * assumedLeakageFactor * carbonEquivalentOfGas100Years * assumedMethaneConcentrationInGas);
        greenhouseEffectGas20YearsSeries.push(gasUsedTonnes * assumedLeakageFactor * carbonEquivalentOfGas20Years * assumedMethaneConcentrationInGas);
      }

      return {
        used: gasUsedSeries,
        emissionsShare: emissionsShareForGasSeries,
        greenhouseEffect100Years: greenhouseEffectGas100YearsSeries,
        greenhouseEffect20Years: greenhouseEffectGas20YearsSeries
      }
    }

    var gasSeries = calculateGasSeries();
    var chartConfig = {
      chart: {
        height: "50%"
      },
      yAxis: Object.assign({
        reversedStacks: false
      }, template.yAxis),
      plotOptions: template.plotOptions,
      xAxis: {
        min: 2014.5,
        max: 2030.5
      },
      series: [
      Object.assign({}, template.series[1]),  // [0]
      {  // [1]
        name: "Anteil Erdgas-Verbrennung an CO₂-Emissionen",
        data: gasSeries.emissionsShare,
        pointStart: methaneSeriesStartYear,
        visible: false,
        color: "rgba(0,0,0,0.3)"
      },
      {  // [2]
        name: "Verbrauch Erdgas",
        data: gasSeries.used,
        pointStart: methaneSeriesStartYear
      },        
      {  // [3]
        name: "CO₂-Äquivalent Methan (100 Jahre)",
        data: gasSeries.greenhouseEffect100Years,
        stack: 0,
        stacking: "normal",
        pointStart: methaneSeriesStartYear,
        type: "area",
        color: Highcharts.defaultOptions.colors[6],
        zIndex: 2
      },
      Object.assign({}, template.series[1]),  // duplicating series to allow separate stacks for 20 / 100 year perspective
      {  // [5]
        name: "CO₂-Äquivalent Methan (20 Jahre)",
        data: gasSeries.greenhouseEffect20Years,
        stack: 1,
        stacking: "normal",
        pointStart: methaneSeriesStartYear,
        type: "area",
        color: Highcharts.defaultOptions.colors[3]
      },
      template.series[0],   // [6]
      ],
      tooltip: template.tooltip
    };

    Object.assign(chartConfig.series[0], {
      color: 'rgba(255, 0, 0, 0.2)',
      enableMouseTracking: false,
      stack: 0,
      stacking: "normal",
      type: "area",
      fillColor: "transparent",
      events: {legendItemClick: function (e){ e.preventDefault();}}
    });

    Object.assign(chartConfig.series[4], {
      color: 'rgba(255, 0, 0, 0.2)',
      stack: 1,
      stacking: "normal",
      type: "area",
      fillColor: "transparent",
      showInLegend: false
    });

    Object.assign(chartConfig.series[6], {
      color: 'rgba(0, 128, 0, 0.2)',
      visible: false,
      zones: []
    });

    chartConfig.yAxis.title.enabled = false;
    chartConfig.plotOptions.area = chartConfig.plotOptions.line;
    chartConfig.plotOptions.area.marker = {symbol: "circle"};
    chartConfig.plotOptions.line.zones = chartConfig.series[0].zones;
    chartConfig.plotOptions.line.zoneAxis = "x";

    return hc.chart('diagramm-klimaschaedlichkeit-methan', chartConfig);
  }

  // https://jsfiddle.net/gz6053p2/



  window.smz.chart = window.smz.chart || {};
  var charts = {
    Emissions: drawEmissionsChart,
    Emissions2030: drawEmissionsChart2030,
    CertificatePrices: drawCertificatePriceChart,
    Methane: drawMethaneChart
  };
  for (var key in charts) {
    try {
      window.smz.chart[key] = smz.chart.enableFullscreen(charts[key]());
    } catch (error) {
            
    }
  }

})(window.Highcharts, window.SWFL.Emissions, window.smz)