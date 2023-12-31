/* Paramètres globaux pour ChartJS*/

Chart.defaults.locale = 'fr-FR';
/* À cause des réglages du CSS, le navigateur a tendance à redimensionner le canvas du graphique.
   Par défaut, Chart.js désactive les animations de resize, et l’animation d’activation était supplantée par le resize
   Changer le paramètre par défaut pour mettre la même valeur que l’activation permet de la récupérer.
   Par contre, cela veut dire que redimensionner la fenêtre relance l’animation (normalement, c’est ok). */
Chart.defaults.transitions.resize.animation.duration = Chart.defaults.transitions.active.animation.duration;
// Permet d’avoir des graphiques plus responsives
// Voir https://www.chartjs.org/docs/latest/configuration/responsive.html
Chart.defaults.maintainAspectRatio = false;
// Utilisation des couleurs Auran
Chart.defaults.plugins.colors.enabled = false;
Chart.register(aurancolors);


/* Constantes */

const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})
const franceRegions = ['Île-de-France', 'Centre-Val de Loire', 'Bourgogne-Franche-Comté', 'Normandie', 'Hauts-de-France', 'Grand Est', 'Pays de la Loire', 'Bretagne', 'Nouvelle-Aquitaine', 'Occitanie', 'Auvergne-Rhône-Alpes', 'Provence-Alpes-Côte d\'Azur', 'Corse'];


let chartsDict = {}; // Stocke les références aux graphiques Chartjs pour y réaccéder
let chartsData = { // Stocke les données des graphiques pour initialiser ou les mettre à jour
    superficieFrance: {
        labels: ['Aucun habitant', 'Présence d’habitants'],
        datasets: [{
            label: 'Surface (ha)',
            data: [17500000, 37500000]
        }]
    },
    superficieFranceRegions: {
        labels: franceRegions,
        datasets: [{
            label: 'Surface sans habitants (ha)',
            data: [831683, 2758933, 2710019, 2629621, 2021602, 2430091, 2956420, 2621520, 6538606, 5051758, 4931872, 1547147, 285071]
        }]
    },
    superficieRegion: [ // Graphiques par région, sous forme de liste permettant de switcher par index via un graphique interactif
        {// Île-de-France
            labels: ['Aucun habitant', 'Présence d’habitants'],
            datasets: [{
                label: 'Surface (ha)',
                data: [375300, 831683]
            }
            ]
        },
        { // Centre-Val de Loire
            labels: ['Aucun habitant', 'Présence d’habitants'],
            datasets: [{
                label: 'Surface (ha)',
                data: [1194057, 2758933]
            }
            ]
        },
        { // Bourgogne-Franche-Comté
            labels: ['Aucun habitant', 'Présence d’habitants'],
            datasets: [{
                label: 'Surface (ha)',
                data: [2096078, 2710019]
            }
            ]
        },
        { // Normandie
            labels: ['Aucun habitant', 'Présence d’habitants'],
            datasets: [{
                label: 'Surface (ha)',
                data: [379652, 2629621]
            }
            ]
        },
        { // Hauts-de-France
            labels: ['Aucun habitant', 'Présence d’habitants'],
            datasets: [{
                label: 'Surface (ha)',
                data: [1173502, 2021602]
            }
            ]
        },
        { // Grand Est
            labels: ['Aucun habitant', 'Présence d’habitants'],
            datasets: [{
                label: 'Surface (ha)',
                data: [3342443, 2430091]
            }
            ]
        },
        { // Pays de la Loire
            labels: ['Aucun habitant', 'Présence d’habitants'],
            datasets: [{
                label: 'Surface (ha)',
                data: [284438, 2956420]
            }
            ]
        },
        { // Bretagne
            labels: ['Aucun habitant', 'Présence d’habitants'],
            datasets: [{
                label: 'Surface (ha)',
                data: [125893, 2621520]
            }
            ]
        },
        { // Nouvelle-Aquitaine
            labels: ['Aucun habitant', 'Présence d’habitants'],
            datasets: [{
                label: 'Surface (ha)',
                data: [1979767, 6538606]
            }
            ]
        },
        { // Occitanie
            labels: ['Aucun habitant', 'Présence d’habitants'],
            datasets: [{
                label: 'Surface (ha)',
                data: [2284458, 5051758]
            }
            ]
        },
        { // Auvergne-Rhône-Alpes
            labels: ['Aucun habitant', 'Présence d’habitants'],
            datasets: [{
                label: 'Surface (ha)',
                data: [2158392, 4931872]
            }
            ]
        },
        { // Provence-Alpes-Côte d'Azur
            labels: ['Aucun habitant', 'Présence d’habitants'],
            datasets: [{
                label: 'Surface (ha)',
                data: [1619897, 1547147]
            }
            ]
        },
        { // Corse
            labels: ['Aucun habitant', 'Présence d’habitants'],
            datasets: [{
                label: 'Surface (ha)',
                data: [587082, 285071]
            }
            ]
        }]
};
let mapDict = {}; // Stock les références aux cartes Leaflet


/* Fonctions réutilisables */

function switchFigure(figureId, newContent) {
    const element = document.getElementById(figureId);
    element.addEventListener(
        "transitionend",
        () => {
            element.innerHTML = newContent;
            element.style.opacity = '1';
        }, {once: true}
    );
    element.style.opacity = '0';
}


function switchChart(oldChartId, newChartFunction, canvasId) {
    chartsDict[oldChartId].destroy();
    delete chartsDict[oldChartId];
    newChartFunction(canvasId);
}


async function geoJsonToLayer(geoJson, map, options) {
    const response = await fetch(geoJson);
    const data = await response.json();
    return L.geoJson(data, options).addTo(map);
}

