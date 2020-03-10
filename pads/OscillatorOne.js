import '../elements/Workstation.js';
import '../machines/Oscillator.js'
import '../machines/Gain.js'
import '../machines/Master.js'
import '../machines/Toggle.js'

export default class OscillatorOne extends HTMLElement {
    context;
    osc;
    gain;
    masterAnalyze;
    oscillatorElement;
    oscAnalyze;
    animationFrame

    constructor() {
        super();

        this.handleToggle = this.handleToggle.bind(this);
        this.animation = this.animation.bind(this);

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-workstation data-worstation-1 slot="aside">
                <machine-toggle></machine-toggle>
                <machine-oscillator></machine-oscillator>
                <machine-gain></machine-gain>
                <machine-master></machine-master>
            </element-workstation>
        `;
    }

    connectedCallback() {
        const toggleElement = this.shadowRoot.querySelector('machine-toggle');
        const oscillatorElement = this.shadowRoot.querySelector('machine-oscillator');
        const gainElement = this.shadowRoot.querySelector('machine-gain');

        toggleElement.addEventListener('toggle', this.handleToggle);
        oscillatorElement.addEventListener('frequency-change', (event) => {
            this.osc && (this.osc.frequency.value = Number(event.detail));
        });
        gainElement.addEventListener('amount-change', (event) => {
            this.gain && (this.gain.gain.value = Number(event.detail));
        });
    }

    disconnectedCallback() {
        cancelAnimationFrame(this.animationFrame);
        this.osc && this.osc.stop(this.context.currentTime);
    }

    handleToggle(event) {
        if (event.detail) {
            this.oscillatorElement = this.shadowRoot.querySelector('machine-oscillator');
            const gainElement = this.shadowRoot.querySelector('machine-gain');

            this.masterElement = this.shadowRoot.querySelector('machine-master');

            this.context = new AudioContext();
            this.masterAnalyze = this.context.createAnalyser();
            this.oscAnalyze = this.context.createAnalyser();
            this.osc = this.context.createOscillator();
            this.osc.frequency.value = Number(this.oscillatorElement.getAttribute('frequency'));
            this.gain = this.context.createGain();
            this.gain.gain.value = 0;
            this.gain.gain.setValueAtTime(0, this.context.currentTime);
            this.gain.gain.linearRampToValueAtTime(Number(gainElement.getAttribute('amount')), this.context.currentTime + .05);

            this.osc.connect(this.oscAnalyze);
            this.oscAnalyze.connect(this.gain);
            this.gain.connect(this.masterAnalyze);
            this.masterAnalyze.connect(this.context.destination);
            this.osc.start(this.context.currentTime);

            cancelAnimationFrame(this.animationFrame);
            this.animation();

        } else {
            this.gain.gain.setValueAtTime(.5, this.context.currentTime);
            this.gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.05);
            this.osc.stop(this.context.currentTime + .05);
        }
    }

    animation() {
        this.masterAnalyze.fftSize = 2048;
        const masterMonitorDataArray = new Uint8Array(this.masterAnalyze.frequencyBinCount);
        this.masterAnalyze.getByteTimeDomainData(masterMonitorDataArray);

        this.oscAnalyze.fftSize = 2048;
        const oscMonitorDataArray = new Uint8Array(this.oscAnalyze.frequencyBinCount);
        this.oscAnalyze.getByteTimeDomainData(oscMonitorDataArray);

        this.masterAnalyze.fftSize = 512;
        this.masterAnalyze.minDecibels = -140;
        this.masterAnalyze.maxDecibels = 0;
        const amMasterMonitorByteArray = new Uint8Array(this.masterAnalyze.frequencyBinCount);
        this.masterAnalyze.getByteFrequencyData(amMasterMonitorByteArray);

        this.masterElement.frequencyData = masterMonitorDataArray;
        this.masterElement.byteData = amMasterMonitorByteArray;
        this.oscillatorElement.frequencyData = oscMonitorDataArray;

        this.animationFrame = requestAnimationFrame(this.animation);
    }
}

window.customElements.define('pad-oscillator-one', OscillatorOne);