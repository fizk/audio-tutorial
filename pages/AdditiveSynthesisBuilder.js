import '../elements/Series.js';

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
            <h2>Wave builder</h2>
        </header>
        <main>
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
        </main>
        <aside>
            <button data-preset-sine>sine</button>
            <button data-preset-sawtooth>sawtooth</button>
            <button data-preset-square>square</button>
            <button data-preset-tri>tri</button>
            <element-series></element-series>
        </aside>
        <footer>
            <ul>
                <li><a href="https://theproaudiofiles.com/what-is-additive-synthesis/" target="_blank">The Basics of Additive Synthesis</a></li>
                <li><a href="http://teropa.info/blog/2016/09/20/additive-synthesis.html" target="_blank">source</a></li>
                <li><a href="http://teropa.info/harmonics-explorer/" target="_blank">source</a></li>
            </ul>
            <a href="/additive-synthesis">Additive Synthesis</a>
            <a href="/additive-synthesis/harmonics">Harmonics</a>
        </footer>
    </article>
`;
export default class AdditiveSynthesisBuilder extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
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