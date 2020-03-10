import '../elements/Workstation.js';
import '../machines/Master.js';
import '../machines/Keyboard.js';
import '../symbols/ADSR.js';
import '../symbols/Oscillator.js';
import '../symbols/Gain.js';

export default class AdditiveAdsrSynth extends HTMLElement {

    masterElement;
    masterContext
    masterAnalyze;
    masterMachines;
    masterGain;

    harmonicFunctions = {
        1: (i, note) => this.transposeNote(i * 12, (note / 2)),
        2: (i, note) => note * Math.pow(2, i),
        3: (i, note) => note * (i + 1),
    };

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-workstation slot="aside">
                <button data-preset-1>1</button>
                <button data-preset-2>2</button>
                <button data-preset-3>3</button>
                <machine-keyboard keys></machine-keyboard>
                <div>
                    <symbol-oscillator></symbol-oscillator>
                    <symbol-oscillator></symbol-oscillator>
                    <symbol-oscillator></symbol-oscillator>
                    <symbol-oscillator></symbol-oscillator>
                    <symbol-oscillator></symbol-oscillator>
                </div>
                <div>
                    <symbol-adsr a="0" s="0" d="0"></symbol-adsr>
                    <symbol-adsr a="0" s="0" d="0"></symbol-adsr>
                    <symbol-adsr a="0" s="0" d="0"></symbol-adsr>
                    <symbol-adsr a="0" s="0" d="0"></symbol-adsr>
                    <symbol-adsr a="0" s="0" d="0"></symbol-adsr>
                </div>
                <div>
                    <symbol-gain></symbol-gain>
                    <symbol-gain></symbol-gain>
                    <symbol-gain></symbol-gain>
                    <symbol-gain></symbol-gain>
                    <symbol-gain></symbol-gain>
                </div>
                <machine-master />
            </element-workstation>
        `;

        this.draw = this.draw.bind(this);
        this.noteOn = this.noteOn.bind(this);
        this.noteOff = this.noteOff.bind(this);
    }

    connectedCallback() {
        this.setAttribute('harmonic', 1);

        const keyboardElement = this.shadowRoot.querySelector('machine-keyboard');
        keyboardElement.addEventListener('start', this.noteOn);
        keyboardElement.addEventListener('stop', this.noteOff);

        this.shadowRoot.querySelector('[data-preset-1]').addEventListener('click', () => this.setAttribute('harmonic', 1));
        this.shadowRoot.querySelector('[data-preset-2]').addEventListener('click', () => this.setAttribute('harmonic', 2));
        this.shadowRoot.querySelector('[data-preset-3]').addEventListener('click', () => this.setAttribute('harmonic', 3));
    }

    disconnectedCallback() {
        this.masterMachines && this.masterMachines.forEach(item => {
            this.masterGain && this.masterGain.gain.setValueAtTime(.5, this.masterContext.currentTime);
            this.masterGain && this.masterGain.gain.exponentialRampToValueAtTime(0.001, this.masterContext.currentTime + .3);
            item.osc.stop(this.masterContext.currentTime + .3);
        });
    }

    noteOn(event) {
        const noteTime = 2
        this.masterContext = new AudioContext();

        const oscillatorSymbols = this.shadowRoot.querySelectorAll('symbol-oscillator');
        const envelopeSymbols = this.shadowRoot.querySelectorAll('symbol-adsr');
        const gainSymbols = this.shadowRoot.querySelectorAll('symbol-gain');

        this.masterMachines = Array.from({ length: 5 }).map((_, i, c) => {
            const harmonicType = this.getAttribute('harmonic');
            const frequency = this.harmonicFunctions[harmonicType](i, event.detail);
            oscillatorSymbols[i].setAttribute('frequency', frequency);
            const amplitude = 1 / (i + 2);
            envelopeSymbols[i].setAttribute('d', amplitude * 100 * 2);
            gainSymbols[i].setAttribute('amount', amplitude);

            const osc = this.masterContext.createOscillator();
            osc.frequency.value = frequency;
            const gain = this.masterContext.createGain();
            gain.gain.value = amplitude
            osc.connect(gain);

            if (i !== 0) {
                gain.gain.setValueAtTime(1 / i, this.masterContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(
                    .0001,
                    this.masterContext.currentTime + (noteTime * (1 - ((i / c.length))))
                );
            }

            return {
                osc,
                gain,
            }
        });

        this.masterGain = this.masterContext.createGain();
        this.masterGain.gain.value = .5;
        this.masterAnalyze = this.masterContext.createAnalyser();
        this.masterMachines.forEach(item => {
            item.gain.connect(this.masterGain);
        });
        this.masterGain.connect(this.masterAnalyze);
        this.masterAnalyze.connect(this.masterContext.destination)
        this.masterMachines.forEach(item => {
            item.osc.start(this.masterContext.currentTime);
        });

        this.masterElement = this.shadowRoot.querySelector('machine-master');
        cancelAnimationFrame(this.animationFrame);
        this.draw();
    }

    noteOff() {
        this.masterMachines && this.masterMachines.forEach(item => {
            this.masterGain && this.masterGain.gain.setValueAtTime(.5, this.masterContext.currentTime);
            this.masterGain && this.masterGain.gain.exponentialRampToValueAtTime(0.001, this.masterContext.currentTime + .3);
            item.osc.stop(this.masterContext.currentTime + .3);
        });
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

window.customElements.define('pad-additive-adsr-synth', AdditiveAdsrSynth);