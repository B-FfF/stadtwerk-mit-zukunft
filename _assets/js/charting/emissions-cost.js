(function(hc, smz, swflData) {

  var startYear = 2012;

  var responsiveRule = JSON.parse(JSON.stringify(hc.defaultOptions.responsive.rules[0]));
  responsiveRule.chartOptions.xAxis.minPadding = 0.06;
  responsiveRule.chartOptions.yAxis[1].offset = 0;

  // hardcoding placement until https://github.com/B-FfF/stadtwerk-mit-zukunft/issues/11 is fixed
  responsiveRule.chartOptions.xAxis.labels.x = 12;

  var certifcatePriceConfig = (function(data) {

    var requiredCertificatesSeries = [],
        freeOfChargeAllocationsTotal = [],
        freeOfChargeAllocationsMain = smz.fn.extractColumn(data, "foc_main", startYear),
        freeOfChargeAllocationsNorth = smz.fn.extractColumn(data, "foc_north", startYear),
        freeOfChargeAllocationsSouth = smz.fn.extractColumn(data, "foc_south", startYear),
        freeOfChargeAllocationsEngelsby = smz.fn.extractColumn(data, "foc_engelsby", startYear),
        freeOfChargeAllocationsGluecksburg = smz.fn.extractColumn(data, "foc_gluecksburg", startYear),
        emissionsSeries = smz.fn.getEmissionsDataSeries(data, startYear);
    
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

    return {
      chart: { type: 'column' },
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
        shadow: false,
        backgroundColor: 'white',
        style: { opacity: 1 }
      },
      xAxis: {
        labels: { x: 40 },
        type: 'datetime',
        tickInterval: 365 * 24 * 3600 * 1000
      },
      yAxis: [{
        labels: {
          style: { color: hc.defaultOptions.colors[8] }
        },
        title: { text: "Zertifkate-Bedarf der Stadtwerke Flensburg" },
        min: 0,
        ceiling: 800000,  // not working with 2 axis' unless using endOnTick
        max: 800000       // not working with 2 axis'
      },{
        labels: {
          format: '<b>{value} €</b>',
          style: { color: hc.defaultOptions.colors[7] },
          y: -2,
          x: -10
        },
        title: { text: "Preis in € pro Tonne CO₂-Emissionsrechte" },
        offset: -10,
        opposite: true,
        max: 100,        
        min: 0
      }],
      series: [{  // 0
        name: "Gratis-Zertifikate",
        data: freeOfChargeAllocationsTotal,
        stack: 0,
        color: hc.defaultOptions.colors[2],
        yAxis: 0
      },{   // 1
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
        tooltip: { valueSuffix: ' €' },
        type: "line",
        zIndex: 1,
        yAxis: 1
      },{
        name: "Prognose Fraunhofer ISE",
        type: "arearange",
        data: SWFL.EUE_ISE_forecast,
        marker: { enabled: false },
        color: hc.defaultOptions.colors[7],
        fillColor: { pattern: { color: hc.defaultOptions.colors[3] } },
        visible: false,
        yAxis: 1
      }]
    }
  })(swflData.Emissions)

  var euaCostConfig = {
    chart: { type: 'column' },
    plotOptions: { column: {
      groupPadding: 0,
      pointPlacement: "between",
      pointRange: 365 * 24 * 3600 * 1000,
      pointIntervalUnit: "year",
      pointStart: new Date("Jan 2 " + startYear).getTime(),
      pointPadding: 0.1,
      tooltip: {
        headerFormat: '<span style="font-size: 1.5em; font-weight: bold">{point.key}</span><table>',
        pointFormat: '<tr><td>{series.name}: </td>' +
        '<td style="color: {series.color}; text-align: right; font-weight: bold">&nbsp;{point.y} €</b></td></tr>',
        footerFormat: '</table>',
        xDateFormat: "%Y",
      },  
    }},
    responsive: {
      rules: [ responsiveRule ]
    },
    series: [{
      color: smz.gradient[8],
      data: smz.fn.extractColumn(swflData.Emissions, "total_eua_cost", startYear)
              .slice(0, -1) // temporary until definitive cost is available
              .concat(60 * 500000),
      dataLabels: {
        align: 'left',
        inside: true,
        enabled: true,
        formatter: function(e) {
          if (new Date(this.x).getFullYear() !== 2023) return hc.numberFormat(this.y / 1000000, 1) + " Mio. €"
          return 'Prognose: 30 Mio. € <br>(500.000 t * 60 €)'
        },
        rotation: -90,
        verticalAlign: 'bottom',
        y: -8,
      },                      
      name: 'Aufwendungen für Emissionrechte',
      zoneAxis: 'x',
      zones: [{
        value: new Date("Jan 2 " + 2023).getTime(),
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
      tooltip: { valueSuffix: ' €' },
      type: 'line',
      zIndex: 1,
      yAxis: 1
    }],
    xAxis: {
      labels: { x: 40 },
      type: 'datetime',
      tickInterval: 365 * 24 * 3600 * 1000,
    },
    yAxis: [{
      labels: {
        align: 'right',
        formatter: function () { return '<strong>' + this.value / 1000000 + ' Mio. €</strong>' },
        style: { color: hc.defaultOptions.colors[8] },
        y: -2,
        x: 0
      },
      title: { text: "Ausgaben für CO₂-Emissionsrechte" },
    },{
      max: 100,
      labels: {
        format: '<b>{value} €</b>',
        style: { color: hc.defaultOptions.colors[7] },
      },
      opposite: true,
      title: {
        text: "Preis in € pro Tonne CO₂-Emissionsrechte",
        style: { color: hc.defaultOptions.colors[7] },
      },
    }]
  }
  
  smz.chart = smz.chart || {};
  smz.chart.CertificatePrices = hc.chart("entwicklung-co2-zertifikatspreise", certifcatePriceConfig)
  smz.chart.EuaExpenses = hc.chart('aufwendungen-fuer-emissionsrechte', euaCostConfig)
  
})(window.Highcharts, window.smz, window.SWFL);