(function(hc, smz) {

var chart = hc.chart("erneuerbare-energien-in-flensburg-chart",{
  chart: {
    type: 'bar',
    height: 200
  },
  legend: {
    enabled: false
  },
  series: [{
    name: "Flensburg",
    data: [4.2, 14.7],
    color: Highcharts.defaultOptions.colors[8]
  },{
    name: "ø Deutschland",
    data: [14.5, 42.1],
    color: Highcharts.defaultOptions.colors[1]
  },{
    name: "Kreis Schleswig-Flensburg",
    data: [null, 110],
    color: Highcharts.defaultOptions.colors[2],
    dataLabels: {
      align: "right",
      inside: true
    }
  }],
  plotOptions: {
    bar: {
      pointPadding: 0.1,
      groupPadding: 0,
      dataLabels: {
        enabled: true,
        inside: false,
        style: {
          fontSize: "12px"
        },
        formatter: function() {

          var output = "";
          if (this.series.name !== "Flensburg") {
            output = '<span style="font-weight: normal">';
          }
          if (this.key === "Strom") {

            switch(this.series.name) {
              case "Flensburg":
                return this.series.name + ": < 15 %";
              case "Kreis Schleswig-Flensburg":
                  return output + this.series.name + ": > 100 %";
            }
          }

          return output + this.series.name + ": " + Highcharts.numberFormat(this.y, 1) + " %";
        }
      },
      label: {
        enabled: true        
      }
    },
  },
  responsive: {
    rules: [{
      condition: {
        maxWidth: 500
      },
      chartOptions: {
        xAxis: {
          minPadding: 0.1
        },
        chart: {
          marginTop: 14,
          height: 160
        },
        plotOptions: {
          bar: {
            dataLabels: {
              style: {
                fontSize: "11px"
              }
            }
          }
        },
        xAxis: {
          labels: {
            style: {
              fontSize: "14px"
            }
          }
        }
      }
    }]
  },
  tooltip: {
    enabled: false
  },
  xAxis: {
    categories: ["Wärme", "Strom"],
    labels: {
      style: {
        fontWeight: "600",
        fontSize: "20px"
      }
    }

  },
  yAxis: {
    max: 103,
    endOnTick: false,
    tickInterval: 10,
    title: null
  }
});

  window.smz.chart = window.smz.chart || {};
  window.smz.chart.comparison = chart
})(window.Highcharts, window.smz);