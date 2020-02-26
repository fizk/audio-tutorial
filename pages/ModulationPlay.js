import '../elements/Workstation.js';
import '../machines/Gain.js';
import '../symbols/Gain.js';
import '../machines/LFO.js';
import '../machines/Oscillator.js';
import '../machines/Master.js';
import '../machines/Keyboard.js';

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
                    <h2>Let's play it</h2>
                </header>
                <main>
                    <p>
                        To close of the exploration of the modulation synth, here is a s simple AM synth than you
                        can play either by clicking on the keyboard inside the workstation or use your computer's
                        keyboard.
                    </p>
                    <p>
                        Here we do thing a little differently. Rather than having ther LFO's rate controlled by us,
                        we connect it to the keyboard with a gain at 50% in between. What is going to happen is that
                        the amplitude modulation will to be half the rate as the note we are playing. This produces
                        some really interesting tones. So, if we play 440Hz, the carrier is still going to deliver that
                        note, but the amplitude modulation is going to happen at 220Hz.
                    </p>
                    <p>
                        The LFO is moving so fast that we can no longer hear the tremolo effect. instead we hear a change
                        in the tone's <a href="https://en.wikipedia.org/wiki/Timbre" target="_blank">timbre</a>.
                    </p>
                    <p>
                        Another thing to note is that you can still play with the amount of LFO happening. Just be mindful
                        that when the LFO's amount is set to <code>1</code>, it's will have a domain of <code>[0, 1]</code>.
                        The master Gain is going to add its value to the signal before it goes into the master. Master gain
                        at <code>0.5</code> and LFO amount at <code>1</code> will produce <code>1.5</code> which is more
                        than the <code>[-1, 1]</code> domain allowed before clipping accurs. For the best result, the Master Gain
                        and the LFO amount combined should not excede <code>1</code>.
                    </p>
                    <p>
                        Preset 1 is normal LFO amount. Preset 2 has no LFO effect, which in effect
                        just plays a un-modulated sine wave.
                    </p>
                </main>
                <aside>
                    <button data-preset-1>Preset 1</button>
                    <button data-preset-2>Preset 2</button>
                    <element-workstation data-worstation-play>
                        <machine-keyboard frequency="440" keys></machine-keyboard>
                        <symbol-gain amount="0.5"></symbol-gain>
                        <machine-lfo frequency="0" amount="0.5" min="0" max="1"></machine-lfo>
                        <machine-gain amount="0.5"></machine-gain>
                        <machine-master></machine-master>
                    </element-workstation>
                </aside>
                <footer>
                    <ul>
                        <li>
                            <a href="https://www.soundonsound.com/techniques/amplitude-modulation" target="_blank">soundonsound</a>
                        </li>
                    </ul>
                    <a href="/modulation/fm">FM Synth</a>
                    <a href="/envelope">Envelope</a>
                </footer>
            </article>
`;

export default class ModulationPlay extends HTMLElement {
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

        this.noteOn = this.noteOn.bind(this);
        this.noteOff = this.noteOff.bind(this);
        this.noteDraw = this.noteDraw.bind(this);

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const keyboardElement = this.shadowRoot.querySelector('machine-keyboard');
        keyboardElement.addEventListener('start', this.noteOn);
        keyboardElement.addEventListener('stop', this.noteOff);

        this.shadowRoot.querySelector('[data-preset-1]').addEventListener('click', () => {
            const lfoElement = this.shadowRoot.querySelector('machine-lfo');
            const gainElement = this.shadowRoot.querySelector('machine-gain');
            gainElement.setAttribute('amount', '0.2');
            lfoElement.setAttribute('amount', '0.8');
        });
        this.shadowRoot.querySelector('[data-preset-2]').addEventListener('click', () => {
            const lfoElement = this.shadowRoot.querySelector('machine-lfo');
            const gainElement = this.shadowRoot.querySelector('machine-gain');
            gainElement.setAttribute('amount', '0.5');
            lfoElement.setAttribute('amount', '0.0');
        });
    }

    disconnectedCallback() {
        this.carrier && this.carrier.stop(this.context.currentTime)
        this.modulator && this.modulator.stop(this.context.currentTime);
        cancelAnimationFrame(this.animationFrame);
    }

    noteDraw() {

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

        this.shadowRoot.querySelector('machine-lfo').frequencyData = amLFOMonitorDataArray;
        this.shadowRoot.querySelector('machine-master').frequencyData = amMasterMonitorDataArray;
        this.shadowRoot.querySelector('machine-master').byteData = amMasterMonitorByteArray;


        this.animationFrame = requestAnimationFrame(this.noteDraw);
    }

    noteOn(event) {
        const f = (mapping, length = 1024) => {
            const array = new Float32Array(length);
            for (let i = 0, len = length; i < len; i++) {
                // so that the number is between [0, 1]
                const normalized = (i / (len - 1)) * 2 - 1;
                array[i] = mapping(normalized, i);
            }
            return array;
        }

        // const carrierElement = this.shadowRoot.querySelector('[data-oscillator-am]');
        const lfoElement = this.shadowRoot.querySelector('machine-lfo');
        const gainElement = this.shadowRoot.querySelector('machine-gain');

        this.context = new AudioContext();

        this.masterMonitor = this.context.createAnalyser();
        this.lfoMonitor = this.context.createAnalyser();
        this.carrierMonitor = this.context.createAnalyser();
        const waveShaper = this.context.createWaveShaper();
        waveShaper.curve = f(x => (x + 1) / 2);
        waveShaper.oversample = '2x';

        this.carrier = this.context.createOscillator();
        this.carrier.frequency.value = Number(event.detail);
        this.modulator = this.context.createOscillator();
        this.modulator.frequency.value = Number(event.detail) / 2;
        lfoElement.setAttribute('frequency', (Number(event.detail) / 2).toFixed(2));

        this.mainGain = this.context.createGain();
        this.mainGain.gain.value = Number(gainElement.getAttribute('amount'));
        this.lfoGain = this.context.createGain();
        this.lfoGain.gain.value = Number(lfoElement.getAttribute('amount'));

        this.masterGain = this.context.createGain();

        this.modulator.connect(waveShaper)
        waveShaper.connect(this.lfoGain);
        this.lfoGain.connect(this.lfoMonitor);
        this.lfoMonitor.connect(this.mainGain.gain);

        this.carrier.connect(this.carrierMonitor)
        this.carrierMonitor.connect(this.mainGain);

        this.mainGain.connect(this.masterGain);
        this.masterGain.connect(this.masterMonitor)
        this.masterMonitor.connect(this.context.destination);

        this.masterGain.gain.value = 0;
        this.masterGain.gain.setValueAtTime(0, this.context.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(.8, this.context.currentTime + .01);
        this.carrier.start(this.context.currentTime)
        this.modulator.start(this.context.currentTime);

        cancelAnimationFrame(this.animationFrame);
        this.noteDraw();
    }

    noteOff() {

        this.masterGain && this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.context.currentTime);
        this.masterGain && this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.5);

        this.carrier && this.carrier.stop(this.context.currentTime + .5)
        this.modulator && this.modulator.stop(this.context.currentTime + .5);
        this.carrier = undefined;
        this.modulator = undefined;
    }
}

window.customElements.define('page-modulation-play', ModulationPlay);