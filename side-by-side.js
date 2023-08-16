// let map = L.map('map').setView([51.505, -0.09], 13);
//
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);


let chartsDict = {};
let chartsData = {
    superficieFrance: {
        labels: ['Aucun habitant', 'Présence d’habitants'],
        datasets: [{
            label: 'Surface (ha)',
            data: [17500000, 37500000]
        }]
    },
    superficieFranceRegions: {
        labels: ['Aucun habitant', 'Présence d’habitants', 'Test'],
        datasets: [{
            label: 'Surface (ha)',
            data: [17500000, 37500000, 20000000]
        }]
    },
    sideChart0: {
        labels: ['Aucun habitant', 'Présence d’habitants'],
        datasets: [{
            label: 'Surface (ha)',
            data: [1000, 1000]
        }
        ]
    },
    sideChart1: {
        labels: ['Aucun habitant', 'Présence d’habitants'],
        datasets: [{
            label: 'Surface (ha)',
            data: [500, 1500]
        }
        ]
    },
    sideChart2: {
        labels: ['Aucun habitant', 'Présence d’habitants'],
        datasets: [{
            label: 'Surface (ha)',
            data: [1500, 500]
        }
        ]
    }
};


function switch_figure(figure_id, new_content) {
    const element = document.getElementById(figure_id);
    element.addEventListener(
        "transitionend",
        () => {
            element.innerHTML = new_content;
            element.style.opacity = '1';
        }, {once: true}
    );
    element.style.opacity = '0';
}


function chart1(canvasId) {
    const canvas = document.getElementById(canvasId);
    chartsDict['chart1'] = new Chart(canvas, {
        type: 'pie',
        data: chartsData.superficieFrance
    })
}


function side_chart() {
    const canvas = document.getElementById('side-chart');
    chartsDict['side-chart'] = new Chart(canvas, {
        type: 'pie',
        data: chartsData.sideChart0
    })
}


document.addEventListener('scroll-scene-enter', (event) => {
        const step = event.detail.element.getAttribute('step');
        event.detail.element.classList.add('is-active');
        const readingDirection = event.detail.isScrollingDown;

        switch (step) {
            case 'intro-aucun-habitant':
                if (readingDirection) {
                    switch_figure('intro', '<img src="data/france-aucun-habitant.png">');
                }
                break;
            case 'detail-chart-1':
                if (readingDirection) {
                    switch_figure('side-figure', '<div class="chart"><canvas id="chart-1"></canvas></div>');
                    setTimeout(chart1, 600, 'chart-1');
                } else {
                    chartsDict.chart1.data = chartsData.superficieFrance;
                    chartsDict.chart1.options = null;
                    chartsDict.chart1.update();
                }
                break;
            case 'detail-chart-2':
                if (!chartsDict['side-chart'])
                    side_chart();
                chartsDict.chart1.data = chartsData.superficieFranceRegions;
                chartsDict.chart1.options = {
                    events: ['click'],
                    onClick: (e) => {
                        const point = chartsDict.chart1.getElementsAtEventForMode(e, 'point', {intersect: true}, true);
                        if (point[0]) {
                            chartsDict['side-chart'].data = chartsData['sideChart' + point[0].index];
                            chartsDict['side-chart'].update();
                        }
                    }
                };
                chartsDict.chart1.update();
                break;
        }
    }
);

document.addEventListener('scroll-scene-exit', (event) => {
    const step = event.detail.element.getAttribute('step');
    event.detail.element.classList.remove('is-active');
    const readingDirection = event.detail.isScrollingDown;
    switch (step) {
        case 'intro-aucun-habitant':
            if (!readingDirection) {
                switch_figure('intro', '<img src="data/france.png">');
            }
            break;
        case 'detail-chart-1':
            if (!readingDirection) {
                switch_figure('side-figure', '<img src="data/france-aucun-habitant.png">');
            }
            break;
        case 'detail-chart-2':
            break;
    }
});