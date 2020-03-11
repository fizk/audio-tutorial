import '../elements/Article.js';
import '../pads/AdditiveAdsrSynth.js';

export default class AdditiveSynthesisADSR extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">Additive synthesis and ADSR</h2>
                <p>
                    Where it becomes interesting is when we manipulate the amplitude of the harmonics over time. To active this
                    we employee our trusty ADSR.
                </p>
                <p>
					We will set the attach and release time to zero. We will set our sustain level to
                    zero as well, but then we vary our decay time: least amount for the highest harmonic and then work our
                    way backwards, ending up with the most amount for the lowest harmonic.
                </p>
                <p>
                    We should see the amplitude role off from right to left as the tone sustains.
                </p>
                <p>
                    Let's try it out with a few different harmonics.
                </p>
                <pad-additive-adsr-synth slot="aside"></pad-additive-adsr-synth>
                <a href="/additive-synthesis/harmonics" slot="footer" rel="prev">Harmonics</a>
                <a href="/additive-synthesis/epilogue" slot="footer" rel="next">Epilogue</a>
            </element-article>
        `;
    }
}

window.customElements.define('page-additive-synthesis-adsr', AdditiveSynthesisADSR);