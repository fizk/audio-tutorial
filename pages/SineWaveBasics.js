import "../elements/SineWave.js";
import "../elements/Circle.js";
import "../elements/Slider.js";

export default class SineWaveBasics extends HTMLElement {
    animationTime;
    i = 0;

    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
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
                    <h2>Sequence of numbers over time</h2>
                </header>
                <main>
                    <p>
                        The sine wave is a continuous wave with a domain of <code>[-1, 1]</code>, meaning that it will
                        go on forever producing numbers between -1 and 1 in a smooth continuous curve.
                    </p>
                    <p>
                        We can represent the wave visually by plotting it onto a graph. X-axis represents
                        time. The Y-axis represents the value of the wave.
                    </p>
                    <p>
                        We can increase or decrease the speed of the wave. Drag the slider on the right to see what
                        effect different speeds have on the shape of the curve.
                    </p>
                </main>
                <aside>
                    <element-circle data-motion-circle></element-circle>
                    <sine-wave data-motion-wave></sine-wave>
                    <input data-motion-range type="range" value="440" min="0" max="880" is="elements-slider" />
                </aside>
                <footer>
                    <ul>
                        <li><a href="https://en.wikipedia.org/wiki/Sine">Sine</a></li>
                    </ul>
                    <a href="/sinewave">The Sine wave</a>
                    <a href="/sinewave/hertz">Mesure the wave</a>
                </footer>
            </article>
        `;

        this.animation = this.animation.bind(this);
    }
    connectedCallback() {
        this.shadowRoot.querySelector('[data-motion-range]').addEventListener('input', (event) => {
            this.shadowRoot.querySelector('[data-motion-circle]').setAttribute('frequency', String(event.target.value));
            this.shadowRoot.querySelector('[data-motion-wave]').setAttribute('frequency', String(event.target.value));
        });

        this.animation();
    }

    disconnectedCallback() {
        cancelAnimationFrame(this.animationTime);
    }

    animation() {
        this.animationTime = requestAnimationFrame(this.animation);
        this.shadowRoot.querySelector('[data-motion-circle]').setAttribute('phase', this.i);
        this.shadowRoot.querySelector('[data-motion-wave]').setAttribute('phase', this.i);
        this.i++
    }
}

window.customElements.define('page-sine-wave-basics', SineWaveBasics);