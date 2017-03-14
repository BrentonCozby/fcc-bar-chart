import 'babel-polyfill'
import {
    scaleLinear,
    select,
    selectAll
} from 'd3'

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

function displayInfoOnHover() {
    const dateElement = document.querySelector('.date')
    const GDPElement = document.querySelector('.GDP')

    document.querySelectorAll('.bar').forEach(bar => {
        bar.addEventListener('mouseover', e => {
            dateElement.textContent = e.target.dataset.date
            GDPElement.textContent = e.target.dataset.gdp
        })
    })
}

function drawChart(data) {
    const sortedData = data.sort( (a, b) => a[1] - b[1] )
    const GDPs = data.map(d => +d[1])

    const width = window
        .getComputedStyle( document.querySelector('#chart') )
        .getPropertyValue('width')
        .split('px')[0]

    const height = width / 2

    const y = scaleLinear()
        .domain([0, GDPs[GDPs.length - 1]])
        .range([height, 0])

    const chart = select('#chart')
        .style('width', width + 'px')
        .style('height', height + 'px')

    const barWidth = width / data.length

    const bar = chart.selectAll('.bar')
        .data(sortedData)
        .enter().append('div')
            .attr('class', 'bar')
            .style('width', (barWidth - 1) + 'px')
            .style('bottom', '0')
            .style('height', d => `${height - y(d[1])}px`)
            .style('transform', (d, i) => (
                `translateX(${ i * barWidth }px)`
            ))
            .attr('data-date', d => d[0])
            .attr('data-gdp', d => d[1])

    displayInfoOnHover()
}

fetch(url)
.then(response => response.json())
.then(response => drawChart(response.data))
