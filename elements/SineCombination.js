const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
                display: inline-block;
            }
            svg {
                background-color: var(--screen-background-color, #0e0e1d);
            }
            polyline {
                stroke-width: var(--line-width, 1px);
                stroke: var(--line-color, #faebd7);
                fill: none;
                stroke-dasharray: var(--resolution, 0);
            }
            line {
                stroke-width: 1px /*var(--line-width, 1px)*/;
                stroke: var(--line-color, #faebd7);
                stroke-dasharray: 2;
            }
    </style>
    <svg  viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg" width="400" height="100">
        <line />
        <g data-wave-container transform="translate(0, 50)">
            <polyline />
        </g>
    </svg>
`;

export default class SineCombination extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }


    set data(data) {

        const all = data.map(p => this.calculateSineCurve(p.frequency, p.amplitude, 400));

        const arr = this.combineCurves(all, 1);


        let str = arr.reduce((previous, current, index) => {
            return previous + `${index}, ${current * 40} `;
        }, '');

        this.shadowRoot.querySelector('polyline').setAttributeNS(null, 'points', str);

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

    // Combine a number of wave partials.
    combineCurves(partials, gain) {
        const sampleCount = partials[0].length;
        return Array.from({ length: sampleCount })
            .map((_, sampleNumber) => this.calculateCombinedSample(partials, sampleNumber, gain));
    }

    // Calculate a single sample for the combined curve of a number of partials.
    // List<List<number>>
    calculateCombinedSample(partials, sampleNumber, gain) {

        // Sum up the values of all the sine waves for this particular sample.
        const sum = partials
            .map(p => p[sampleNumber])
            .reduce((sum, s) => sum + s, 0);
        // Apply master gain to the sum.
        const sample = sum * gain;
        // Clamp to [-1..1]
        return Math.min(1, Math.max(-1, sample));
    }
}


window.customElements.define('element-sine-combination', SineCombination);
