(function(hc, smz, harbourData) {

  var startYearDetail = 2004;
  var data = {
    ships: smz.fn.extractColumn(harbourData, 'ships'),
    cargo: smz.fn.extractColumn(harbourData, 'cargo_total'),
    coal: smz.fn.extractColumn(harbourData, 'coal_in', startYearDetail),
    chips: smz.fn.extractColumn(harbourData, 'chips_in', startYearDetail),
    oil_heavy: smz.fn.extractColumn(harbourData, 'oil_heavy_in', startYearDetail),
    trafo: smz.fn.extractColumn(harbourData, 'trafo_in', startYearDetail),
    grit2: smz.fn.extractColumn(harbourData, 'grit2_in', startYearDetail),
    animal_feed_in: smz.fn.extractColumn(harbourData, 'animal_feed_in', startYearDetail),
    animal_feed_out: smz.fn.extractColumn(harbourData, 'animal_feed_out', startYearDetail),
    grit_in: smz.fn.extractColumn(harbourData, 'grit_in', startYearDetail),
    grit_out: smz.fn.extractColumn(harbourData, 'grit_out', startYearDetail),
    scrap_in: smz.fn.extractColumn(harbourData, 'scrap_in', startYearDetail),
    scrap_out: smz.fn.extractColumn(harbourData, 'scrap_out', startYearDetail),
    fertiliser_in: smz.fn.extractColumn(harbourData, 'fertiliser_in', startYearDetail),
    fertiliser_out: smz.fn.extractColumn(harbourData, 'fertiliser_out', startYearDetail),
    cellulose_in: smz.fn.extractColumn(harbourData, 'cellulose_in', startYearDetail),
    cellulose_out: smz.fn.extractColumn(harbourData, 'cellulose_out', startYearDetail),
    crop_in: smz.fn.extractColumn(harbourData, 'crop_in', startYearDetail),
    crop_out: smz.fn.extractColumn(harbourData, 'crop_out', startYearDetail),
    logs_in: smz.fn.extractColumn(harbourData, 'logs_in', startYearDetail),
    logs_out: smz.fn.extractColumn(harbourData, 'logs_out', startYearDetail),
    other_in: smz.fn.extractColumn(harbourData, 'other_in', startYearDetail),
    other_out: smz.fn.extractColumn(harbourData, 'other_out', startYearDetail),
    stones_in: smz.fn.extractColumn(harbourData, 'stones_in', startYearDetail),
    stones_out: smz.fn.extractColumn(harbourData, 'stones_out', startYearDetail),
    sea_grit_in: smz.fn.extractColumn(harbourData, 'sea_grit_in', startYearDetail),
    sea_grit_out: smz.fn.extractColumn(harbourData, 'sea_grit_out', startYearDetail),
    year: smz.fn.extractColumn(harbourData, 'year', startYearDetail),
  };

  var harbourChartConfig = {
    chart: {
      type: 'column'
    },
    plotOptions: {
      column: {
        groupPadding: 0.05,
        pointStart: 2000,
        tooltip: { valueDecimals: 0 },
      }
    },
    series: [{
      name: 'Güterumschlag',
      data: data.cargo.map(function(cargoInThousands){ return cargoInThousands * 1000 || null }),
      color: smz.gradient[11],
      tooltip: { valueSuffix: ' t' }
    },{
      name: 'Eingelaufene Schiffe',
      color: smz.gradient[10],
      data: data.ships,
      visible: false,
      yAxis: 1
    }],
    subtitle: { 
      floating: true, 
      text: 'Stadtwerke-Kai & Hafen-Ost', 
      style: { fontSize: '0.6em' },
      y: 28
    },
    title: { floating: true, text: 'Gesamtumschlag' },
    xAxis: {
      missing: [2002, 2003, 2006, 2017, 2018, 2019, 2020, 2021, 2022, 2023]
    },
    yAxis: [{
      title: { text: 'Umschlag in Tonnen' }
    },{
      title: { text: 'Anzahl Schiffe' },
      opposite: true
    }]
  };

  var harbourSwflChartConfig = {
    chart: {
      height: 370,
      type: 'column'
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        tooltip: { valueDecimals: 0, valueSuffix: ' t' },
      }
    },
    series: [{
      color: smz.gradient[1],
      data: data.coal,
      name: 'Steinkohle',
    },{
      color: smz.gradient[3],
      data: data.chips,
      name: 'Holzhackschnitzel',
    },{
      color: smz.gradient[8],
      data: data.oil_heavy,
      name: 'Schweröl',
    },{
      color: smz.gradient[7],
      data: data.trafo,
      name: 'Transformatoren',
    },{
      color: smz.fn.getGradient('#999'),
      data: data.grit2,
      name: 'Splitt',
    }],
    subtitle: { 
      floating: true, 
      text: 'nur eingehender Umschlag', 
      style: { fontSize: '0.6em' },
      y: 28
    },
    title: { floating: true, text: 'Stadtwerke-Kai' },
    xAxis: {
      categories: data.year
    },
    yAxis: [{
      endOnTick: false,
      max: 345000,
      min: -25000,
      startOnTick: false,
      title: { text: 'Umschlag in Tonnen' }
    }]
  };

  var harbourEastChartConfig = {
    chart: {
      type: 'column'
    },
    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },
    tooltip: {
      formatter: function() {
        var xIdx = this.x - startYearDetail;
        var inboundSum = 0, outboundSum = 0;
        var inOutTable = this.points.map(function(point) {
          if (point.series.linkedParent) return;  // skip outbound

          var color = point.color.stops !== undefined ? point.color.stops[0][1] : point.color;
          var outValue = Math.abs(point.series.linkedSeries[0].yData[xIdx]);

          if (!outValue && !point.y) return;  // skip empty lines

          inboundSum += point.y;
          outboundSum += outValue;

          return '<tr>'
          + '<th style="padding-right: 20px"><span style="color:' + color + '">●</span>&nbsp;' + point.series.name + '</th>'
          + '<td style="text-align: right; font-weight: 700">' + (point.y ? hc.numberFormat(point.y, 0) + ' t' : '–') + '</td>'
          + '<td style="text-align: right; font-weight: 700">' + (outValue ? hc.numberFormat(outValue, 0) + ' t' : '–') + '</td>'
          + '</tr>';
        });

        return ''.concat(
          '<table>',
          '<thead><tr style="font-weight: 700; vertical-align: middle; border-bottom: 1px solid #999">',
          '<th style="font-size: 1.5em">', this.x, '</th><th colspan="2" style="text-align: center">Gesamt ', hc.numberFormat(inboundSum + outboundSum, 0), ' t</th>',
          '</tr>',
          '<tr style="text-align: right"><th></th><th>Eingang</th><th style="padding-left: 8px">Ausgang</th></tr>',
          '</thead>',
          '<tbody>', inOutTable.join(''), 
          '<tr style="border-top: 1px solid #ccc; text-align: right; font-weight: 700; "><th style="text-align: center">Summe</th><td>', 
          hc.numberFormat(inboundSum, 0), ' t</td><td>', hc.numberFormat(outboundSum, 0), ' t</td>',
          '</tr>',
          '</tbody>',
          '</table>'
        )
      },
    },
    series: [{
      color: smz.gradient[0],
      data: data.other_in,
      id: 'other',
      name: 'Sonstiges',
    },{
      color: smz.fn.getGradient('#ccc'),
      data: data.sea_grit_in,
      id: 'sea_grit',
      name: 'Seekies',
    },{
      color: smz.fn.getGradient('#999'),
      data: data.grit_in,
      id: 'grit',
      name: 'Splitt',
    },{
      color: smz.fn.getGradient('#555'),
      data: data.stones_in,
      id: 'stones',
      name: 'Steine',
    },{
      color: smz.gradient[1],
      data: data.scrap_in,
      id: 'scrap',
      name: 'Schrott',
    },{
      color: smz.gradient[8],
      data: data.logs_in,
      id: 'logs',
      name: 'Baumstämme',
    },{
      color: smz.gradient[6],
      data: data.cellulose_in,
      id: 'cellulose',
      name: 'Zellulose',
    },{
      color: smz.gradient[3],
      data: data.crop_in,
      id: 'crop',
      name: 'Getreide',
    },{
      color: smz.gradient[11],
      data: data.fertiliser_in,
      id: 'fertiliser',
      name: 'Düngemittel',
    },{
      color: smz.gradient[10],
      data: data.animal_feed_in,
      id: 'animal_feed',
      name: 'Futtermittel',
    },{
      color: hc.defaultOptions.colors[7],
      data: smz.fn.mirror(data.other_out),
      linkedTo: 'other'
    },{
      color: '#ccc',
      data: smz.fn.mirror(data.sea_grit_out),
      linkedTo: 'sea_grit'
    },{
      color: '#999',
      data: smz.fn.mirror(data.grit_out),
      linkedTo: 'grit'
    },{
      color: '#555',
      data: smz.fn.mirror(data.stones_out),
      linkedTo: 'stones'
    },{
      color: hc.defaultOptions.colors[1],
      data: smz.fn.mirror(data.scrap_out),
      linkedTo: 'scrap'
    },{
      color: hc.defaultOptions.colors[8],
      data: smz.fn.mirror(data.logs_out),
      linkedTo: 'logs'
    },{
      color: hc.defaultOptions.colors[6],
      data: smz.fn.mirror(data.cellulose_out),
      linkedTo: 'cellulose'
    },{
      color: hc.defaultOptions.colors[3],
      data: smz.fn.mirror(data.crop_out),
      linkedTo: 'crop'
    },{
      color: smz.color.swfl.darkGreen,
      data: smz.fn.mirror(data.fertiliser_out),
      linkedTo: 'fertiliser'
    },{
      color: smz.color.swfl.lightGreen,
      data: smz.fn.mirror(data.animal_feed_out),
      label: { format: '' },
      linkedTo: 'animal_feed'
    }],
    subtitle: { 
      floating: true, 
      text: 'Eingänge & Ausgänge', 
      style: { fontSize: '0.6em' },
      y: 28
    },
    title: { floating: true, text: 'Wirtschaftshafen „Hafen-Ost“' },
    xAxis: {
      categories: data.year
    },
    yAxis: [{
      endOnTick: false,
      max: 345000,
      min: -25000,
      plotLines: [{
        value: 0,
        color: '#000',
        zIndex: 1
      }],
      startOnTick: false,
      title: { text: 'Umschlag in Tonnen' }
    }]
  };

  smz.chart = smz.chart || {};
  smz.chart.Harbour = hc.chart('hafen', harbourChartConfig)
  smz.chart.HarbourSwfl = hc.chart('hafen-stadtwerke-kai', harbourSwflChartConfig)
  smz.chart.HarbourEast = hc.chart('hafen-ost', harbourEastChartConfig)

})(window.Highcharts, window.smz, window.SWFL.Business.Harbour);
