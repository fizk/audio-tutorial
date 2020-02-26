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
                    <h2>Modulation</h2>
                </header>
                <main>
                    <p>
                        It is interesting to listen to a sine-wave on its own. It became more interesting
                        when we started playing with the frequency and amplitude. While we can do it by hand, as
                        we did in the previous example, it would be nice if we could automate it.
                        Turns out we can do that quite easilly.
                    </p>
                    <p>
                        As we have explored, the Gain module is controlled by numbers. Do we have anything
                        that can produce numbers automatically? Yes we do: the Oscillator. What if we could
                        have the oscillator control the Gain?
                    </p>
                </main>
                <aside></aside>
                <footer>
                    <a href="/oscillator/theremin">Theremin</a>
                    <a href="/modulation/lfo">LFO</a>
                </footer>
            </article>
`;

export default class Modulation extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

window.customElements.define('page-modulation', Modulation);