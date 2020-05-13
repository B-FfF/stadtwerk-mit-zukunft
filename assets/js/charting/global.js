(function (hc) {

  window.smz = {
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
          .map(function(x) { return parseInt(x[field]); })
          .slice(startYear - dataStartYear);
      }
    }
  }

  hc.setOptions({
    chart: {
      style: {
        fontFamily: 'Source Sans Pro',
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
    tooltip: {
      useHtml: true
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          chart: {
            marginTop: 14,
            height: '80%'
          },
          legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal'
          },
          yAxis: {
            labels: {
              align: 'left',
              x: 0,
              y: -5
            },
            title: {
              text: null
            }
          },
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