/* Fonctions de créations de graphiques */

function chartSupFrance(canvasId) {
    const canvas = document.getElementById(canvasId);
    chartsDict['superficieFrance'] = new Chart(canvas, {
        type: 'pie',
        data: chartsData.superficieFrance,
    })
}


function chartSupRegions(canvasId) {
    const canvas = document.getElementById(canvasId);
    chartsDict['superficieFranceRegions'] = new Chart(canvas, {
        type: 'bar',
        data: chartsData.superficieFranceRegions,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            events: ['click'],
            onClick: (e) => {
                const point = chartsDict.superficieFranceRegions.getElementsAtEventForMode(e, 'point', {intersect: true}, true);
                if (point[0]) {
                    chartsDict.superficieRegion.data = chartsData.superficieRegion[point[0].index];
                    chartsDict.superficieRegion.options.plugins.title.text = franceRegions[point[0].index];
                    chartsDict.superficieRegion.update();
                }
            }
        },
    });
}


function chartSupRegion() {
    const canvas = document.getElementById('chart-sup-region');
    chartsDict.superficieRegion = new Chart(canvas, {
        type: 'pie',
        data: chartsData.superficieRegion[0],
        options: {
            maintainAspectRatio: true, // Certains graphiques nécessitent de remettre l’option maintainAspectRatio pour éviter qu’ils ne débordent à l’infini
            plugins: {
                title: {
                    display: true,
                    text: franceRegions[0],
                }
            }
        }
    })
}


function chartSupRegionList() {
    const canvasList = document.getElementsByClassName('chart-sup-region-liste');
    let i = 0;
    chartsDict.superficieRegionList = [];
    for (const canvas of canvasList) {
        chartsDict.superficieRegionList[i] = new Chart(canvas, {
            type: 'pie',
            data: chartsData.superficieRegion[i],
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: franceRegions[i],
                    },
                    legend: {
                        display: false
                    }
                }
            }
        })
        i++;
    }
}


/* Fonctions de création de cartes */

function mapHabitants() {
    const mapContainer = document.querySelector('#map-figure > div')
    mapDict.carteHabitants = L.map(mapContainer, {preferCanvas: true}).setView([47, 3], 6);
    osmLayer.addTo(mapDict.carteHabitants);
    geoJsonToLayer('data/habitants_ici_simplif.geojson', mapDict.carteHabitants, {
        style: {
            color: '#fa210f',
            weight: 0,
            opacity: 0.6
        }
    });
}

document.addEventListener('scroll-scene-enter', (event) => {
        const step = event.detail.element.getAttribute('step');
        event.detail.element.classList.add('is-active');
        const readingDirection = event.detail.isScrollingDown;

        switch (step) {
            case 'intro-aucun-habitant':
                if (readingDirection) {
                    switchFigure('intro', '<img src="data/france-aucun-habitant.png">');
                }
                break;
            case 'detail-chart-sup-france':
                if (readingDirection) {
                    switchFigure('side-figure', '<div class="chart"><canvas id="detail-1-chart"></canvas></div>');
                    setTimeout(chartSupFrance, 350, 'detail-1-chart');
                } else {
                    switchChart('superficieFranceRegions', (canvasId) => chartSupFrance(canvasId), 'detail-1-chart');
                }
                break;
            case 'detail-chart-sup-regions':
                if (readingDirection) {
                    if (!chartsDict['superficieRegion'])
                        chartSupRegion();
                    switchChart('superficieFrance', (canvasId) => chartSupRegions(canvasId), 'detail-1-chart');
                }
                break;
            case 'chart-sup-regions-paging':
                if (!chartsDict.superficieRegionList) {
                    chartSupRegionList();
                }
                break;
            case 'carte-habitants':
                if (!mapDict.carteHabitants)
                    mapHabitants();
                mapDict.carteHabitants.setView([47, 3], 6)
                break;
            case 'carte-habitants-grand-est':
                if (!mapDict.carteHabitants)
                    mapHabitants();
                mapDict.carteHabitants.setView([48.2, 5], 8)
                break;
            case 'carte-habitants-parcs-nationaux':
                if (!mapDict.carteHabitants)
                    mapHabitants();
                mapDict.carteHabitants.setView([44.2, 4.5], 8)
                break;
            case 'carte-habitants-landes':
                if (!mapDict.carteHabitants)
                    mapHabitants();
                mapDict.carteHabitants.setView([44.5, 0], 8)
                break;
            case 'carte-habitants-ouest':
                if (!mapDict.carteHabitants)
                    mapHabitants();
                mapDict.carteHabitants.setView([48, -1], 8)
                break;
            case 'image-grand-est':
                switchFigure('side-demo-scroll', '<img src="data/grand-est.png">');
                break;
            case 'image-parcs-nationaux':
                switchFigure('side-demo-scroll', '<img src="data/parcs-nationaux.png">');
                break;
            case 'image-landes':
                switchFigure('side-demo-scroll', '<img src="data/landes.png">');
                break;
            case 'image-grand-ouest':
                switchFigure('side-demo-scroll', '<img src="data/grand-ouest.png">');
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
                switchFigure('intro', '<img src="data/france.png">');
            }
            break;
        case 'detail-chart-sup-france':
            if (!readingDirection) {
                switchFigure('side-figure', '<img src="data/france-aucun-habitant.png">');
            }
            break;
        case 'detail-chart-sup-regions':
            break;
        case 'chart-sup-regions-paging':
            break;
        case 'carte-habitants':
            break;
        case 'carte-habitants-grand-est':
            break;
        case 'carte-habitants-parcs-nationaux':
            break;
        case 'carte-habitants-landes':
            break;
        case 'carte-habitants-ouest':
            break;
    }
});