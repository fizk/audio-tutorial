import '../elements/Article.js';
import '../pads/EnvelopeSynth.js'


export default class EnvelopeAdsr extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">Control the gain</h2>
                <p>
                    Here we put the ADSR to a good use. We will connect it to a Gain and used it to control the volume
                    of a sine-wave over time.
                </p>
                <p>
                    Have a play with the sliders of the Envelope for different effect. There are also some presets at the
                    top.
                </p>
                <p>
                    Use can use either the keys on your computer keyboard or click the little keys on the mini-keyboard in
                    the workstation to produce different notes. Hold in the note or key to see the full lifecycle of the ADSR
                </p>

                <pad-envelope-synth slot="aside"></pad-envelope-synth>

                <a href="/envelope" slot="footer" rel="prev">Envelope</a>
                <a href="/envelope/epilogue" slot="footer" rel="next">Epilogue</a>
            </element-article>
        `;
    }
}

window.customElements.define('page-envelope-adsr', EnvelopeAdsr);