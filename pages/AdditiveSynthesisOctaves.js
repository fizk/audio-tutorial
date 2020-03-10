import '../elements/Workstation.js';
import '../elements/SineWave.js';
import '../machines/Master.js';
import '../machines/Keyboard.js';
import '../machines/Toggle.js';
import '../elements/Article.js';
import '../pads/OctaveSynth.js';

export default class AdditiveSynthesisOctaves extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">Octives</h2>
                <pad-octave-synth slot="aside"></pad-octave-synth>
                <a href="/additive-synthesis/harmonics" slot="footer" rel="prev">harmonics</a>
                <a href="/additive-synthesis/adsr" slot="footer" rel="next">ADSR</a>
            </element-article>
        `;
    }
}

window.customElements.define('page-additive-synthesis-octaves', AdditiveSynthesisOctaves);