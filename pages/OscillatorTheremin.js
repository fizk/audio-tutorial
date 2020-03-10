import '../elements/Workstation.js';
import '../machines/Master.js';
import '../machines/Theremin.js';
import '../elements/Article.js';
import '../pads/Theremin.js'

export default class OscillatorTheremin extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --theremin-background: var(--screen-background-color);
                    --theremin-object: var(--screen-line-color);
                }
                blockquote {
                    font-style: italic;
                }
                figure {
                    float: left;
                    width: 50%;
                    margin: 1rem 2rem 1rem 0;
                }
                figure img {
                    width: 100%;
                    height: auto;
                }
                figcaption {
                    padding: 1rem;
                    font-size: 0.64rem;
                }
            </style>
            <element-article>
                <h2 slot="header">Theremin</h2>
                <figure>
                    <img src="https://www.createdigital.org.au/wp-content/uploads/2019/11/theremin-1140x783.jpg" width="257" height="176" />
                    <figcaption>
                    Alexandra Stepanoff playing the theremin on NBC Radio, 1930 (Wikimedia Commons)
                    </figcaption>
                </figure>

                <p>
                    Arguable one of the first electronic instrument was the
                    <strong>Theremin</strong>. At its core it
                    plays with the two controls we have been discussing: frequency and amplitude.
                </p>
                <blockquote>
                    The instrument's controlling section usually consists of two metal antennas that sense
                    the relative position of the thereminist's hands and control oscillators for frequency
                    with one hand, and amplitude (volume) with the other. The electric signals from the theremin
                    are amplified and sent to a loudspeaker.
                    <sup><a href="https://en.wikipedia.org/wiki/Theremin" target="_blank">[1]</a></sup>
                </blockquote>
                <p>
                    Grab the ball on the right and move it up and down for pitch and left and right
                    for volume.
                </p>

                <pad-theremin slot="aside"></pad-theremin>

                <a href="/oscillator" slot="footer" rel="prev">Oscillator</a>
                <a href="/oscillator/epilogue" slot="footer" rel="next">Epilogue</a>
            </element-article>
        `;
    }
}

window.customElements.define('page-oscillator-theremin', OscillatorTheremin);