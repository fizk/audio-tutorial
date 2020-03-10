import '../elements/Article.js'

export default class ModulationUndefined extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">Undefined</h2>
                <p>main</p>
                <p slot="aside">aside</p>

                <a href="/modulation/am" rel="prev" slot="footer">Amplitude modulation</a>
                <a href="/modulation/am-synth" rel="next" slot="footer">AM Synth</a>
            </element-article>
        `;
    }
}

window.customElements.define('page-modulation-undefined', ModulationUndefined);