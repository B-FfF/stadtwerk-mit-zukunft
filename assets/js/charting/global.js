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
          throw RangeError(`Start value needs to be greater than or at least equal to end value.`);
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
          throw RangeError(`Cannot generate series starting ${startYear}, as earliest available year in data is ${dataStartYear}.`);
        }

        return data
          .map(x => parseInt(x[field]))
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