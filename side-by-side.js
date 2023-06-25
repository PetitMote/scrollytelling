let map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


const ctx = document.getElementById('chart');

new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Aucun habitant', 'Présence d’habitants'],
        datasets: [{
            label: 'Pourcentage de la surface',
            data: [40, 60],
            borderWidth: 1
        }]
    }
})

document.addEventListener('scroll-scene-enter', (event) => {
    const step = event.detail.element.getAttribute('step');
    event.detail.element.classList.add('is-active');
    switch (step) {
        case '1':
            map.setView([51.505, -0.09], 13);
            break;
        case '2':
            map.setView([51.505, -0.09], 10);
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
        // case 'hide map':
        //     if (!event.detail.isScrollingDown) {
        //         document.querySelector('#map').removeAttribute('hidden')
        //     }
        //     break;
    }
})