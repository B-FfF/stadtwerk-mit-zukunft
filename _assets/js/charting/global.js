(function (hc) {
  
  var emissionsDataCache;
  function getSeries(data, startYear) {
    var swflDataStartYear = data[0].year;
    if (emissionsDataCache === undefined) {
      emissionsDataCache = {
        main: smz.fn.extractColumn(data, "co2_main"),
        north: smz.fn.extractColumn(data, "co2_north"),
        south: smz.fn.extractColumn(data, "co2_south"),
        engelsby: smz.fn.extractColumn(data, "co2_engelsby"),
        gluecksburg: smz.fn.extractColumn(data, "co2_gluecksburg")
      }      
    }
    
    return emissionsDataCache.main.slice(startYear - swflDataStartYear).map(function(value, idx) {
      idx += (startYear - swflDataStartYear);
      return value + emissionsDataCache.north[idx]
          + emissionsDataCache.south[idx] + emissionsDataCache.engelsby[idx]
          + emissionsDataCache.gluecksburg[idx];
    });
  }

  function getGradient(color) {
    return {
      radialGradient: {
        cx: 0.5,
        cy: 0.3,
        r: 0.7
      },
      stops: [
        [0, color],
        [1, hc.color(color).brighten(-0.3).get('rgb')] // darken
      ]
    };
  };

  var swflColors = {
    lightGreen: '#73c82c',
    darkGreen: '#177d35'
  };

  var smz = {
    chart: {
      stripedPattern: {
        pattern: {
          color: '#d11',
          path: {
            d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
            strokeWidth: 3
          },
          height: 10,
          opacity: 0.6,
          width: 10
        }
      },
      enableFullscreen: function(chart) {

        chart.renderTo.addEventListener('dblclick', function() {
          this.parentElement.classList.toggle('modal');
          chart.reflow();
        });
        
        return chart;
      },
      getPointFormatterTableRow: function(decimals, showColorLegend, showValueSuffix) {
        decimals = decimals || 0;
        showColorLegend = showColorLegend || true;
        showValueSuffix = showValueSuffix || true;
        return function() {
          var color = this.color.stops === undefined ? this.color : this.color.stops[0][1];
          return '<tr><td>'
          + (showColorLegend ? '<span style="color:' + color + '">●</span>&nbsp;' : '')
          + this.series.name + ':&nbsp;</td><td style="text-align: right"><b>' 
          + hc.numberFormat(this.y, decimals) 
          + (showValueSuffix ? " " + (this.series.tooltipOptions.valueSuffix || "") : '')
          + '</b></td></tr>';
        }
      },
      getDottedZone: function(from, to) {
        return [{
          dashStyle: "Solid",
          value: from
        },{
          dashStyle: "Dot",
          value: to
        }]
      },
      getStripedZone: function(from, to, stripeColor, opacity) {
        if (!stripeColor)
          throw TypeError("No value supplied for striped zone");
        
        opacity = opacity || 1;
        var zone = smz.chart.getDottedZone(from, to);
        return [
          zone[0],
          Object.assign(zone[1], {
            fillColor: {
              pattern: Object.assign({}, hc.patterns[2], { color: stripeColor, opacity: opacity })
            }
          })
        ]
      },
      getBoldLineShadow: function() {
        return {
          color: '#fff',
          opacity: .8,
          width: 5,
          offsetX: 0,
          offsetY: 0
        }
      }
    },
    color: {swfl: swflColors},
    gradient: hc.map(hc.defaultOptions.colors.concat(swflColors.lightGreen, swflColors.darkGreen), function getGradient(color) {
      return {
        radialGradient: {
          cx: 0.5,
          cy: 0.3,
          r: 0.7
        },
        stops: [
          [0, color],
          [1, hc.color(color).brighten(-0.3).get('rgb')] // darken
        ]
      };
    }),
    fn: {
      /**
       * @param {Number} from 
       * @param {Number} to 
       * @returns {Array}
       */
      getYearSeries: function (from, to) {
        if (to <= from) {
          throw RangeError("Start value needs to be greater than or at least equal to end value.");
        }
        var numToDo = 1 + to - from;
        return Array.apply(null, { length: numToDo }).map(function (value, index) {
          return index + from;
        });
      },
      extractColumn: function (data, field, startYear, filterColumn, filterValue) {

        var dataStartYear = data[0].year;
        startYear = startYear || dataStartYear;
        if (startYear < dataStartYear) {
          throw RangeError("Cannot generate series starting " + startYear +" as earliest available year in data is " + dataStartYear +".");
        }

        if (filterColumn !== undefined && filterValue !== undefined) {
          data = data.filter(function(row) {
            return row[filterColumn] === filterValue;
          })
        }

        return data.map(function(x) {
          if (x[field] === null) {
            return null;
          }
          return parseFloat(x[field]);
        }).slice(startYear - dataStartYear);
      },
      getDatarowByYear: function (data, year) {
        for (var i in data) {
          if (data[i]["year"] == year) {
            return data[i];
          }
        }
      },
      getEmissionsDataSeries: getSeries,
      getGradient: getGradient,
    }
  }

  hc.setOptions({
    chart: {
      style: {
        fontFamily: '"Open Sans", arial, sans-serif',
        fontSize: "1em"
      },
      spacingLeft: 0,
      spacingRight: 0
    },
    credits: {
      enabled: false
    },
    lang: {
      decimalPoint: ",",
      thousandsSep: "."
    },
    plotOptions: {
      series: {
        animation: true,
        label: {
          minFontSize: 8,
          maxFontSize: 20,
        },
      },
    },
    title: {
      text: undefined,
    },
    // yAxis: {  // double / overwritten
    //   title: {
    //     margin: 6
    //   }
    // },
    tooltip: {
      useHTML: true
    },
    yAxis: {
      showEmpty: false,
      title: {
        style: { fontSize: "0.75em" }
      }
    },
    responsive: {
      rules: [{
        condition: { maxWidth: 482 },
        chartOptions: {
          title: { y: 4 },
          chart: {
            marginTop: 14,
            height: '90%'
          },
          plotOptions: {
            dataLabels: { enabled: false },
            area: { dataLabels: { enabled: false } },
            column: { dataLabels: { enabled: false } },
            series: { label: { enabled: false } },
          },
          legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal'
          },
          xAxis: {
            labels: {
              rotation: 90,
              style: { textOverflow: 'none' }
            },
            minPadding: 0.02
          },
          yAxis: [{
            labels: {
              format: null,
              align: 'left',
              x: 0,
              y: -5
            },
            title: { text: null },
          },{
            labels: {
              align: 'right',
              x: 0,
              y: -5
            },
            title: { text: null }
          }],
          subtitle: { text: null }
        }
      }]
    }
  });

  window.smz = smz

})(window.Highcharts);


if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== undefined) { 
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}