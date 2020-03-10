import '../pads/EnvelopeFrequency.js';
import '../elements/Article.js';

// function lerp(min, max, fraction) {  return (max — min) * fraction + min;}

export default class EnvelopeFrequency extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .diagram {
                    background-color: var(--screen-background-color);
                }
                .diagram__selection {
                    fill: var(--screen-selection);
                    stroke: none;
                }
                .diagram__path {
                    fill: none;
                    stroke-width: var(--screen-line-width);
                    stroke: var(--screen-line-color);
                }

                figure {
                    margin: 0
                }
                figcaption {
                    padding: 1rem 0;
                    font-size: 0.8rem;
                }
            </style>
            <element-article>
                <h2 slot="header">Envelope</h2>
                <p>
                    To have greater control over our sound we can use an <strong>Envelope</strong>.
                    It is similar to a <strong>Gain</strong> in the sense that is will take a signal
                    in and send an modified version our. Where it differs it that the Envelope will
                    do its modification over time and we program it before hand.
                </p>
                <p>
                    So rather than having one number factor to control like the Gain has. The Envelope
                    will have many that are applied one after the other through the lifetime of the
                    Envelope.
                </p>
                <p>
                    This can have may practical applications. One is to control gain/volume. Another one
                    would be to open and close filters as we will se later.
                </p>
                <p>
                    Lets use an ADSR Envelope to control pitch. It demonstrates well the lifecicle of the Envelope.
                </p>
                <p>
                    Press the Spacebar and hold it in to see in <strong>ADS</strong> part,
                    release it to se the <strong>R</strong> part.
                </p>
                <p>
                    Change the sliders to see how different configuration will produce different effects.
                </p>

                <pad-envelope-frequency></pad-envelope-frequency>

                <h3 slot="aside">Envelope ADSR</h2>
                <p slot="aside">
                    The most use type if Evelope is the <strong>ADSR</strong>
                </p>
                <h3 slot="aside">A is for attach</h3>
                <figure slot="aside">
                    <svg class="diagram" viewBox="0 0 403 105" xmlns="http://www.w3.org/2000/svg">
                        <path class="diagram__selection" d="M52 53l50-50v100H2z"/>
                        <path class="diagram__path" d="M2 103L102 3l100 50h100l100 50"/>
                    </svg>
                    <figcaption>
                        The attach controlls how long it takes for the Envelope to reach its maximmum amplitude.
                    </figcaption>
                </figure slot="aside">
                <h3 slot="aside">D is for decay</h3>
                <figure slot="aside">
                    <svg class="diagram" viewBox="0 0 403 105" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" fill-rule="evenodd">
                            <path class="diagram__selection" d="M102 3l100 50v50H102z"/>
                            <path class="diagram__path" d="M2 103L102 3l100 50h100l100 50"/>
                        </g>
                    </svg>
                    <figcaption>
                        Once the attach has reach it's maximum amplitude, the decay will take over and control
                        how long its takes for the Envelope to reach its target or desireable amplitude.
                    </figcaption>
                </figure>
                <h3 slot="aside">S is for sustain</h3>
                <figure slot="aside">
                    <svg class="diagram" viewBox="0 0 403 105" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" fill-rule="evenodd">
                            <path class="diagram__selection" d="M202 53h100v50H202z"/>
                            <path class="diagram__path" d="M2 103L102 3l100 50h100l100 50"/>
                        </g>
                    </svg>
                    <figcaption>
                        The sustain is the derieable amplitude, and it will sustain that amplitude until it is
                        released.
                    </figcaption>
                </figure>
                <h3 slot="aside">R is for release</h3>
                <figure slot="aside">
                    <svg class="diagram" viewBox="0 0 403 105" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" fill-rule="evenodd">
                            <path class="diagram__selection" d="M302 53l58.627 29.7832L402 103H302z"/>
                            <path class="diagram__path" d="M2 103L102 3l100 50h100l100 50"/>
                        </g>
                    </svg>
                    <figcaption>
                        Finally, the release will control long it will take for the Envelope to go to its
                        minimum amplitude.
                    </figcaption>
                </figure>

                <a href="/oscillator/epilogue" slot="footer" rel="prev">Oscillator's Epilogue</a>
                <a href="/envelope/adsr" slot="footer" rel="next">ADSR</a>
            </element-article>
        `;
    }
}

window.customElements.define('pad-envelope-frequency', EnvelopeFrequency);