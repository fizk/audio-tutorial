import '../elements/Article.js';

export default class ModulationEpilogue extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                @import "../styles/resources.css";
            </style>
            <element-article>
                <h2 slot="header">Modulation's Epilogue</h2>

                <h3 slot="aside">Resources</h3>
                <ol class="resources" slot="aside">
                    <li>
                        <a href="https://www.soundonsound.com/techniques/amplitude-modulation" target="_blank">soundonsound</a>
                    </li>
                </ol>

                <a href="/modulation/fm-synth" slot="footer" rel="prev">FM Synth</a>
                <a href="/additive-synthesis" slot="footer" rel="next">Additive Synthesis</a>
            </element-article>
        `;
    }
}

window.customElements.define('page-modulation-epilogue', ModulationEpilogue);