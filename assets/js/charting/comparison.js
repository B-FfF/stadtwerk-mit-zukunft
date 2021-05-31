(function(hc, smz, swflData) {

var comparisonConfig = {
  chart: {
    type: 'bar'
  },
  legend: {
    enabled: false
  },
  series: [{
    name: "Flensburg",
    data: [4.21, 10.3],
    color: Highcharts.Color("#90ed7d").brighten(-.8).get('rgb'),
  },{
    name: "ø Deutschland",
    data: [14.5, 42.1],
    color: Highcharts.Color("#90ed7d").brighten(-0.4).get('rgb'),
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
          fontSize: "1em"
        },
        formatter: function() {

          var output = "";
          if (this.series.name !== "Flensburg") {
            output = '<span style="font-weight: normal">';
          }
          if (this.key === "Wärme" && this.series.name === "Flensburg") {
            return output + this.series.name + ": < 5 %";
          }
          if (this.key === "Strom" && this.series.name === "Kreis Schleswig-Flensburg") {
            return output + this.series.name + ": > 100 %";
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
  title: {
    text: "Anteil erneuerbarer Energien im Vergleich",
    floating: true,
    align: "right",
    style: {
      wordWrap: "wrap",
      textDecoration: "underline",
      fontWeight: "bolder",
      textShadow: "-1px 1px 2px rgba(200,200,200,1)",
      color: "black",
      fontSize: "1em"
    },
    x: -20,
    y: 30,
    widthAdjust: -300
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
};

  var startYearPowerData = 2014;
  var powerData = {
    nuclear: smz.fn.extractColumn(swflData.Electricity, "nuclear_pc", startYearPowerData),
    coal: smz.fn.extractColumn(swflData.Electricity, "coal_pc", startYearPowerData),
    gas: smz.fn.extractColumn(swflData.Electricity, "gas_pc", startYearPowerData),
    other_fossil: smz.fn.extractColumn(swflData.Electricity, "other_fossil_pc", startYearPowerData),
    renewables: smz.fn.extractColumn(swflData.Electricity, "renewables_pc", startYearPowerData),
    renewables_eeg: smz.fn.extractColumn(swflData.Electricity, "eeg_pc", startYearPowerData),
  };

  var powermixConfig = {
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
        stacking: "percent",
        pointStart: 2014,
        events: {
          legendItemClick: function(e) {
            if (this.index !== 5) {
              // nur EEG-Umlage darf zu Informationszwecken dazu eingeblendet werden
              // (alles andere ergibt keinen Sinn)
              return false;
            }
          }
        }
      }
    },
    series: [{
      color: Highcharts.defaultOptions.colors[6],
      data: powerData.nuclear,
      legendIndex: 0,
      name: "Kernenergie"
    },{
      color: Highcharts.defaultOptions.colors[5],
      data: powerData.gas,
      legendIndex: 2,
      name: "Erdgas"
    },{
      color: Highcharts.defaultOptions.colors[1],
      data: powerData.coal,
      legendIndex: 4,
      name: "Braun- & Steinkohle"
    },{
      color: "#222222",
      data: powerData.other_fossil,
      legendIndex: 1,
      name: "Sonstige fossile Energieträger"
    },{
      color: smz.color.swfl.lightGreen,
      data: powerData.renewables,
      legendIndex: 3,
      name: "Erneuerbare Energieträger mit Herkunftsnachweis"
    },{
      color: smz.color.swfl.darkGreen,
      data: powerData.renewables_eeg,
      legendIndex: 5,
      name: "Erneuerbare Energien, über EEG-Umlage finanziert",
      visible: false
    }],
    tooltip: {
      split: true,
      formatter: function(e) {
        var tooltips = this.points.map(v => {
          return v.series.name + ": <b>" + Highcharts.numberFormat(v.percentage, 1) + " %</b>"
        });
        tooltips.unshift(false) // hide x-axis tooltip (redundant)
        return tooltips.concat('');
      }
    },
    xAxis: {
      tickInterval: 1
    },
    yAxis: {
      title: undefined,
      labels: {
        format: "{value} %"
      }
    }
  }
  
  window.smz.chart = window.smz.chart || {};
  window.smz.chart.comparison = hc.chart("erneuerbare-energien-in-flensburg-chart", comparisonConfig);
  window.smz.chart.powerMix = hc.chart("strom-produktion-und-vertrieb-stadtwerke-flensburg", powermixConfig);
})(window.Highcharts, window.smz, window.SWFL);