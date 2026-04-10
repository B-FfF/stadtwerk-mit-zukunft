(function(hc, smz, swflData){
  var year = 2025
  var pieData = smz.fn.getDatarowByYear(swflData.ByProduct, year);

  var pieChartConfig = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: { text: 'Umsatz nach Produkten (' + year + ')' },
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
          style: { fontWeight: 'normal' }
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
      navigation: { enabled: false },
      itemHoverStyle: { cursor: "default" }
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
          '<td style="text-align: right">(' + hc.numberFormat(this.y, 1) + " Mio. EUR)</strong></td>" + 
          '</tr>';
      }
    },
    xAxis: {
      max: smz.data.latestBusinessReportYear,
      tickInterval: 1
    },
    yAxis: [{
      title: undefined,
      labels: { format: "{value} %" }
    }]
  };

  var startYearEarningsSplitData = 2016;
  var splitEarningsData = {
    electricity: smz.fn.extractColumn(swflData.ByProduct, "eat_electricity", startYearEarningsSplitData),
    heat: smz.fn.extractColumn(swflData.ByProduct, "eat_heat", startYearEarningsSplitData),
    gas: smz.fn.extractColumn(swflData.ByProduct, "eat_gas", startYearEarningsSplitData),
    water: smz.fn.extractColumn(swflData.ByProduct, "eat_water", startYearEarningsSplitData),
    fibre: smz.fn.extractColumn(swflData.ByProduct, "eat_fibre", startYearEarningsSplitData),
    stakes: smz.fn.extractColumn(swflData.ByProduct, "eat_stakes", startYearEarningsSplitData),
    admin: smz.fn.extractColumn(swflData.ByProduct, "eat_admin", startYearEarningsSplitData),
    other: smz.fn.extractColumn(swflData.ByProduct, "eat_other", startYearEarningsSplitData),
  };

  var earningsChart = {
    chart: { type: "column" },
    plotOptions: {
      column: {
        pointStart: startYearEarningsSplitData,
        stacking: "normal",
        dataLabels: { format: "{point.y:.1f}" }
      }
    },
    series: [{
      color: smz.gradient[1],
      data: splitEarningsData.electricity,
      name: "Strom"
    },{
      color: smz.gradient[3],
      data: splitEarningsData.heat,
      name: "Fernwärme"
    },{
      color: smz.gradient[8],
      data: splitEarningsData.gas,
      name: "Gasverteilung"
    },{
      color: smz.gradient[0],
      data: splitEarningsData.water,
      name: "Wasser"
    },{
      color: smz.gradient[10],
      data: splitEarningsData.fibre,
      name: "Glasfaser"
    },{
      // color: smz.gradient[6],
      data: splitEarningsData.stakes,
      name: "Beteiligungen"
    },{
      // color: smz.gradient[6],
      data: splitEarningsData.admin,
      name: "Verwaltung"
    },{
      color: smz.gradient[6],
      data: splitEarningsData.other,
      name: "Übrige Tätigkeiten"
    }],
    tooltip: {
      formatter: function (e) {
        var tooltip = Highcharts.defaultOptions.tooltip.formatter.call(this, e);
        for (var i in e.chart.series) {
          if (!e.chart.series[i].visible) return tooltip;
        }

        var positiveTotal, negativeTotal; // workaround for https://www.highcharts.com/forum/viewtopic.php?t=10967
        for (var i in this.points) {
          if (positiveTotal !== undefined && negativeTotal !== undefined) break;
          if (this.points[i].total >= 0) positiveTotal = this.points[i].total; else negativeTotal = this.points[i].total
        }

        tooltip[tooltip.length-1] = '<tr style="line-height: 2em"><td><strong>Gesamt:</strong></td>'
          + '<td style="text-align: right"><strong>' + hc.numberFormat(negativeTotal + positiveTotal) + ' Mio.</strong></td>'
          + '</tr></table>';

        return tooltip
      },
      valueDecimals: 2,
      valueSuffix: " Mio."
    },
    xAxis: { lineColor: "transparent", tickColor: "transparent" },
    yAxis: {
      endOnTick: false,
      plotBands: [{
        from: -Infinity,
        to: 0,
        color: smz.fn.getGradient("#fcf6f6"),
        zIndex: 0
      }],
      // Optional: add a crisp line right at 0
      plotLines: [{
        value: 0,
        color: '#cccccc',
        width: 1,
        zIndex: 2
      }],
      startOnTick: false,
      title: { text: "Verluste | Gewinne in Mio. €" },
    }
  }

  window.smz.chart = window.smz.chart || {};
  window.smz.chart.PieByProduct = hc.chart('umsatz-nach-produkten', pieChartConfig);
  window.smz.chart.ByProduct = hc.chart('umsatz-nach-produkten-verlauf', salesChart);
  window.smz.chart.EarningsByProduct = hc.chart('ertrag-nach-produkten-verlauf', earningsChart);

})(window.Highcharts, window.smz, window.SWFL.Business);