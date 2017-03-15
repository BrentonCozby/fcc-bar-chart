'use strict';

var _d = require('d3');

var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

function displayInfoOnHover() {
    var info = document.querySelector('#info');
    var dateElement = document.querySelector('.date');
    var GDPElement = document.querySelector('.GDP');

    document.querySelectorAll('.bar').forEach(function (bar) {
        bar.addEventListener('mouseover', function (e) {
            info.style.visibility = 'visible';
            dateElement.textContent = e.target.dataset.date;
            GDPElement.textContent = e.target.dataset.gdp;
        });

        bar.addEventListener('mouseleave', function (e) {
            info.style.visibility = 'hidden';
        });
    });
}

function formatMoney(num) {
    var decimal = String(num).split('.')[1];
    var wholeNum = String(num).split('.')[0].split('').reverse().map(function (digit, index) {
        if ((index + 1) % 3 === 0) return ',' + digit;
        return digit;
    }).reverse().join('');

    var result = ('$' + wholeNum + (decimal ? '.' + decimal : '')).split('');
    if (result[1] === ',') result.splice(1, 1);

    return result.join('');
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
        return formatMoney(d[1]);
    });

    displayInfoOnHover();
}

fetch(url).then(function (response) {
    return response.json();
}).then(function (response) {
    return drawChart(response.data);
});
