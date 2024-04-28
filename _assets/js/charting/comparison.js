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
    data: [1.9, 45.6],
    color: smz.fn.getGradient(hc.Color("#90ed7d").brighten(-.8).get('rgb')),
  },{
    name: "ø Deutschland",
    data: [17.4, 46.2],
    color: smz.fn.getGradient(hc.Color("#90ed7d").brighten(-0.4).get('rgb')),
  },{
    color: smz.gradient[2],
    data: [null, 110],
    dataLabels: {
      align: "right",
      inside: true
    },
    id: "slfl",
    name: "Kreis Schleswig-Flensburg",
  }],
  plotOptions: {
    bar: {
      pointPadding: 0.1,
      groupPadding: 0,
      dataLabels: {
        enabled: true,
        inside: false,
        style: { fontSize: "1em" },
        formatter: function() {

          var output = "";
          if (this.series.name !== "Flensburg") {
            output = '<span style="font-weight: normal">';
          }
          if (this.key === "Wärme" && this.series.name === "Flensburg") {
            return output + this.series.name + ": < 3 %";
          }
          if (this.key === "Strom" && this.series.name === "Kreis Schleswig-Flensburg") {
            return output + this.series.name + ": > 100 %";
          }

          return output + this.series.name + ": " + hc.numberFormat(this.y, 1) + " %";
        }
      },
      label: {
        enabled: true        
      }
    },
  },
  responsive: {
    rules: [{
      condition: { maxWidth: 482 }, // exactly "narrower"-breakpoint incl. sidebar
      chartOptions: {
        // xAxis: { // duplicate !
        //   minPadding: 0.1
        // },
        chart: {
          marginTop: 14,
          height: 160
        },
        plotOptions: {
          bar: {
            dataLabels: {
              style: { fontSize: "11px" }
            }
          }
        },
        series: [
          {},{},{
            id: "slfl",
            dataLabels: { align: "left" }
          }
        ],
        xAxis: {
          labels: {
            style: { fontSize: "14px" }
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
      navigation: { enabled: false },
      itemHoverStyle: { cursor: "default" },
      labelFormatter: function () {
        var tooltip;
        if (this.index === 5) {
          return '<span title="Ab 2020 Wert aus bundesdeutschem Mix, &#13;da nicht mehr separat im Unternehmensmix ausgewiesen" ' 
            + 'style="cursor: pointer">' + this.name + '</span>';
        }

        return '<span>' + this.name + '</span>';
      },
      useHTML: true,
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
        },
        label: {
          formatter: function() {
            // Applying some em-space hacks to force spacing (otherwise collides with dataLabels)
            if (this.userOptions.legendIndex === 0) return "<span>Kern-<br>Energie </span>"
            if (this.userOptions.legendIndex === 3) return "<span> <br>Erneuerbare Energien </span>"
            if (this.userOptions.legendIndex === 4) return "<span> Braun- & Steinkohle </span>"
            return ' ' + this.userOptions.name + ' '
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function(e, f) {
            this.y = this.y-10
            if (this.series.name === 'Sonstige fossile Energieträger') return   // too narrow to display this
            return hc.numberFormat(this.percentage, 0 ) + ' %'
          },
          verticalAlign: 'top',
        },        
      },
    },
    series: [{
      color: hc.defaultOptions.colors[6],
      data: powerData.nuclear,
      legendIndex: 0,
      name: "Kernenergie"
    },{
      color: smz.gradient[5],
      data: powerData.gas,
      legendIndex: 2,
      name: "Erdgas"
    },{
      color: smz.gradient[1],
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
      name: "Erneuerbare Energien, über EEG-Umlage finanziert *",
      visible: false
    }],
    tooltip: {
      split: true,
      formatter: function(e) {
        var tooltips = this.points.map(function(v) {
          return v.series.name + ": <b>" + hc.numberFormat(v.percentage, 1) + " %</b>"
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
      labels: { format: "{value} %" }
    }
  };

  var startYearHeatData = 2016;
  var selectedGrid = "FL";
  var heatData = {
    carbon: smz.fn.extractColumn(swflData.Heat, "carbon_per_kwh", startYearHeatData, "grid", selectedGrid),
    coal: smz.fn.extractColumn(swflData.Heat, "coal_pc", startYearHeatData, "grid", selectedGrid),
    gas: smz.fn.extractColumn(swflData.Heat, "gas_pc", startYearHeatData, "grid", selectedGrid),
    biogas: smz.fn.extractColumn(swflData.Heat, "biogas_pc", startYearHeatData, "grid", selectedGrid),
    oil_heavy: smz.fn.extractColumn(swflData.Heat, "oil_heavy_pc", startYearHeatData, "grid", selectedGrid),
    oil_light: smz.fn.extractColumn(swflData.Heat, "oil_light_pc", startYearHeatData, "grid", selectedGrid),
    chips: smz.fn.extractColumn(swflData.Heat, "chips_pc", startYearHeatData, "grid", selectedGrid),
    chips_recycled: smz.fn.extractColumn(swflData.Heat, "chips_recycled_pc", startYearHeatData, "grid", selectedGrid),
    waste: smz.fn.extractColumn(swflData.Heat, "waste_pc", startYearHeatData, "grid", selectedGrid),
  };
  
  var heatmixConfig = {
    chart: {
      type: "area"
    },
    legend: {
      align: "right",
      maxHeight: 60,
      navigation: {
        enabled: false
      },
    },
    plotOptions: {
      line: {
        pointStart: 2016,
      },
      area: {
        dataLabels: { 
          enabled: true,
          formatter: function(e, f) {
            this.y = this.y-10
            if (!['Steinkohle', 'Erdgas'].includes(this.series.name)) return   // too narrow to the others
            return hc.numberFormat(this.percentage, 0 ) + ' %'
          },
          verticalAlign: 'top',
        },
        pointStart: 2016,
        stacking: "percent"
      }
    },
    series: [{
      color: smz.gradient[1],
      data: heatData.coal,
      name: "Steinkohle"
    },{
      color: smz.fn.getGradient("#000000"),
      data: heatData.oil_heavy,
      name: "Schweröl"
    },{
      color: smz.fn.getGradient("#222222"),
      data: heatData.oil_light,
      name: "Leichtöl"
    },{
      color: smz.gradient[8],
      data: heatData.gas,
      name: "Erdgas"
    },{
      color: smz.gradient[7],
      data: heatData.waste,
      name: "Ersatzbrennstoffe (EBS)"
    },{
      color: smz.gradient[9],
      data: heatData.chips,
      name: "Holzhackschnitzel"
    },{
      color: smz.gradient[10],
      data: heatData.chips_recycled,
      name: "Altholzhackschnitzel"
    },{
      color: smz.gradient[11],
      data: heatData.biogas,
      name: "Biogas"
    },{
      color: smz.gradient[3],
      data: heatData.carbon,
      dashStyle: "ShortDashDotDot",
      name: "CO₂-Emissionen pro kWh",
      shadow: {
        color: "#FFF",
        width: 4,
        opacity: 1
      },
      type: "line",
      yAxis: 1,
      visible: false
    }],
    tooltip: {
      split: true,
      formatter: function(e) {
        var tooltips = this.points.map(function(v) {
          if (v.series.index !== 8) {
            return v.series.name + ": <b>" + hc.numberFormat(v.percentage, 1) + " %</b>"
          }
          return v.series.name + ": <b>" + hc.numberFormat(v.y, 2) + " g</b>"
        });
        tooltips.unshift(false) // hide x-axis tooltip (redundant)
        return tooltips.concat('');
      }
    },
    xAxis: {
      tickInterval: 1
    },
    yAxis: [{
      title: undefined,
      labels: { format: "{value} %" }
    },{
      title: "CO₂-Emissionen pro kWh",
      labels: { format: "{value} g" },
      opposite: true,
      min: 0
    }]
  };

  smz.chart = smz.chart || {};
  smz.chart.comparison = hc.chart("erneuerbare-energien-in-flensburg-chart", comparisonConfig);
  smz.chart.powerMix = hc.chart("strom-produktion-und-vertrieb-stadtwerke-flensburg", powermixConfig);
  smz.chart.heatMix = hc.chart("fernwaermemix-stadtwerke-flensburg", heatmixConfig);

})(window.Highcharts, window.smz, window.SWFL);