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
                    Have a play with the amplitude 9 oscilltors all wired to the master. Each oscillator's frequency
                    is the two times the previous one (440, 880, 1320, 1760). There are some presets there as well
                    where you can approximate square, sawtooth and triangular wave.
                </p>
                <pad-harmonic-synth slot="aside"></pad-harmonic-synth>
                <a href="/additive-synthesis/builder" slot="footer" rel="prev">Wave Builder</a>
                <a href="/additive-synthesis/octaves" slot="footer" rel="next">octaves</a>
            </element-article>
        `;
    }
}

window.customElements.define('page-additive-synthesis-harmonics', AdditiveSynthesisHarmonics);