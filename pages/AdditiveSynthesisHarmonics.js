import '../elements/Article.js';
import '../pads/HarmonicSynth.js';

export default class AdditiveSynthesisHarmonics extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">Harmonics</h2>
                <p>
                    But how does this sound? Here are 9 harmonically related oscillators routed through a Gain before they go into the Master.
                    The harmonic relation goes 440Hz, 880Hz, 1320Hz, 1760Hz...
                    Have a play with the sliders which control the amplitude to produce different sound.
                    Additionally there are presets at the top to produce each of the significant wave-type.
                </p>
                <p>
                    Notice how the Master's frequency-scope now has many peeks depending on the wave-type you are producing.
                </p>
                <pad-harmonic-synth slot="aside"></pad-harmonic-synth>
                <a href="/additive-synthesis/builder" slot="footer" rel="prev">Wave Builder</a>
                <a href="/additive-synthesis/adsr" slot="footer" rel="next">ADSR</a>
            </element-article>
        `;
    }
}

window.customElements.define('page-additive-synthesis-harmonics', AdditiveSynthesisHarmonics);