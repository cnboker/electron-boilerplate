import crossfilter from "crossfilter";
//import  d3 from 'd3'
import React, { Component } from "react";
import { connect } from "react-redux";
//import dc from 'dc'
import axios from "axios";
import moment from "moment";

var d3 = require("d3");
var dc = require("dc");

class History extends Component {
  componentDidMount() {
    console.log("this.props.match.params", this.props.id);
    var client = this.props.client;

    var that = this;

    Promise.all([
      axios({
        url: `${process.env.REACT_APP_API_URL}/analysis/${this.props.id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${client.token.access_token}`
        }
      }),
      axios({
        url: `${process.env.REACT_APP_API_URL}/event/${this.props.id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${client.token.access_token}`
        }
      })
    ])
      .then(results => {
        console.log(results);
        that.draw(results);
      })
      .catch(e => {
        console.log(e);
      });
  }

  draw(results) {
    var exp1 = results[0].data,
      exp2 = results[1].data;

    //console.log(x)
    var parseDate = d3.timeFormat("%Y-%B-%d");
    //console.log('test', parseDate(new Date("2018-04-23T06:48:13.362Z")))
    // exp1.data.forEach(function(d) {
    //   d.date = parseDate(new Date(d.createDate));
    // });
    // exp2.data.forEach(function(d) {
    //   d.date = parseDate(new Date(d.createDate));
    // });

    var ndx = crossfilter();
    ndx.add(
      exp1.map(function(d) {
        return {
          date: parseDate(new Date(d.createDate)),
          y2: 0,
          y1: +d.dynamicRank
        };
      })
    );

    var ndx1 = crossfilter();

    ndx1.add(
      exp2.map(function(d) {
        return {
          date: parseDate(new Date(d.createDate)),
          y2: 1,
          y1: 0,
          text: d.text
        };
      })
    );
    //确保数据类型和domain里面的数据类型一致

    var dim = ndx.dimension(d => {
      return new Date(d.date);
    });
    var dim1 = ndx1.dimension(d => {
      return new Date(d.date);
    });
    //var grp1 = dim.group().reduceSum(dc.pluck('y1'));

   
    var grp1 = dim.group().reduce(
      //callback for when data is added to the current filter results
      (p, v) => {
        ++p.count;
        p.total += v.y1;
        return p;
      },
      //callback for when data is removed from the current results
      (p, v) => {
        --p.count;
        p.total -= v.y1;
        return p;
      },
      () => {
        return { count: 0, total: 0 };
      }
    );
    //print_filter(grp1);
    //var grp2 = dim.group().reduceSum(dc.pluck("y2"));
    var grp2 = dim1.group().reduce(
      //callback for when data is added to the current filter results
      (p, v) => {
        console.log("grp2", v);
        ++p.count;
        p.total += v.y2;
        if (v.text) {
          p.text.push(v.text);
        }
        //
        return p;
      },
      //callback for when data is removed from the current results
      (p, v) => {
        --p.count;
        p.total -= v.y2;

        return p;
      },
      () => {
        return { count: 0, total: 0, text: [] };
      }
    );
    print_filter(grp1);
    print_filter(grp2);
    //print_filter(grp2);
    var minDate = dim.bottom(1)[0].date;
    //var maxDate = dim.top(1)[0].date;
    var maxDate = new Date();
    console.log("hits", minDate, maxDate);
    //var chart = dc.lineChart(that.chart);
    var chart = dc.compositeChart(this.chart);
    chart
      .width(1024)
      .height(500)
      .brushOn(false)
      .yAxisLabel("动态排名")
      .x(d3.scaleTime().domain([new Date(minDate), new Date(maxDate)]))
      .renderHorizontalGridLines(true)
      .legend(
        dc
          .legend()
          .x(800)
          .y(10)
          .itemHeight(13)
          .gap(5)
      )
      .shareTitle(false)
      .compose([
        dc
          .bubbleChart(chart)
          .transitionDuration(1500)
          //.margins({ top: 10, right: 50, bottom: 30, left: 40 })
          .dimension(dim1)
          .group(grp2, "事件")

          .colors(d3.scaleOrdinal(d3.schemeCategory10))
          .keyAccessor(function(p) {
            return p.key;
          })
          .valueAccessor(function(p) {
            return p.value.count;
          })
          .radiusValueAccessor(function(p) {
            return p.value.count;
          })
          .maxBubbleRelativeSize(2)
          .x(d3.scaleLinear())
          .y(d3.scaleLinear().domain([0, 10]))
          .r(d3.scaleLinear().domain([0, 100]))
          .maxBubbleRelativeSize(0.5)
          .renderHorizontalGridLines(true)
          .renderVerticalGridLines(true)
          .renderLabel(true)
          .renderTitle(true)
          .title(function(p) {
            return moment(p.key).format("l") + "\n" + p.value.text.join("\n");
          })
          .label(p=>{
            return moment(p.key).format("l")
          })
          //.xAxis().tickFormat(d3.format('.3s'))
         ,
        dc
          .lineChart(chart)
          .dimension(dim)
          .elasticY(true)
          //.colors("blue")
          .xUnits(dc.units.ordinal)
          .group(grp1, "排名")
          //.dashStyle([2, 2])
          .valueAccessor(p => {
            //console.log('p',p)
            return p.value.count > 0
              ? Math.round(p.value.total / p.value.count, 0)
              : 0;
          })
          .title(p => {
            var rank =
              p.value.count > 0
                ? Math.round(p.value.total / p.value.count, 0)
                : 0;
            return `时间:${moment(p.key).format("MM-DD")}\n排名:${rank}`;
          })
          //.xAxis().tickFormat(function(d) {return d3.format(',d')(d);})
          //.xAxis().tickFormat(d3.format('.3s'))
          //.y(d3.scaleLinear().domain([1, 120]))
         
      ])
      .render();
  }

  render() {
    return <div ref={chart => (this.chart = chart)} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  return { keywords: state.keywords, client: state.client };
};

//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(History);

function print_filter(filter) {
  var f = eval(filter);
  if (typeof f.length != "undefined") {
  } else {
  }
  if (typeof f.top != "undefined") {
    f = f.top(Infinity);
  } else {
  }
  if (typeof f.dimension != "undefined") {
    f = f
      .dimension(function(d) {
        return "";
      })
      .top(Infinity);
  } else {
  }
  console.log(
    filter +
      "(" +
      f.length +
      ") = " +
      JSON.stringify(f)
        .replace("[", "[\n\t")
        .replace(/}\,/g, "},\n\t")
        .replace("]", "\n]")
  );
}
