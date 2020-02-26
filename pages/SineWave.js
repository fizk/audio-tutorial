export default class SineWave extends HTMLElement {
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
                    <h2>The Sine Wave</h2>
                </header>
                <main>
                    <p>
                        In physics, sound is a <strong>vibration</strong> that propagates as an
                        acoustic wave, through a transmission medium such as a gas, liquid or solid.
                    </p>
                    <p>
                        In computers, we generate this vibration by feeding the soundcard with a
                        mathematical curve that describes a <strong>smooth periodic oscillation</strong>.
                    </p>
                    <p>
                        The periodic curve is prodused by the <strong>sine wave</strong> or
                        <strong>sinusoid</strong>.
                    </p>
                </main>
                <aside>
                </aside>
                <footer>
                    <ul>
                        <li><a href="https://en.wikipedia.org/wiki/Sound">Sound</a></li>
                    </ul>
                    <a href="/">Home</a>
                    <a href="/sinewave/basics-sine">Sequence of numbers</a>
                </footer>
            </article>
        `;
    }
}

window.customElements.define('page-sine-wave', SineWave);