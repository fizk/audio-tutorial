import "../elements/SineWaveSequence.js";
import '../elements/Article.js';

export default class WaveNumberSequence extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                @import "../styles/figure.css";

                input {
                    vertical-align: middle;
                }
                span {
                    padding: 0 0.8rem;
                }
                element-sine-wave-sequence {
                    width: 100%;
                    height: auto;
                }
            </style>
            <element-article>
                <h2 slot="header">Sequence of numbers</h2>
                <p>
                    The <strong>sine</strong> wave is a continuous wave with a domain of <code>[-1, 1]</code>, meaning that it will
                    go on forever producing numbers between <code>-1</code> and <code>1</code> in a smooth continuous curve
                    <a href="https://www.mathopenref.com/triggraphsine.html" target="_blank"><sup>[1]</sup></a>.
                </p>
                <p>
                    In the <em>Unit circle</em>, starting at 0° it will have the value of <code>0</code>. Going counter clockwise, at 90° it
                    will have reach the value of <code>+1</code>. Continuing onward, at 180° the value is back at <code>0</code>. Finally at 270°
                    the value will be <code>-1</code> before it reaches it initial point of 0° with a value of <code>0</code>. This will then
                    repeat for as long as we want it to.
                </p>
                <p>
                    Plotting it onto a graph, <em>X-axis</em> represents time and the <em>Y-axis</em> represents the value, we can see that it draws out
                    a smooth continuous curve.
                </p>
                <p slot="aside">
                    Speaking of time. The trip around the unit circle can be slow or fast. Have a play with the slider to see how time can influence the
                    the shape of the curve.
                </p>
                <figure slot="aside">
                    <element-sine-wave-sequence phase="0"></element-sine-wave-sequence>
                    <figcaption>
                        <span>slow</span>
                        <input data-motion-range type="range" value="440" min="1" max="880" slot="aside" />
                        <span>fast</span>
                    </figcaption>
                </figure>
                <p slot="aside">
                    While only the values -1, 0 and 1 have been mentioned, there are infinite real numbers in between. For example: at 45° the Y-value will be
                    <code>0.7071066656470943</code>. At 120°, the value will be <code>0.8660229549706501</code>, to name just a few.
                </p>


                <a href="/wave" rel="prev" slot="footer">Wave</a>
                <a href="/wave/measure-the-wave" rel="next" slot="footer">Measure the wave</a>
            </element-article>
        `;
    }

    connectedCallback() {
        const rangeElement = this.shadowRoot.querySelector('[data-motion-range]');
        const sineWaveSequence = this.shadowRoot.querySelector('element-sine-wave-sequence');

        rangeElement.addEventListener('input', (event) => sineWaveSequence.setAttribute('frequency', event.target.value));
    }
}

window.customElements.define('page-wave-number-sequence', WaveNumberSequence);