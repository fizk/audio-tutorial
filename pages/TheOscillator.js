import '../elements/Workstation.js';
import '../machines/Oscillator.js'
import '../machines/Gain.js'
import '../machines/Master.js'
import '../machines/Toggle.js'

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
                <h2>The Oscillator</h2>
                </header>
                <main>
                    <p>
                        How about seeing this in action.
                    </p>
                    <p>
                        The <strong>oscillator</strong> is an object that can generate a sequence of
                        numbers over time. It will be our sine wave generator. The names comes from
                        the fact that it oscillates from one number to the other.
                    </p>
                    <p>
                        We have seen previously how to manipulate the <strong>frequency</strong> of a sine
                        wave and said that it controlls the <strong>pich</strong>. We have also seen how
                        we can route the output of a sine wave generator into a <strong>gain</strong> to
                        control the <strong>volume</strong>.
                    </p>
                    <p>
                        Turn on the workstation to the right and play with the sliders,
                        producing different piches and amplitudes. Monitor how the final wave is outputted through
                        the <strong>Master</strong> which represents the final output.
                    </p>
                </main>
                <aside>
                    <element-workstation data-worstation-1>
                        <machine-toggle></machine-toggle>
                        <machine-oscillator></machine-oscillator>
                        <machine-gain></machine-gain>
                        <machine-master></machine-master>
                    </element-workstation>
                </aside>
                <footer>
                    <a href="/sinewave/gain">Gain and Amplitude</a>
                    <a href="/oscillator/theremin">Theremin</a>
                </footer>
            </article>





`;

export default class TheOscillator extends HTMLElement {
    context;
    osc;
    gain;
    masterAnalyze;
    oscillatorElement;
    oscAnalyze;
    animationFrame

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.handleToggle = this.handleToggle.bind(this);
        this.draw = this.draw.bind(this);
    }

    connectedCallback() {
        this.shadowRoot.querySelector('machine-toggle').addEventListener('toggle', this.handleToggle);
        this.shadowRoot.querySelector('machine-oscillator').addEventListener('frequency-change', (event) => {
            this.osc && (this.osc.frequency.value = Number(event.detail));
        });
        this.shadowRoot.querySelector('machine-gain').addEventListener('amount-change', (event) => {
            this.gain && (this.gain.gain.value = Number(event.detail));
        });
    }

    disconnectedCallback() {
        cancelAnimationFrame(this.animationFrame);
        this.osc && this.osc.stop(this.context.currentTime);
    }

    handleToggle(event) {
        if(event.detail) {
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
            this.draw();

        } else {
            this.gain.gain.setValueAtTime(.5, this.context.currentTime);
            this.gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.05);
            this.osc.stop(this.context.currentTime + .05);
        }
    }

    draw() {
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

        this.animationFrame = requestAnimationFrame(this.draw);
    }
}

window.customElements.define('page-the-oscillator', TheOscillator);