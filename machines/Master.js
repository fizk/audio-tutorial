import '../elements/Oscilloscope.js';
import '../elements/Frequencyscope.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: inline-block;
            background-color: #90CAF9;
            padding: 1rem;

            --oscilloscope-background: #37474F;
            --oscilloscope-stroke: #90CAF9;
            --oscilloscope-width: 4px;
        }
        h4 {
            margin: 0;
        }
    </style>
    <h4>Master</h4>
    <elements-oscilloscope></elements-oscilloscope>
    <elements-frequencyscope></elements-frequencyscope>
`;

export default class Master extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    set frequencyData(data) {
        this.shadowRoot.querySelector('elements-oscilloscope').data = data;
    }

    set byteData(data) {
        this.shadowRoot.querySelector('elements-frequencyscope').data = data;
    }
};

window.customElements.define('machine-master', Master);