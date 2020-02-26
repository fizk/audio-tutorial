import '../elements/SineCombination.js';
import '../elements/Workstation.js';
import '../elements/SineWave.js';
import '../machines/Master.js';
import '../machines/Keyboard.js';
import '../machines/Toggle.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>

    </style>

    <h2>Harmonics</h2>
    <p>
        Have a play with the amplitude 9 oscilltors all wired to the master. Each oscillator's frequency
        is the two times the previous one (440, 880, 1320, 1760). There are some presets there as well
        where you can approximate square, sawtooth and triangular wave.
    </p>

    <element-workstation data-example-0>
        <machine-toggle data-toggle-example-0></machine-toggle>
        <button data-preset-example-0-sine>sine</button>
        <button data-preset-example-0-square>square</button>
        <button data-preset-example-0-saw>saw</button>
        <button data-preset-example-0-tri>tri</button>
        <ul>
            <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
            <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
            <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
            <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
            <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
            <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
            <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
            <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
            <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
        </ul>
        <machine-master data-master-example-0 />
    </element-workstation>


    <a href="/additive-synthesis/builder">Wave Builder</a>
    <a href="/additive-synthesis/octaves">octaves</a>
`;
export default class AdditiveSynthesisHarmonics extends HTMLElement {

    masterElement;
    masterContext
    masterAnalyze;
    masterMachines;
    masterGain;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.draw = this.draw.bind(this);
        this.toggleExampleZero = this.toggleExampleZero.bind(this);

        this.togglePreset = this.togglePreset.bind(this);

    }

    connectedCallback() {
        this.shadowRoot.querySelector('[data-toggle-example-0]').addEventListener('toggle', this.toggleExampleZero);

        this.shadowRoot.querySelector('[data-preset-example-0-sine').addEventListener('click', () => this.togglePreset('sine'));
        this.shadowRoot.querySelector('[data-preset-example-0-square').addEventListener('click', () => this.togglePreset('square'));
        this.shadowRoot.querySelector('[data-preset-example-0-saw').addEventListener('click', () => this.togglePreset('saw'));
        this.shadowRoot.querySelector('[data-preset-example-0-tri').addEventListener('click', () => this.togglePreset('tri'));
    }

    disconnectedCallback() {
        cancelAnimationFrame(this.animationFrame);
        this.masterMachines && this.masterMachines.forEach(item => {
            item.osc.stop(this.masterContext.currentTime);
        });
    }


    togglePreset(type) {
        const workstationElement = this.shadowRoot.querySelector('[data-example-0]');
        const listElements = workstationElement.querySelectorAll('li');
        const AMPLITUDE_FUNCTIONS = {
            // In a pure sine wave we only play the fundamental frequency.
            sine: (index) => index === 0 ? 1 : 0,
            // In a sawtooth wave we play all frequencies with descending amplitudes.
            saw: (index) => 1 / (index + 1),
            // In a square wave we only play odd harmonics with descending amplitudes.
            // (Here we check if the number is even, not odd, because 0 is the fundamental.)
            square: (index) => index % 2 === 0 ? 1 / (index + 1) : 0,
            // 1/Harmonic Number Squared
            //The ratio 1/harmonic number squared means that the first harmonic has an amplitude of 1/1,
            // or 1; that the third harmonic will have an amplitude of 1/9 (one ninth the strength of the fundamental);
            // the fifth harmonic will have an amplitude of 1/25 (one twenty-fifth the strength of the fundamental), and so on.
            tri: (index) => (index % 2 === 0) ? 1 / Math.pow(2, index) : 0,

        };
        this.masterMachines && this.masterMachines.forEach((item, i) => {
            const amplitude = AMPLITUDE_FUNCTIONS[type](i);
            listElements[i].querySelector('input').value = amplitude
            listElements[i].querySelector('span').innerHTML = amplitude.toFixed(2);
            item.gain.gain.value = amplitude;
        });
    }

    toggleExampleZero(event) {
        if (event.detail) {

            const workstationElement = this.shadowRoot.querySelector('[data-example-0]');
            const listElements = workstationElement.querySelectorAll('li');

            this.masterContext = new AudioContext();
            this.masterMachines = Array.from({ length: 9 }).map((_, i) => {
                const osc = this.masterContext.createOscillator();
                osc.frequency.value = 440 * (1 + i)
                const gain = this.masterContext.createGain();
                gain.gain.value = i === 0 ? 1 : 0 ;
                listElements[i].querySelector('input').value = i === 0 ? 1 : 0;
                listElements[i].querySelector('span').innerHTML = i === 0 ? 1 : 0;


                listElements[i].querySelector('input').addEventListener('input', (event) => gain.gain.value = Number(event.target.value))

                osc.connect(gain);
                return {
                    osc,
                    gain,
                }
            });
            const gain = this.masterContext.createGain();
            gain.gain.value = .5;
            this.masterAnalyze = this.masterContext.createAnalyser();
            this.masterMachines.forEach(item => {
                item.gain.connect(gain);
            });
            gain.connect(this.masterAnalyze);
            this.masterAnalyze.connect(this.masterContext.destination)
            this.masterMachines.forEach(item => {
                item.osc.start(this.masterContext.currentTime);
            });

            this.masterElement = this.shadowRoot.querySelector('[data-master-example-0]');
            this.draw();
        } else {
            cancelAnimationFrame(this.animationFrame);
            this.masterMachines.forEach(item => {
                item.osc.stop(this.masterContext.currentTime);
            });
        }
    }

    draw() {
        this.masterAnalyze.fftSize = 2048;
        const masterMonitorDataArray = new Uint8Array(this.masterAnalyze.frequencyBinCount);
        this.masterAnalyze.getByteTimeDomainData(masterMonitorDataArray);

        this.masterAnalyze.fftSize = 512;
        this.masterAnalyze.minDecibels = -140;
        this.masterAnalyze.maxDecibels = 0;
        const amMasterMonitorByteArray = new Uint8Array(this.masterAnalyze.frequencyBinCount);
        this.masterAnalyze.getByteFrequencyData(amMasterMonitorByteArray);

        this.masterElement.frequencyData = masterMonitorDataArray;
        this.masterElement.byteData = amMasterMonitorByteArray;

        this.animationFrame = requestAnimationFrame(this.draw);
    }

    transposeNote(noteOffset, baseFrequency = 440) {
        return baseFrequency * Math.pow(2, noteOffset / 12);
    }

}

window.customElements.define('page-additive-synthesis-harmonics', AdditiveSynthesisHarmonics);