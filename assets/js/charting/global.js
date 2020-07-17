(function (hc) {

  window.smz = {
    chart: {
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
          return '<tr><td>'
          + (showColorLegend ? '<span style="color:'+this.color+'">●</span>&nbsp;' : '')
          + this.series.name + ':&nbsp;</td><td style="text-align: right"><b>' 
          + Highcharts.numberFormat(this.y, decimals) 
          + (showValueSuffix ? " " + (this.series.tooltipOptions.valueSuffix || "") : '')
          + '</b></td></tr>';
        }
      }
    },
    color: {
      swfl: {
        lightGreen: '#73c82c',
        darkGreen: '#177d35'
      }
    },
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
      extractColumn: function (data, field, startYear) {

        var dataStartYear = data[0].year;
        startYear = startYear || dataStartYear;
        if (startYear < dataStartYear) {
          throw RangeError("Cannot generate series starting " + startYear +" as earliest available year in data is " + dataStartYear +".");
        }

        return data
          .map(function(x) { 
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
      }
    }
  }

  hc.setOptions({
    chart: {
      style: {
        fontFamily: 'Source Sans Pro',
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
        animation: true
      },
      arearange: {
        fillColor: {
          pattern: {
            path: {
              d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
              strokeWidth: 3
            },
            width: 10,
            height: 10,
            opacity: 0.6
          }
        }
      }
    },
    title: {
      text: undefined,
      useHtml: true
    },
    yAxis: {
      title: {
        margin: 6
      }
    },
    tooltip: {
      useHTML: true
    },
    yAxis: {
      title: {
        style: {
          fontSize: "0.75em"
        }
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          chart: {
            marginTop: 14,
            height: '90%'
          },
          legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal'
          },
          xAxis: {
            labels: {
              rotation: 90,
              style: {
                textOverflow: 'none'
              }
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
            title: {
              text: null
            },
          },{
            labels: {
              align: 'right',
              x: 0,
              y: -5
            },
            title: {
              text: null
            }
          }],
          subtitle: {
            text: null
          }
        }
      }]
    }
  });

})(window.Highcharts)


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