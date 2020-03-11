import '../machines/Master.js';
import '../elements/Article.js';

export default class WaveEpilogue extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                @import "../styles/resources.css";
            </style>
            <element-article>
                <h2 slot="header">Wave's Epilogue</h2>
                <p>
                    In this first section, we have seen the wave.
                    It got stretched left and right to produce different frequencies. It also got
                	stretched up and down with the help of the Gain unit to increasing or decreasing its
                	amplitude
                </p>
                <p>
                    In an analogue synthesizer, the <strong>Gain</strong> is implemented with a
                    <strong>V</strong>oltage <strong>C</strong>ontrolled <strong>A</strong>mplifier (VCA)
                    <a href="http://synthesizeracademy.com/voltage-controlled-amplifier-vca/" target="_blank"><sup>[3]</sup></a>,
                    a three-terminal device
            		that takes in a source and a control voltage. It then returns through its output
            		terminal, the a modified voltage. The principal remain the same for both
            		implementations: an input, an output and a modifier.
                </p>
                <p>
                	Through out his series, this device will be refereed to as <strong>The Gain</strong>
                	and the modifier's value will be <strong>the amount</strong>.
                </p>
                <p>
                    Now that we have some control over the wave, we can start looking at practical applications
                    for it. In the next section, we will log at the Oscillator.
                </p>

                <h4 slot="aside">Resources</h4>
                <ol slot="aside" class="resources">
                    <li>
                        <a href="https://www.mathopenref.com/triggraphsine.html" target="_blank">Graph of the sine (sin) function</a>.
                    </li>
                    <li>
                        <a href="https://pages.mtu.edu/~suits/scales.html">Scales: Just vs Equal Temperament</a>
                    </li>
                    <li>
                        <a href="http://synthesizeracademy.com/voltage-controlled-amplifier-vca/" target="_blank">Voltage-Controlled Amplifier (VCA)</a>
                    </li>
                </ol>

                <a href="/wave/gain-and-amplitude" slot="footer" rel="prev">Gain and Amplitude</a>
                <a href="/oscillator" slot="footer" rel="next">Oscillator</a>
            </element-article>
        `;
    }
}

window.customElements.define('page-wave-epilogue', WaveEpilogue);

// import '../machines/Master.js';
// import clippingWorklet from '../worklets/ClippingWorklet.js';
// import gainToAudioWorklet from '../worklets/GainToAudioWorklet.js';

// const template = document.createElement('template');
// template.innerHTML = `
//     <article>
//         <header>
//             <h2>SineWaveConclusion</h2>
//         </header>
//         <main>
//             <input type="range" min="0" max="2" value="0.5" step="0.1" />
//         </main>
//         <aside>
//             <machine-master></machine-master>
//         </aside>
//         <footer>
//             <a href="/sinewave/gain" class="next-button">Gain and Amplitude</a>
//             <a href="/oscillator" class="next-button">The Oscillator</a>
//         </footer>
//     </article>
// `;

// export default class SineWaveConclusion extends HTMLElement {
//     timeout;
//     constructor() {
//         super();

//         this.attachShadow({ mode: 'open' });
//         this.shadowRoot.appendChild(template.content.cloneNode(true));

//         this.animate = this.animate.bind(this);
//     }

//     connectedCallback () {


//         this.addEventListener('click', () => {
//             const audioContext = new AudioContext();


//             this.shadowRoot.querySelector('input').addEventListener('input', (event) => {
//                 gain.gain.value = event.target.value;
//             });

//             Promise.all([
//                 clippingWorklet(audioContext),
//                 gainToAudioWorklet(audioContext),
//             ]).then(([clipping, gainToAudio]) => {


//                 const clippingNode = new AudioWorkletNode(audioContext, clipping);
//                 const gainToAudioNode = new AudioWorkletNode(audioContext, gainToAudio);
//                 const carrier = new OscillatorNode(audioContext);
//                 carrier.frequency.value = 220;
//                 const carrierGain = new GainNode(audioContext);
//                 this.masterMonitor = new AnalyserNode(audioContext);
//                 carrierGain.gain.value = .25;
//                 const gain = new GainNode(audioContext);
//                 // gain.gain.value = .5;

//                 const modulator = new OscillatorNode(audioContext);
//                 modulator.frequency.value = .5;

//                 modulator
//                     .connect(gainToAudioNode)
//                     // .connect(this.masterMonitor)
//                     .connect(gain.gain);
//                 // gain.connect(clippingNode);

//                 carrier.connect(gain)
//                     // .connect(gainToAudioNode)

//                     .connect(carrierGain)
//                     .connect(clippingNode)
//                     .connect(this.masterMonitor)
//                     .connect(audioContext.destination);



//                 carrier.start();
//                 modulator.start();

//                 clippingNode.port.onmessage = (e) => {

//                     clearTimeout(this.timeout);
//                     this.timeout = setTimeout(() => {
//                         this.shadowRoot.querySelector('h2').style.backgroundColor = 'transparent';
//                     }, 10);
//                     this.shadowRoot.querySelector('h2').style.backgroundColor = 'red';
//                 };
//                 this.animate();

//             });


//         });

//     }

//     animate() {

//         // master monitor
//         this.masterMonitor.fftSize = 2048;
//         const amMasterMonitorDataArray = new Uint8Array(this.masterMonitor.frequencyBinCount);
//         this.masterMonitor.getByteTimeDomainData(amMasterMonitorDataArray);

//         this.masterMonitor.fftSize = 512;
//         this.masterMonitor.minDecibels = -140;
//         this.masterMonitor.maxDecibels = 0;
//         const amMasterMonitorByteArray = new Uint8Array(this.masterMonitor.frequencyBinCount);
//         this.masterMonitor.getByteFrequencyData(amMasterMonitorByteArray);

//         // // lfo monitor
//         // this.lfoMonitor.fftSize = 2048;
//         // const amLFOMonitorDataArray = new Uint8Array(this.lfoMonitor.frequencyBinCount);
//         // this.lfoMonitor.getByteTimeDomainData(amLFOMonitorDataArray);

//         // // oscillator monitor
//         // this.carrierMonitor.fftSize = 2048;
//         // const amCarrierMonitorDataArray = new Uint8Array(this.carrierMonitor.frequencyBinCount);
//         // this.carrierMonitor.getByteTimeDomainData(amCarrierMonitorDataArray);

//         // const lfoElement = this.shadowRoot.querySelector('machine-lfo');
//         // const oscElement = this.shadowRoot.querySelector('machine-oscillator');
//         const masterElement = this.shadowRoot.querySelector('machine-master');

//         // lfoElement.frequencyData = amLFOMonitorDataArray;
//         // oscElement.frequencyData = amCarrierMonitorDataArray;
//         masterElement.frequencyData = amMasterMonitorDataArray;
//         masterElement.byteData = amMasterMonitorByteArray;

//         this.animationFrame = requestAnimationFrame(this.animate);
//     }
// }

// window.customElements.define('page-sine-wave-conclusion', SineWaveConclusion);