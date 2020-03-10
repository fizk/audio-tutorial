import '../elements/Workstation.js';
import '../machines/Gain.js';
import '../machines/LFO.js';
import '../machines/Oscillator.js';
import '../machines/Master.js';
import '../machines/Keyboard.js';
import '../machines/Toggle.js';
import '../symbols/Gain.js';
import '../elements/Article.js';

export default class AmplitudeModulation extends HTMLElement {
    context;
    carrier;
    modulator;
    mainGain;
    masterGain;
    lfoGain;

    masterMonitor;
    lfoMonitor;
    carrierMonitor;

    animationFrame;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <button data-am-preset-1 slot="aside">Preset 1</button>
            <button data-am-preset-2 slot="aside">Preset 2</button>
            <element-workstation data-worstation-am slot="aside">
                <machine-toggle></machine-toggle>
                <machine-oscillator frequency="440"></machine-oscillator>
                <machine-lfo frequency="10" amount="0.5" min="0" max="1"></machine-lfo>
                <symbol-gain></symbol-gain>
                <machine-master></machine-master>
            </element-workstation>
        `;

        this.animate = this.animate.bind(this);
        this.toggleSound = this.toggleSound.bind(this);
    }

    connectedCallback() {
        this.shadowRoot.querySelector('machine-toggle').addEventListener('toggle', this.toggleSound);

        const lfoElement = this.shadowRoot.querySelector('machine-lfo');
        const oscElement = this.shadowRoot.querySelector('machine-oscillator');

        // LFO
        lfoElement.addEventListener('frequency-change', (event) => {
            this.modulator && (this.modulator.frequency.linearRampToValueAtTime(event.detail, this.context.currentTime + 0.1));
        });
        lfoElement.addEventListener('amount-change', (event) => {
            this.lfoGain && (this.lfoGain.gain.linearRampToValueAtTime(event.detail, this.context.currentTime + 0.1));
        });

        // Carries
        oscElement.addEventListener('frequency-change', (event) => {
            this.carrier && (this.carrier.frequency.linearRampToValueAtTime(event.detail, this.context.currentTime + 0.1));
        });

        // Presets
        this.shadowRoot.querySelector('[data-am-preset-1]').addEventListener('click', () => {
            oscElement.setAttribute('frequency', '440');
            this.carrier && (this.carrier.frequency.value = 440);

            lfoElement.setAttribute('frequency', '10');
            this.modulator && (this.modulator.frequency.value = 10);

            lfoElement.setAttribute('amount', '0.5');
            this.lfoGain && (this.lfoGain.gain.value = 0.5);
        });
        this.shadowRoot.querySelector('[data-am-preset-2]').addEventListener('click', () => {
            oscElement.setAttribute('frequency', '227');
            this.carrier && (this.carrier.frequency.value = 227);

            lfoElement.setAttribute('frequency', '1');
            this.modulator && (this.modulator.frequency.value = 1);

            lfoElement.setAttribute('amount', '0.5');
            this.lfoGain && (this.lfoGain.gain.value = 0.5);
        });
    }

    disconnectedCallback() {
        this.carrier && this.carrier.stop(this.context.currentTime)
        this.modulator && this.modulator.stop(this.context.currentTime);
        cancelAnimationFrame(this.animationFrame);
    }

    toggleSound(event) {

        if (event.detail) {

            const f = (mapping, length = 1024) => {
                const array = new Float32Array(length);
                for (let i = 0, len = length; i < len; i++) {
                    // so that the number is between [0, 1]
                    const normalized = (i / (len - 1)) * 2 - 1;
                    array[i] = mapping(normalized, i);
                }
                return array;
            }

            const lfoElement = this.shadowRoot.querySelector('machine-lfo');
            const oscElement = this.shadowRoot.querySelector('machine-oscillator');

            this.context = new AudioContext();

            const waveShaper = this.context.createWaveShaper();
            waveShaper.curve = f(x => (x + 1) / 2);
            waveShaper.oversample = '2x';
            this.masterMonitor = this.context.createAnalyser();
            this.lfoMonitor = this.context.createAnalyser();
            this.carrierMonitor = this.context.createAnalyser();

            this.carrier = this.context.createOscillator();
            this.carrier.frequency.value = Number(oscElement.getAttribute('frequency'));
            this.modulator = this.context.createOscillator();
            this.modulator.frequency.value = Number(lfoElement.getAttribute('frequency'));

            this.mainGain = this.context.createGain();
            this.mainGain.gain.value = 0; //<- - - - -
            this.lfoGain = this.context.createGain();
            this.lfoGain.gain.value = Number(lfoElement.getAttribute('amount'));


            this.modulator.connect(waveShaper);
            waveShaper.connect(this.lfoGain);

            this.lfoGain.connect(this.lfoMonitor);
            this.lfoMonitor.connect(this.mainGain.gain);
            this.carrier.connect(this.carrierMonitor)
            this.carrierMonitor.connect(this.mainGain);
            this.mainGain.connect(this.masterMonitor);
            this.masterMonitor.connect(this.context.destination);

            this.carrier.start(this.context.currentTime)
            this.modulator.start(this.context.currentTime);

            cancelAnimationFrame(this.animationFrame);
            this.animate();

        } else {
            this.carrier.stop(this.context.currentTime)
            this.modulator.stop(this.context.currentTime);
            this.carrier = undefined;
            this.modulator = undefined;
            cancelAnimationFrame(this.animationFrame);
        }
    }

    animate() {

        // master monitor
        this.masterMonitor.fftSize = 2048;
        const amMasterMonitorDataArray = new Uint8Array(this.masterMonitor.frequencyBinCount);
        this.masterMonitor.getByteTimeDomainData(amMasterMonitorDataArray);

        this.masterMonitor.fftSize = 512;
        this.masterMonitor.minDecibels = -140;
        this.masterMonitor.maxDecibels = 0;
        const amMasterMonitorByteArray = new Uint8Array(this.masterMonitor.frequencyBinCount);
        this.masterMonitor.getByteFrequencyData(amMasterMonitorByteArray);

        // lfo monitor
        this.lfoMonitor.fftSize = 2048;
        const amLFOMonitorDataArray = new Uint8Array(this.lfoMonitor.frequencyBinCount);
        this.lfoMonitor.getByteTimeDomainData(amLFOMonitorDataArray);

        // oscillator monitor
        this.carrierMonitor.fftSize = 2048;
        const amCarrierMonitorDataArray = new Uint8Array(this.carrierMonitor.frequencyBinCount);
        this.carrierMonitor.getByteTimeDomainData(amCarrierMonitorDataArray);

        const lfoElement = this.shadowRoot.querySelector('machine-lfo');
        const oscElement = this.shadowRoot.querySelector('machine-oscillator');
        const masterElement = this.shadowRoot.querySelector('machine-master');

        lfoElement.frequencyData = amLFOMonitorDataArray;
        oscElement.frequencyData = amCarrierMonitorDataArray;
        masterElement.frequencyData = amMasterMonitorDataArray;
        masterElement.byteData = amMasterMonitorByteArray;

        this.animationFrame = requestAnimationFrame(this.animate);
    }

}

window.customElements.define('pad-amplitude-modulation', AmplitudeModulation);