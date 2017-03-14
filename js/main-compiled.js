'use strict';

require('babel-polyfill');

var _d = require('d3');

var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

function displayInfoOnHover() {
    var dateElement = document.querySelector('.date');
    var GDPElement = document.querySelector('.GDP');

    document.querySelectorAll('.bar').forEach(function (bar) {
        bar.addEventListener('mouseover', function (e) {
            dateElement.textContent = e.target.dataset.date;
            GDPElement.textContent = e.target.dataset.gdp;
        });
    });
}

function drawChart(data) {
    var sortedData = data.sort(function (a, b) {
        return a[1] - b[1];
    });
    var GDPs = data.map(function (d) {
        return +d[1];
    });

    var width = window.getComputedStyle(document.querySelector('#chart')).getPropertyValue('width').split('px')[0];

    var height = width / 2;

    var y = (0, _d.scaleLinear)().domain([0, GDPs[GDPs.length - 1]]).range([height, 0]);

    var chart = (0, _d.select)('#chart').style('width', width + 'px').style('height', height + 'px');

    var barWidth = width / data.length;

    var bar = chart.selectAll('.bar').data(sortedData).enter().append('div').attr('class', 'bar').style('width', barWidth - 1 + 'px').style('bottom', '0').style('height', function (d) {
        return height - y(d[1]) + 'px';
    }).style('transform', function (d, i) {
        return 'translateX(' + i * barWidth + 'px)';
    }).attr('data-date', function (d) {
        return d[0];
    }).attr('data-gdp', function (d) {
        return d[1];
    });

    displayInfoOnHover();
}

fetch(url).then(function (response) {
    return response.json();
}).then(function (response) {
    return drawChart(response.data);
});
