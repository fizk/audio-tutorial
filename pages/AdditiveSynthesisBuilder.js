import '../elements/Series.js';
import '../elements/Article.js';

export default class AdditiveSynthesisBuilder extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">Wave builder</h2>
                <h3>Sine</h3>
                <p>
                    fundimental frequency only
                </p>
                <h3>Sawtooth</h3>
                <p>
                    all harmonics with desending amplitude.
                    <code>amp := 1 / harmonic</code>
                </p>
                <h3>Square</h3>
                <p>
                    odd harmonics only with desending amplitude
                    <code>amp := (if odd) 1 / harmonic (else) 0</code>
                </p>
                <h3>Triangular</h3>
                <p>
                    odd harmonics only with desending amplitude squared
                    <code>amp := (if odd) 1 / harmonic<sup>2</sup> (else) 0</code>
                </p>

                <button data-preset-sine slot="aside">sine</button>
                <button data-preset-sawtooth slot="aside">sawtooth</button>
                <button data-preset-square slot="aside">square</button>
                <button data-preset-tri slot="aside">tri</button>
                <element-series slot="aside"></element-series>

                <a href="/additive-synthesis" rel="prev" slot="footer">Additive Synthesis</a>
                <a href="/additive-synthesis/harmonics" rel="next" slot="footer">Harmonics</a>
            </element-article>
        `;
    }

    connectedCallback() {
        const series = this.shadowRoot.querySelector('element-series');
        this.shadowRoot.querySelector('[data-preset-sine]').addEventListener('click', (event) => series.setAttribute('type', 'sine'));
        this.shadowRoot.querySelector('[data-preset-sawtooth]').addEventListener('click', () => series.setAttribute('type', 'saw'));
        this.shadowRoot.querySelector('[data-preset-square]').addEventListener('click', () => series.setAttribute('type', 'square'));
        this.shadowRoot.querySelector('[data-preset-tri]').addEventListener('click', () => series.setAttribute('type', 'tri'));
    }
}

window.customElements.define('page-additive-synthesis-builder', AdditiveSynthesisBuilder);