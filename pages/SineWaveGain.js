import '../elements/SineWave.js';
import '../elements/Workstation.js';
import '../machines/Gain.js';

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
                        "aside main"
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
                    <h2>Gain and Amplitude</h2>
                </header>
                <aside>
                    <element-workstation>
                        <sine-wave frequency="440" amplitude="20"></sine-wave>
                        <machine-gain min="0" max="2" amount="1"></machine-gain>
                        <sine-wave data-sine frequency="440" amplitude="20"></sine-wave>
                    </element-workstation>
                </aside>
                <main>
                    <p>
                        Sometimes we need to manipulate the wave's maximum and minimum amout.
                        Rather that having the wave's domain to be <code>[-1, 1]</code>, we want it to
                        be <code>[-0.5, 0.5]</code>.
                    </p>
                    <p>
                        For this we have the <strong>Gain</strong> function. It's a little module that
                        takes as its input, a source. It then multiplies it with some factor
                        <strong>amount</strong> before it returns the result through its output.
                    </p>
                    <p>
                        An amount of <code>1</code> will not change the input. Amount of <code>0.5</code>
                        will half the wave, while an amount of <code>2</code> will double it.
                    </p>
                    <p>
                        Simplest usecase for it is to increase or decrease volume or amplitude.
                    </p>
                    <p>
                        Change the Gain's amount with the slider and see the effect on the output wave.
                    </p>
                </main>
                <footer>
                    <a href="/sinewave/hertz">Mesure the wave</a>
                    <a href="/oscillator">The Oscillator</a>
                </footer>
            </article>
`;

export default class SineWaveGain extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('machine-gain').addEventListener('amount-change', (event) => {
            console.log(event.detail);
            this.shadowRoot.querySelector('[data-sine]').setAttribute('amplitude', Number(event.detail) * 20);
        });
    }
}

window.customElements.define('page-sine-wave-gain', SineWaveGain);