(function(hc, smz) {

  hc.chart('stromgestehungskosten', {
    chart: {
      type: "columnrange",
      // height: "100%"
    },
    plotOptions: {
      columnrange: {
        borderWidth: 2,
        borderColor: '#000',
        colorByPoint: true,
        colors: [
          '#ff0',
          Highcharts.defaultOptions.colors[0],
          '#ff0',
          Highcharts.defaultOptions.colors[1],
          '#f00',
          '#003399',
          '#ff0',
          Highcharts.defaultOptions.colors[2],
        ]
      }
    },
    tooltip: {
      style: {
        fontSize: "1em"
      },
      valueSuffix: " ct",
      format: "{point.value}",
      headerFormat: '<span style="font-size: 1em"><b>{point.key}</b></span><br/>',
      // formatter: function() {console.log(this)},
      pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.low} - {point.high}</b><br/>'
    },
    xAxis: {
      categories: [
        'PV frei (Norddt.)',
        'Wind Onshore',
        'PV Dach ab 70m² (Norddt.)',
        'Steinkohle',
        'Erdgas GuD',
        'Wind Offshore',
        'PV Dach klein (Norddt.)',
        'Biogas'
      ],
      labels: {
        style: {
          fontSize: "1.5em"
        }
      }
    },
    yAxis: {
      title: {
        text: "Stromgestehungskosten Cent / kWh",
        style: {
          fontSize: "1em"
        }
      },
      labels: {
        style: {
          fontSize: '1em'
        }
      },
      min: 0,
      tickInterval: 2
    },
    series: [{
      name: 'Stromgestehungskosten',
      data: [
        [5.08, 6.77],
        [4.0, 8.2], // geschätzt
        [6.77, 8.46],
        [6.3, 9.8],   // geschätzt
        [7.8, 10],    // geschätzt
        [7.5, 13.75], // geschätzt
        [9.89, 11.54], 
        [10.2, 14.75], // geschätzt
      ],
      showInLegend: false
    }]
  })

})(window.Highcharts, window.smz)