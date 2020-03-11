import '../elements/Article.js';

export default class AdditiveSynthesisEpilogue extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                @import "../styles/resources.css";
            </style>
            <element-article>
                <h2 slot="header">Additive Synthesis Epilogue</h2>
                <p>
                    Maybe the conclution to this is as we add more harmonies or overtones to our sound
                    it becomes richer and more interesting. A sine wave on its own doesnt's have a lot of range
                    but a lot of them in different frequencies and applitude can add a lot to a sound.
                </p>
                <p>
                    This is so usefull and common, that many (almost all) of synthesisers will have the fundimental
                    shapes (sine, square, saw, tri) already available to us as presets of sort. For the rest of this
                    tutorial, our Oscillators will have a selector where you can select the different waveform.
                    But is is good to know that they are just different combinations of sine-waves.
                </p>
                <ol class="resources" slot="aside">
                    <li>
                        <a href="https://www.math24.net/fourier-series-definition-typical-examples/" target="_blank">Definition of Fourier Series</a>
                    </li>
                    <li>
                        <a href="http://teropa.info/harmonics-explorer/" target="_blank">Harmonics explorer</a>
                    </li>
                </ol>

                <a href="/additive-synthesis/adsr" slot="footer" rel="prev">ADRS</a>
                <a href="/subtractive-synthesis" slot="footer" rel="next">Subtractive synthesis</a>
            </element-article>
        `;
    }
}

window.customElements.define('page-additive-synthesis-epilogue', AdditiveSynthesisEpilogue);