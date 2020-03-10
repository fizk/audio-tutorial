import '../elements/Article.js';
import '../pads/OscillatorOne.js'

export default class Oscillator extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">The Oscillator</h2>
                <p>
                    The <strong>Oscillator</strong> is an object that can generate a sequence of
                    numbers over time. It will be our sine wave generator. The names comes from
                    the fact that it oscillates from one number to the other.
                </p>
                <p>
                    We have seen previously how to manipulate the <strong>frequency</strong> of a sine
                    wave and said that it controlls the <strong>pich</strong>. We have also seen how
                    we can route the output of a sine wave generator into a <strong>gain</strong> to
                    control the <strong>volume</strong>.
                </p>
                <p>
                    Turn on the workstation to the right and play with the sliders,
                    producing different piches and amplitudes. Monitor how the final wave is outputted through
                    the <strong>Master</strong> which represents the final output.
                </p>

                <pad-oscillator-one slot="aside"></pad-oscillator-one>

                <a href="/wave/epilogue" slot="footer" rel="prev">Wave's Epilogue</a>
                <a href="/oscillator/theremin" slot="footer" rel="next">Theremin</a>
            </element-article>
        `;
    }
}

window.customElements.define('page-oscillator', Oscillator);