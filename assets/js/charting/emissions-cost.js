(function(hc, smz, swflData) {

  var certifcatePriceConfig = (function(data) {

    var startYear = 2012;

    var requiredCertificatesSeries = [],
        freeOfChargeAllocationsTotal = [],
        freeOfChargeAllocationsMain = smz.fn.extractColumn(data, "foc_main", startYear),
        freeOfChargeAllocationsNorth = smz.fn.extractColumn(data, "foc_north", startYear),
        freeOfChargeAllocationsSouth = smz.fn.extractColumn(data, "foc_south", startYear),
        freeOfChargeAllocationsEngelsby = smz.fn.extractColumn(data, "foc_engelsby", startYear),
        freeOfChargeAllocationsGluecksburg = smz.fn.extractColumn(data, "foc_gluecksburg", startYear),
        emissionsSeries = smz.fn.getEmissionsDataSeries(data, startYear),
        responsiveRule = hc.defaultOptions.responsive.rules[0];
    
    for (var i in freeOfChargeAllocationsMain) {
      var currentFreeOfChargeSum = freeOfChargeAllocationsMain[i]
          + freeOfChargeAllocationsNorth[i]
          + freeOfChargeAllocationsSouth[i]
          + freeOfChargeAllocationsEngelsby[i]
          + freeOfChargeAllocationsGluecksburg[i];
      
      freeOfChargeAllocationsTotal.push(currentFreeOfChargeSum);
      requiredCertificatesSeries.push(
        emissionsSeries[i] - currentFreeOfChargeSum
      );
    }

    responsiveRule.chartOptions.xAxis.minPadding = 0.06;
    responsiveRule.chartOptions.yAxis[1].offset = 0;
    return {
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
          dataLabels: {
            enabled: true,
            formatter: function() { return hc.numberFormat(this.y / 1000, 0) + "k"}
          },
          groupPadding: 0,
          pointPlacement: "between",
          pointRange: 365 * 24 * 3600 * 1000,
          pointIntervalUnit: "year",
          pointPadding: 0.1,
          pointStart: new Date("Jan 2 " + startYear).getTime(),
          yAxis: 0,
          zIndex: 0
        },
        line: {
          label: {
            enabled: true,
            onArea: false
          },
        }
      },
      responsive: {
        rules: [ responsiveRule ]
      },
      tooltip: {
        shared: true,
        useHTML: true,
        shadow: false,
        backgroundColor: 'white',
        style: {
          opacity: 1
        }
      },
      xAxis: {
        type: 'datetime',
        tickInterval: "year"
      },
      yAxis: [{
        labels: {
          style: {
            color: hc.defaultOptions.colors[8]
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
            color: hc.defaultOptions.colors[7]
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
        data: freeOfChargeAllocationsTotal,
        stack: 0,
        color: hc.defaultOptions.colors[2],
        yAxis: 0
      },{   // 1
        type: "column",
        stack: 0,
        name: "Benötigte Zertifikate",
        data: requiredCertificatesSeries,
        color: hc.defaultOptions.colors[8],
        yAxis: 0
      },{
        gapSize: 40,
        name: "EU ETS",
        color: hc.defaultOptions.colors[7],
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
        color: hc.defaultOptions.colors[7],
        fillColor: {
          pattern: {
            color: hc.defaultOptions.colors[3],
          }
        },
        visible: false,
        yAxis: 1
      }]
    }
  })(swflData.Emissions)

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
  smz.chart.CertificatePrices = hc.chart("entwicklung-co2-zertifikatspreise", certifcatePriceConfig)
  smz.chart.EuaExpenses = hc.chart('aufwendungen-fuer-emissionsrechte', euaCostConfig)
  
})(window.Highcharts, window.smz, window.SWFL)