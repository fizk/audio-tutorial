const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
                display: inline-block;
            }
            svg {
                background-color: var(--screen-background-color, #0e0e1d);
            }
            circle {
                stroke-width: var(--line-width, 1px);
                stroke: var(--line-color, #faebd7);
                fill: none;
            }
            line {
                stroke-width: 1px /*var(--line-width, 1px)*/;
                stroke: var(--line-color, #faebd7);
                stroke-dasharray: 2;
            }
    </style>
    <svg  viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <g data-wave-container>
            <line data-hand x1="0" y1="0" x2="0" y2="0" />
            <line data-bar x1="0" y1="0" x2="0" y2="0" />
            <circle cx="0" cy="0" r="40"/>
        </g>
    </svg>
`;

export default class Circle extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() { return ['width', 'height', 'phase', 'amplitude', 'frequency']; }

    connectedCallback() {
        if (!this.hasAttribute('width')) {
            this.setAttribute('width', '400');
        }
        if (!this.hasAttribute('height')) {
            this.setAttribute('height', '100');
        }
        if (!this.hasAttribute('amplitude')) {
            this.setAttribute('amplitude', '40');
        }
        if (!this.hasAttribute('frequency')) {
            this.setAttribute('frequency', '440');
        }
        if (!this.hasAttribute('phase')) {
            this.setAttribute('phase', '0');
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'phase':
            case 'amplitude':
            case 'frequency':
            case 'width':
            case 'height':
                const canvasElement = this.shadowRoot.querySelector('svg');

                const waveContainerElement = this.shadowRoot.querySelector('[data-wave-container]');
                waveContainerElement.setAttributeNS(null, 'transform', `translate(${Number(canvasElement.getAttributeNS(null, 'height') / 2)}, ${Number(canvasElement.getAttributeNS(null, 'height') / 2)})`)

                const phase = Number(this.getAttribute('phase'));
                const radius = Number(canvasElement.getAttributeNS(null, 'width')) / 2

                const y = -1 * this.calculateSample(
                    Number(this.getAttribute('frequency')),
                    Number(this.getAttribute('amplitude')),
                    phase,
                    44100
                );
                const x = this.calculateCos(
                    Number(this.getAttribute('frequency')),
                    Number(this.getAttribute('amplitude')),
                    0 - phase,
                    44100
                );
                // const x = radius * Math.cos(phase);
                // const y = radius * Math.sin(phase);
                const handElement = this.shadowRoot.querySelector('[data-hand]');
                handElement.setAttributeNS(null, 'x1', 0);
                handElement.setAttributeNS(null, 'y1', 0);
                handElement.setAttributeNS(null, 'x2', x);
                handElement.setAttributeNS(null, 'y2', y);

                const barElement = this.shadowRoot.querySelector('[data-bar]');
                barElement.setAttributeNS(null, 'x1', x);
                barElement.setAttributeNS(null, 'y1', y);
                barElement.setAttributeNS(null, 'x2', radius);
                barElement.setAttributeNS(null, 'y2', y);


                break;
        }
    }

    calculateSineCurve(
        frequency,
        amplitude,
        offset = 0,
        sampleCount = 650,
        sampleRate = 44100
    ) {
        return Array.from({ length: sampleCount })
            .map((_, sampleNumber) => this.calculateSample(frequency, amplitude, sampleNumber - offset, sampleRate));
    }

    calculateSample(
        frequency,
        amplitude,
        sampleNumber,
        sampleRate
    ) {
        // How many radians per second does the oscillator go?
        const angularFrequency = frequency * 2 * Math.PI;
        // What's the "time" of this sample in our curves?
        const sampleTime = sampleNumber / sampleRate;
        // What's the angle of the oscillator at this time?
        const sampleAngle = sampleTime * angularFrequency;
        // What's the value of the sinusoid for this angle?
        return amplitude * Math.sin(sampleAngle);
    }


    calculateCos(
        frequency,
        amplitude,
        sampleNumber,
        sampleRate
    ) {
        // How many radians per second does the oscillator go?
        const angularFrequency = frequency * 2 * Math.PI;
        // What's the "time" of this sample in our curves?
        const sampleTime = sampleNumber / sampleRate;
        // What's the angle of the oscillator at this time?
        const sampleAngle = sampleTime * angularFrequency;
        // What's the value of the sinusoid for this angle?
        return amplitude * Math.cos(sampleAngle);
    }
}


window.customElements.define('element-circle', Circle);
