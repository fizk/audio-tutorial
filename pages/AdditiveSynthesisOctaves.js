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

    <h2>Octives</h2>


    <element-workstation data-example-1>
        <machine-toggle data-toggle-example-1></machine-toggle>
        <ul>
            <li><input type="range" min="0" step=".001" /></li>
            <li><input type="range" min="0" step=".001" /></li>
            <li><input type="range" min="0" step=".001" /></li>
            <li><input type="range" min="0" step=".001" /></li>
            <li><input type="range" min="0" step=".001" /></li>
            <li><input type="range" min="0" step=".001" /></li>
            <li><input type="range" min="0" step=".001" /></li>
            <li><input type="range" min="0" step=".001" /></li>
            <li><input type="range" min="0" step=".001" /></li>
        </ul>
        <machine-master data-master-example-1 />
    </element-workstation>

    <a href="/additive-synthesis/harmonics">harmonics</a>
    <a href="/additive-synthesis/adsr">ADSR</a>
`;
export default class AdditiveSynthesisOctaves extends HTMLElement {

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
        this.toggleExampleOne = this.toggleExampleOne.bind(this);

    }

    connectedCallback() {
        this.shadowRoot.querySelector('[data-toggle-example-1]').addEventListener('toggle', this.toggleExampleOne);
    }

    disconnectedCallback() {
        cancelAnimationFrame(this.animationFrame);
        this.masterMachines && this.masterMachines.forEach(item => {
            item.osc.stop(this.masterContext.currentTime);
        });
    }

    toggleExampleOne(event) {
        if (event.detail) {

            const inputs = this.shadowRoot.querySelectorAll('[data-example-1] input');

            this.masterContext = new AudioContext();
            this.masterMachines = Array.from({ length: 9 }).map((_, i) => {
                const osc = this.masterContext.createOscillator();
                osc.frequency.value = this.transposeNote(i * 12, 110);
                const gain = this.masterContext.createGain();
                gain.gain.value = 1 / (i + 2);
                inputs[i].setAttribute('value', 1 / (i + 2));
                inputs[i].setAttribute('max', 1 / (i + 2));
                inputs[i].addEventListener('input', (event) => gain.gain.value = Number(event.target.value))

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

            this.masterElement = this.shadowRoot.querySelector('[data-master-example-1]');
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

window.customElements.define('page-additive-synthesis-octaves', AdditiveSynthesisOctaves);