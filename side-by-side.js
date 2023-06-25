let map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


const chartSupFrance = document.getElementById('chart-superficie-france').querySelector('canvas');

new Chart(chartSupFrance, {
    type: 'pie',
    data: {
        labels: ['Aucun habitant', 'Présence d’habitants'],
        datasets: [{
            label: 'Surface (ha)',
            data: [17500000, 37500000],
            borderWidth: 1
        }]
    }
})

function show_figure (id) {
    const element = document.querySelector(`#${id}`);
    element.style.visibility = 'visible';
    element.style.opacity = '100%';
}

function hide_figure (id) {
    const element = document.querySelector(`#${id}`);
    if (element.style.visibility === 'visible') {
        element.addEventListener("transitionend", () => {
            element.style.visibility = 'collapse';
        }, {once: true});
        element.style.opacity = '0';
    }
}

document.addEventListener('scroll-scene-enter', (event) => {
    const step = event.detail.element.getAttribute('step');
    event.detail.element.classList.add('is-active');
    switch (step) {
        case 'hello':
            show_figure('france');
            break;
        case 'aucun-habitant':
            show_figure('france-aucun-habitant');
            break;
        case 'detail-1':
            show_figure('aucun-habitant-detail');
            break;
        case 'detail-chart-1':
            show_figure('chart-superficie-france');
            break;
        case '3':
            map.setView([51.505, -0.09], 5);
            break;
        // case 'hide map':
        //     document.querySelector('#map').setAttribute('hidden', 'true')
        //     break;
    }
})

document.addEventListener('scroll-scene-exit', (event) => {
    const step = event.detail.element.getAttribute('step');
    event.detail.element.classList.remove('is-active');
    switch (step) {
        case 'aucun-habitant':
            if (!event.detail.isScrollingDown) {
                hide_figure('france-aucun-habitant');
            }
            break;
        case 'detail-1':
            hide_figure('aucun-habitant-detail');
            break;
        // case 'hide map':
        //     if (!event.detail.isScrollingDown) {
        //         document.querySelector('#map').removeAttribute('hidden')
        //     }
        //     break;
    }
})