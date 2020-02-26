import '../elements/SineCombination.js';
import '../elements/Workstation.js';
import '../elements/SineWave.js';
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
                    <h2>Inharmonicity</h2>
                </header>
                <main>
                    <p>
                        We can also mix together sinewaves that do not have mathametical signicant
                        frequency ratio.
                    </p>
                    <p>
                        In this example, we have two sinewave oscillators, both set to frequency 440Hz.
                        The first one is then detuned 50 cent down and the other 50 cent up. As you move
                        the slider, you increase or decrease this number. Slider with value <code>0</code>
                        will just play two sinewaves of 440Hz. Setting the slider to 100 will play two sinewave
                        osccilators whole tone apart
                    </p>
                </main>
                <aside>
                    <element-workstation data-example-1>
                        <machine-toggle data-toggle-example-1></machine-toggle>
                        <ul>
                            <li>
                                <input type="range" min="0" max="100" value="50" />
                                <output>50</output>
                            </li>
                        </ul>
                        <machine-master data-master-example-1 />
                    </element-workstation>
                </aside>
                <footer>
                    <a href="/additive-synthesis/adsr">adsr</a>
                    <a href="/additive-synthesis/conclusion">conclusion</a>
                </footer>
            </article>
`;
export default class AdditiveSynthesisPhasing extends HTMLElement {

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
        const outputElement = this.shadowRoot.querySelector('output');
        this.shadowRoot.querySelector('machine-toggle').addEventListener('toggle', this.toggleExampleOne);
        this.shadowRoot.querySelector('input').addEventListener('input', (event) => {
            if (this.masterMachines) {
                this.masterMachines[0].osc.detune.value = Number(event.target.value) * (-1);
                this.masterMachines[1].osc.detune.value = Number(event.target.value) * 1;
                outputElement.innerHTML = event.target.value;
            }
        });
    }

    disconnectedCallback() {
        cancelAnimationFrame(this.animationFrame);
        this.masterMachines && this.masterMachines.forEach(item => {
            item.osc.stop(this.masterContext.currentTime);
        });
    }

    toggleExampleOne(event) {
        const note = 440;

        if (event.detail) {
            this.masterContext = new AudioContext();
            this.masterMachines = [-50, 50].map((detune, i) => {
                const osc = this.masterContext.createOscillator();
                osc.frequency.value = note
                osc.detune.value = detune;
                const gain = this.masterContext.createGain();

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
            this.masterMachines = undefined;
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

window.customElements.define('page-additive-synthesis-phasing', AdditiveSynthesisPhasing);