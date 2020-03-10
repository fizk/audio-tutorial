import '../elements/Article.js';

export default class AdditiveSynthesisConclusion extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">AdditiveSynthesisConclusion</h2>
                <p>
                    Maybe the conclution to this is as we add more harmonies or overtones to our sound
                    it becomes richer and more interesting. A sine wave on its own doesnt's have a lot of range
                    but a lot of them in different frequencies and applitude can add a lot to a sound.
                </p>
                <p>
                    This is so usefull and common, that many (almost all) of synthesisers will have the fundimental
                    shapes (sine, square, saw, tri) already available to us as presets of sort. For the rest of this
                    tutorial, our Oscillators will have a selector where you can select the different waveform.
                    But is is good to know that they are just different combinations of different sinewaves.
                </p>
                <ul slot="aside">
                    <li><a href="https://theproaudiofiles.com/what-is-additive-synthesis/" target="_blank">The Basics of Additive Synthesis</a></li>
                    <li><a href="http://teropa.info/blog/2016/09/20/additive-synthesis.html" target="_blank">source</a></li>
                    <li><a href="http://teropa.info/harmonics-explorer/" target="_blank">source</a></li>
                </ul>

                <a href="/additive-synthesis/phasing" slot="footer" rel="prev">Inharmonicity</a>
                <a href="/subtractive-synthesis" slot="footer" rel="next">Subtractive synthesis</a>
            </element-article>
        `;
    }
}

window.customElements.define('page-additive-synthesis-conclusion', AdditiveSynthesisConclusion);