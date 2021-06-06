(function(hc, smz, swflData){

  var pieData = smz.fn.getDatarowByYear(swflData.ByProduct, 2020);

  var pieChartConfig = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Umsatz nach Produkten (2020)'
    },
    tooltip: {
      headerFormat: null,
      pointFormat: '{series.name}: <b>{point.percentage:.1f} %</b>',
      formatter: function(point) {
        return "Umsatz: <strong>" + hc.numberFormat(this.y * 1000000, 0) + " EUR </strong><br>"
          + "Umsatzanteil: <strong>" + hc.numberFormat(this.percentage, 2) + ' %</strong>';
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          formatter: function() {
            return "<b>" + this.key + "</b><br>" + hc.numberFormat(this.y, 1) + ' Mio. EUR';
          },
          style: {
            fontWeight: 'normal'
          }
        }
      }
    },
    series: [{
      name: 'Umsatzanteil',
      data: [{
        color: smz.gradient[3],
        name: "Fernwärme",
        y: parseFloat(pieData['heat']),
        sliced: true
      },{
        color: smz.gradient[8],
        name: "Erdgas",
        y: parseFloat(pieData['gas']),
        sliced: true
      },{
        color: smz.gradient[0],
        name: "Wasser",
        y: parseFloat(pieData['water']),
        sliced: true
      },{
        color: smz.gradient[2],
        name: "Glasfaser",
        y: parseFloat(pieData['fibre']),
        sliced: true
      },{
        color: smz.gradient[6],
        name: "Sonstige Erlöse",
        y: parseFloat(pieData['other']),
        sliced: true
      },{
        color: smz.gradient[1],
        name: "Strom",
        y: parseFloat(pieData['electricity'])
      }]
    }]
  };

  var startYearSplitData = 2009;
  var splitData = {
    electricity: smz.fn.extractColumn(swflData.ByProduct, "electricity", startYearSplitData),
    heat: smz.fn.extractColumn(swflData.ByProduct, "heat", startYearSplitData),
    gas: smz.fn.extractColumn(swflData.ByProduct, "gas", startYearSplitData),
    water: smz.fn.extractColumn(swflData.ByProduct, "water", startYearSplitData),
    fibre: smz.fn.extractColumn(swflData.ByProduct, "fibre", startYearSplitData),
    other: smz.fn.extractColumn(swflData.ByProduct, "other", startYearSplitData),
  };

  var salesChart = {
    chart: {
      type: "area"
    },
    legend: {
      align: "right",
      maxHeight: 60,
      navigation: {
        enabled: false
      },
      itemHoverStyle: {
        cursor: "default"
      }
    },
    plotOptions: {
      area: {
        pointStart: startYearSplitData,
        stacking: "percent",
        events: {
          legendItemClick: function(e) { return false; }
        }
      }
    },
    series: [{
      color: smz.gradient[1],
      data: splitData.electricity,
      name: "Strom inkl. Stromsteuer"
    },{
      color: smz.gradient[3],
      data: splitData.heat,
      name: "Fernwärme"
    },{
      color: smz.gradient[8],
      data: splitData.gas,
      name: "Gasverteilung inkl. Erdgassteuer"
    },{
      color: smz.gradient[0],
      data: splitData.water,
      name: "Wasser"
    },{
      color: smz.gradient[10],
      data: splitData.fibre,
      name: "Glasfaser"
    },{
      color: smz.gradient[6],
      data: splitData.other,
      name: "Sonstige Erlöse"
    }],
    tooltip: {
      pointFormatter: function(e) {
        var color = this.color.stops !== undefined ? this.color.stops[0][1] : this.color;
        return '<tr>' +
          '<td><span style="color:' + color + '; padding-top: 20px">●</span>&nbsp;' + this.series.name + ':&nbsp;</td>' +
          '<td style="text-align: right"><strong>' + hc.numberFormat(this.percentage, 2) + " %&nbsp;</strong></td>" + 
          '<td style="text-align: right">(' + hc.numberFormat(this.y, 3) + " Mio. EUR)</strong></td>" + 
          '</tr>';
      }
    },
    xAxis: {
      tickInterval: 1
    },
    yAxis: [{
      title: undefined,
      labels: {
        format: "{value} %"
      }
    }]
  };

  window.smz.chart = window.smz.chart || {};
  window.smz.chart.PieByProduct = hc.chart('umsatz-nach-produkten', pieChartConfig);
  window.smz.chart.ByProduct = hc.chart('umsatz-nach-produkten-verlauf', salesChart);

})(window.Highcharts, window.smz, window.SWFL.Business)