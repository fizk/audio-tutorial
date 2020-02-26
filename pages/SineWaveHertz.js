export default class SineWaveHertz extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .resolution--high {
                    --resolution: 2
                }
                .resolution--low {
                    --resolution: 2 10
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
                    <h2>Hertz (Hz)</h2>
                </header>
                <main>
                    <p>
                        The <strong>hertz</strong> (Hz) is defined as one cycle per second. We use this unit
                        of mesurment to messure how often (per second) the wave repeats itself. Or, how often
                        it goes <code>from 0 to +1 to 0 to -1 to 0</code> per second.
                    </p>
                    <p>
                        In the context of sound, we talk about <strong>frequency</strong> and say that
                        something has a hight or low frequency.
                    </p>
                </main>
                <aside>
                    <figure>
                        <sine-wave frequency="880"></sine-wave>
                        <figcaption>
                            Wave of 880Hz produces hight pitch sound, and is of hight frequency.
                        </figcaption>
                    </figure>
                    <figure>
                        <sine-wave frequency="220"></sine-wave>
                        <figcaption>
                            Wave of 220Hz produces low pitch sound, and is of low frequency.
                        </figcaption>
                    </figure>
                </aside>
            </article>



            <article>
                <header>
                    <h2>Sample Rate</h2>
                </header>
                <main>
                    <p>
                        A sine-wave's cyrcle can in theory have a infinit number of values.
                        The computer doesn't have a infinit amount of memory. It therefor will take
                        a sample of the state of the wave on a regular interval. This is called
                        <strong>sample-rate</strong>.
                    </p>
                    <p>
                        This is a balancing act, as we want to have the highest quality sound without
                        overloading the computer's memory, This value should typically be between
                        8,000 Hz and 96,000 Hz; the default will vary depending on the output device,
                        but the sample rate <strong>44,100 Hz</strong> is the most common.
                    </p>
                </main>
                <aside>
                    <figure>
                        <sine-wave class="resolution--high"></sine-wave>
                        <figcaption>
                            High sample rate will produce higher quality sound,
                            but will require more memory.
                        </figcaption>
                    </figure>
                    <figure>
                    <sine-wave class="resolution--low"></sine-wave>
                        <figcaption>
                            Low sample rate will produce lower quality sound,
                            but will require less memory.
                        </figcaption>
                    </figure>
                <aside>
                <footer>
                    <a href="/sinewave/basics-sine">Sequence of numbers</a>
                    <a href="/sinewave/gain">Gain and Amplitude</a>
                <footer>
            </article>
        `;
    }
}

window.customElements.define('page-sine-wave-hertz', SineWaveHertz);