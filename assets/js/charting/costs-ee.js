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
          '#ff0',
          '#003399',
          '#f00',
          Highcharts.defaultOptions.colors[2],
          Highcharts.defaultOptions.colors[1]
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
        'PV Dach klein (Norddt.)',
        'Wind Offshore',
        'Erdgas GuD',
        'Biogas',   // mit Kraft-Wärme-Kopplung
        'Steinkohle'
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
        [4.27, 5.7],
        [3.94, 8.29],
        [6.34, 9.78],
        [7.96, 11.01], 
        [7.23, 12.13],
        [7.79, 13.06],
        [8.45, 17.26],
        [11.03, 20.04]
      ],
      showInLegend: false
    }]
  })

})(window.Highcharts, window.smz)