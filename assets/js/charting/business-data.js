(function(hc, swflData){

  hc.setOptions({
    tooltip: {
      useHTML: true,
      shared: true,
      headerFormat: '<span style="font-size: 1.5em; font-weight: bold">{point.key}</span><table>',
      footerFormat: '</table>',
      pointFormatter: function () {
        var seriesName = this.series.userOptions.id === "energy_taxes" ? 'davon Strom & Erdgassteuern' : this.series.name;
        return '<tr><td><span style="color:'+this.color+'">●</span>&nbsp;' + seriesName + '</td>'
        + '<td style="text-align: right"><b>' + Highcharts.numberFormat(this.y, 2) + this.series.tooltipOptions.valueSuffix + '</b></td></tr>';
      }
    },
  });

  var colorDarkGreen = '#177d35',
    colorLightGreen = '#73c82c';

  var whiteLineShadow = {
    color: '#fff',
    opacity: .8,
    width: 5,
    offsetX: 0,
    offsetY: 0
  };

  var data = {
    ebit: smz.fn.extractColumn(swflData.Results, "EBIT"),
    ebitCorporation: smz.fn.extractColumn(swflData.Results, "EBIT_corp"),
    earnings: smz.fn.extractColumn(swflData.Results, "earnings"),
    earningsCorporation: smz.fn.extractColumn(swflData.Results, "earnings_corp"),
    divident: smz.fn.extractColumn(swflData.Results, "divident"),
    sales: smz.fn.extractColumn(swflData.Results, "sales"),
    energyTaxes: smz.fn.extractColumn(swflData.Results, "energy_taxes"),
    salesCorporation: smz.fn.extractColumn(swflData.Results, "sales_corp")
  };

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
        text: 'Gewinnentwicklung'
      },
      series: [{
        name: "EBIT Konzern",
        data: data.ebitCorporation,
        color: '#999',
        pointPadding: 0.25,
        pointPlacement: -0.22,
      },{
        name: "EBIT GmbH",
        data: data.ebit,
        color: '#666',
        pointPadding: 0.25,
        pointPlacement: 0.2,
      },{
        name: "Gewinn Konzern",
        color: colorLightGreen,
        data: data.earningsCorporation,
        pointPadding: 0.25,
        pointPlacement: -0.22,
        borderWidth: 0.5,
        zones: [{
          value: 0,
          color: "rgba(255,0,0,.5)"
        }]
      },{
        name: "Gewinn GmbH",
        color: colorDarkGreen,
        data: data.earnings,
        pointPadding: 0.25,
        pointPlacement: 0.2,
        borderWidth: 0.5,
        zones: [{
          value: 0,
          color: "rgba(255,0,0,.8)"
        }]
      },{
        type: 'line',
        name: "Umsatzrentabilität (EBIT) Konzern",
        data: data.ebitCorporation.map(function(ebitCorporation, i) { return ebitCorporation * 100 / data.salesCorporation[i]; }),
        color: colorLightGreen,
        pointStart: 2000,
        yAxis: 1,
        shadow: whiteLineShadow,
        marker: {
          radius: 2
        },
        visible: false
      },{
        type: 'line',
        name: "Umsatzrentabilität (EBIT) GmbH",
        data: data.ebit.map(function(ebit, i) { return ebit * 100/ data.sales[i]; }),
        color: colorDarkGreen,
        pointStart: 2000,
        shadow: whiteLineShadow,
        marker: {
          radius: 2
        },
        yAxis: 1,
        visible: false
      }],
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
        text: 'Umsatzentwicklung'
      },
      series: [{
        name: 'Umsätze Konzern',
        color: colorLightGreen,
        data: data.salesCorporation,
        stack: "konzern",
        pointPadding: 0
      }, {
        name: 'Umsätze GmbH',
        pointPadding: 0.1,
        color: colorDarkGreen,
        data: data.sales,
      },{
        name: 'Strom und Erdgassteuer',
        color: '#dddddd',
        id: 'energy_taxes',
        data: data.energyTaxes,
      }],
      tooltip: {
        valueSuffix: ' €'
      },
      yAxis: [{
        title: {
          text: "Umsätze in Mio. €"
        }
      }]
    });
  }

  window.smz.chart = window.smz.chart || {};
  window.smz.chart.Sales = drawSalesChart();
  window.smz.chart.Earnings = drawEarningsChart();

})(window.Highcharts, window.SWFL.Business)