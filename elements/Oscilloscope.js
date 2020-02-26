const template = document.createElement('template');
template.innerHTML = `
    <style>
        svg {
            background-color: var(--oscilloscope-background, transparent);
        }
        polyline {
            fill: none;
            stroke: var(--oscilloscope-stroke, black);
            stroke-width: var(--oscilloscope-width, 1px);
        }
    </style>
    <svg  viewBox="0 0 300 50" xmlns="http://www.w3.org/2000/svg" width="300" height="50">
        <polyline />
    </svg>
`;

export default class Oscilloscope extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    set data(data) {
        const pointsString = this.dataToPoints(data);
        this.setAttribute('points', pointsString);
    }

    connectedCallback() {

    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case 'points':
                this.shadowRoot.querySelector('polyline').setAttribute('points', newValue);
                break;
        }
    }

    static get observedAttributes() { return ['points']; }

    dataToPoints(data) {
        const svg = this.shadowRoot.querySelector('svg');
        const canvasWidth = svg.getAttribute('width');
        const canvasHeight = svg.getAttribute('height');

        const sliceWidth = canvasWidth * 1.0 / data.length;
        let x = 0;
        let points = '';

        for (var i = 0; i < data.length; i++) {
            var v = data[i] / 128.0;
            var y = v * canvasHeight / 2;
            points += `${x}, ${y} `;
            x += sliceWidth;
        }

        return points;
    }
}

window.customElements.define('elements-oscilloscope', Oscilloscope);