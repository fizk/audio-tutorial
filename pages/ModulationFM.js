import '../elements/Workstation.js';
import '../machines/Gain.js';
import '../machines/LFO.js';
import '../machines/Oscillator.js';
import '../machines/Master.js';
import '../machines/Keyboard.js';
import '../machines/Toggle.js';

const template = document.createElement('template');
template.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                article {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-areas:
                        "header header"
                        "main aside"
                        "footer footer"
                }
                header{
                    grid-area: header;
                }
                main{
                    grid-area: main;
                }
                aside{
                    grid-area: aside;
                }
                footer{
                    grid-area: footer;
                }
            </style>
            <article>
                <header>
                    <h2>FM synth</h2>
                </header>
                <main>
                    <p>We can also control the frequency of a carrier with an LFO</p>
                    <p>
                        In the AM synth example, we were controlling the Gain module where
                        we were going from 0 to 1. When it comes to the frequency of the carrier,
                        a deviation of 1 will not have much of an effect, we wouldn't hear it.
                    </p>
                    <p>
                        In the western music system, the middle A is 440Hz. The note before it (A&#9837;) is
                        415.30Hz and the note above it (A&#9839) is 466.16Hz. For our LFO to be able to create range
                        of at least 25 units in eather direction we need to change its amount's min/max configuration
                        so it can vary in an auditable way.
                    </p>
                    <p>
                        Now, rather than to connect the LFO to the Gain as we did in the AM example,
                        we connect it directly into our Oscillator/carrier because we want to modulate the frequency
                        of the carrier. Everything else is pretty much the same.
                        The LFO's frequency slider is controlling how fast the deviation is going, The amount slider
                        is controlling how wide the deviation is.
                    </p>
                    <p>
                        Turn on the the workstation and hear it action. Preset 1 sents the sound to some 50s Space movie
                        effect. Preset 3 turns off the LFO. On Preset 2 you can see how the wave in the Master is contracting
                        and expanding in accordance to the wave generated in the LFO
                    </p>
                    <p></p>
                </main>
                <aside>
                    <button data-fm-preset-1>Preset 1</button>
                    <button data-fm-preset-2>Preset 2</button>
                    <button data-fm-preset-3>Preset 3</button>
                    <element-workstation data-worstation-fm>
                        <machine-toggle></machine-toggle>
                        <machine-oscillator data-oscillator-fm frequency="440"></machine-oscillator>
                        <machine-lfo data-lfo-fm min="0" max="880" amount="440"></machine-lfo>
                        <machine-gain data-gain-fm amount="0.3"></machine-gain>
                        <machine-master data-master-fm></machine-master>
                    </element-workstation>
                </aside>
                <footer>
                    <a href="/modulation/am">AM synth</a>
                    <a href="/modulation/play">Play</a>
                </footer>
            </article>
`;

export default class ModulationFM extends HTMLElement {
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


        this.fmDraw = this.fmDraw.bind(this);

        this.initFM = this.initFM.bind(this);


        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {

        this.shadowRoot.querySelector('machine-toggle').addEventListener('toggle', this.initFM);

        //LFO
        [

            this.shadowRoot.querySelector('[data-lfo-fm]'),
        ].forEach(element => element.addEventListener('frequency-change', (event) => {
            this.modulator && (this.modulator.frequency.linearRampToValueAtTime(event.detail, this.context.currentTime + 0.1));
        }));

        [

            this.shadowRoot.querySelector('[data-lfo-fm]'),
        ].forEach(element => element.addEventListener('amount-change', (event) => {
            this.lfoGain && (this.lfoGain.gain.linearRampToValueAtTime(event.detail, this.context.currentTime + 0.1));
        }));

        [

            this.shadowRoot.querySelector('[data-lfo-fm]'),
        ].forEach(element => element.addEventListener('type-change', (event) => {
            this.modulator && (this.modulator.linearRampToValueAtTime(event.detail, this.context.currentTime + 0.1));
        }));

        //Carries
        [

            this.shadowRoot.querySelector('[data-oscillator-fm]'),
        ].forEach(element => element.addEventListener('frequency-change', (event) => {
            this.carrier && (this.carrier.frequency.linearRampToValueAtTime(event.detail, this.context.currentTime + 0.1));
        }));

        [

            this.shadowRoot.querySelector('[data-oscillator-fm]'),
        ].forEach(element => element.addEventListener('type-change', (event) => {
            this.carrier && (this.carrier.linearRampToValueAtTime(event.detail, this.context.currentTime + 0.1));
        }));

        //Gain
        [

            this.shadowRoot.querySelector('[data-gain-fm]'),
        ].forEach(element => element.addEventListener('amount-change', (event) => {
            this.mainGain && (this.mainGain.gain.linearRampToValueAtTime(event.detail, this.context.currentTime + 0.1));
        }));



        //FM presets
        this.shadowRoot.querySelector('[data-fm-preset-1]').addEventListener('click', () => {
            this.shadowRoot.querySelector('[data-oscillator-fm]').setAttribute('frequency', '440');
            this.carrier && (this.carrier.frequency.value = 440);

            this.shadowRoot.querySelector('[data-lfo-fm]').setAttribute('frequency', '10');
            this.modulator && (this.modulator.frequency.value = 10);

            this.shadowRoot.querySelector('[data-lfo-fm]').setAttribute('amount', '440');
            this.lfoGain && (this.lfoGain.gain.value = 440);
        });
        this.shadowRoot.querySelector('[data-fm-preset-2]').addEventListener('click', () => {
            this.shadowRoot.querySelector('[data-oscillator-fm]').setAttribute('frequency', '440');
            this.carrier && (this.carrier.frequency.value = 440);

            this.shadowRoot.querySelector('[data-lfo-fm]').setAttribute('frequency', '1');
            this.modulator && (this.modulator.frequency.value = 1);

            this.shadowRoot.querySelector('[data-lfo-fm]').setAttribute('amount', '880');
            this.lfoGain && (this.lfoGain.gain.value = 880);
        });
        this.shadowRoot.querySelector('[data-fm-preset-3]').addEventListener('click', () => {

            this.shadowRoot.querySelector('[data-lfo-fm]').setAttribute('frequency', '0');
            this.modulator && (this.modulator.frequency.value = 0);

            this.shadowRoot.querySelector('[data-lfo-fm]').setAttribute('amount', '0');
            this.lfoGain && (this.lfoGain.gain.value = 0);
        });

    }

    disconnectedCallback() {
        this.carrier && this.carrier.stop(this.context.currentTime)
        this.modulator && this.modulator.stop(this.context.currentTime);
        cancelAnimationFrame(this.animationFrame);
    }

    initFM(event) {
        if (event.detail) {

            const carrierElement = this.shadowRoot.querySelector('[data-oscillator-fm]');
            const lfoElement = this.shadowRoot.querySelector('[data-lfo-fm]');
            const gainElement = this.shadowRoot.querySelector('[data-gain-fm]');

            this.context = new AudioContext();

            this.masterMonitor = this.context.createAnalyser();
            this.lfoMonitor = this.context.createAnalyser();
            this.carrierMonitor = this.context.createAnalyser();

            this.carrier = this.context.createOscillator();
            this.carrier.frequency.value = Number(carrierElement.getAttribute('frequency'));
            this.modulator = this.context.createOscillator();
            this.modulator.frequency.value = Number(lfoElement.getAttribute('frequency'));

            this.mainGain = this.context.createGain();
            this.mainGain.gain.value = Number(gainElement.getAttribute('amount'));
            this.lfoGain = this.context.createGain();
            this.lfoGain.gain.value = Number(lfoElement.getAttribute('amount'));


            this.modulator.connect(this.lfoGain);
            this.lfoGain.connect(this.lfoMonitor);
            this.lfoMonitor.connect(this.carrier.detune);

            this.carrier.connect(this.carrierMonitor)
            this.carrierMonitor.connect(this.mainGain);

            this.mainGain.connect(this.masterMonitor);
            this.masterMonitor.connect(this.context.destination);

            this.carrier.start(this.context.currentTime)
            this.modulator.start(this.context.currentTime);

            cancelAnimationFrame(this.animationFrame);
            this.fmDraw();

        } else {
            this.carrier.stop(this.context.currentTime)
            this.modulator.stop(this.context.currentTime);
            this.carrier = undefined;
            this.modulator = undefined;
            cancelAnimationFrame(this.animationFrame);
        }
    }

    fmDraw() {
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

        this.shadowRoot.querySelector('[data-lfo-fm]').frequencyData = amLFOMonitorDataArray;
        this.shadowRoot.querySelector('[data-oscillator-fm]').frequencyData = amCarrierMonitorDataArray;
        this.shadowRoot.querySelector('[data-master-fm]').frequencyData = amMasterMonitorDataArray;
        this.shadowRoot.querySelector('[data-master-fm]').byteData = amMasterMonitorByteArray;


        this.animationFrame = requestAnimationFrame(this.fmDraw);
    }

}

window.customElements.define('page-modulation-fm', ModulationFM);