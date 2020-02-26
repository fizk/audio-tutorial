const template = document.createElement('template');
template.innerHTML = `
    <style>
        svg {
            background-color: var(--oscilloscope-background, transparent);
        }
        rect {
            fill: var(--oscilloscope-stroke, black);
        }
    </style>
    <svg  viewBox="0 0 300 50" xmlns="http://www.w3.org/2000/svg" width="300" height="50"></svg>
`;

export default class Frequencyscope extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    set data(data) {
        this.dataToPoints(data);
    }

    dataToPoints(data) {
        const svgElement = this.shadowRoot.querySelector('svg');
        svgElement.innerHTML = '';

        var barWidth = (Number(svgElement.getAttributeNS(null, 'width')) / data.length) * 2.5;
        var barHeight;
        var x = 0;

        for (var i = 0; i < data.length; i++) {
            barHeight = data[i] / 2;

            const child = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            child.setAttributeNS(null, 'x', x);
            child.setAttributeNS(null, 'y', Number(svgElement.getAttributeNS(null, 'height')) - barHeight / 2);
            child.setAttributeNS(null, 'width', barWidth);
            child.setAttributeNS(null, 'height', barHeight);
            svgElement.appendChild(child);

            x += barWidth + 1;
        }
    }
}

window.customElements.define('elements-frequencyscope', Frequencyscope);