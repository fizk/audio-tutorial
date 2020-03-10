import '../elements/Article.js';
import '../pads/AdditiveAdsrSynth.js';

export default class AdditiveSynthesisADSR extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>

            </style>
            <element-article>
                <h2 slot="header">Additive synthesis and ADSR</h2>
                <p>
                    Where it becomes interesting is when we manitulate the amplitude of the harmonics over time. To accive this
                    we employee our trusty ADSR. We will set the attach and release time to zero. We will set our sustain level to
                    zero as well, but then we vary our decay time: least amount for the higest harmonic and then work our
                    way backwards, ending up with the most amount for the lowest harmonic.
                </p>
                <p>
                    We should see the amplitude role of from right to left as the tone sustains.
                </p>
                <p>
                    Let's try it out with a few different harmonics.
                </p>
                <pad-additive-adsr-synth slot="aside"></pad-additive-adsr-synth>
                <a href="/additive-synthesis/octaves" slot="footer" rel="prev">Octaves</a>
                <a href="/additive-synthesis/phasing" slot="footer" rel="next">Phasing</a>
            </element-article>
        `;
    }
}

window.customElements.define('page-additive-synthesis-adsr', AdditiveSynthesisADSR);