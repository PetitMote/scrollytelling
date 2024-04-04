const COLORS = [
    '#136471',
    '#2EAFC4',
    '#406BA4',
    '#40A497',
    '#68A440',
    '#96CA2D',
    '#6540A4',
    '#A440A1',
    '#BB205D',
    '#D6789C',
    '#A44040',
    '#F69364',
    '#999999',
    '#B5B5B5',
];

const aurancolors = {
    id: 'auran_colors',

    defaults: {
        enabled: true,
    },

    beforeLayout(chart, _args, options) {
        if (!options.enabled)
            return true;

        type = chart.config.type;
        datasets = chart.config.data.datasets;
        if (type === 'pie' || type === 'doughnut')
            for (const dataset of datasets) {
                let colors = [];
                for (let i = 0; i < dataset.data.length; i++)
                    colors.push(COLORS[i % COLORS.length]);
                dataset.backgroundColor = colors;
            }
        // TODO Gérer le cas des polarArea, comme le plugin de base
        else {
            let i = 0;
            for (const dataset of datasets) {
                dataset.backgroundColor = COLORS[i % COLORS.length] + "80";
                dataset.borderColor = COLORS[i % COLORS.length];
                i++;
            }
        }
    }
}

