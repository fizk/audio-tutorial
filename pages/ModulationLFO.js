import '../elements/Workstation.js';
import '../machines/Gain.js';
import '../machines/LFO.js';
import '../machines/Oscillator.js';
import '../machines/Master.js';
import '../machines/Keyboard.js';
import '../elements/Article.js';

export default class ModulationLFO extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .diagram {
                    background-color: var(--screen-background-color);
                    width: 50%;
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
                .diagram__text {
                    fill: var(--screen-line-color);
                    stroke: none;
                }
                .diagram__path--fill {
                    fill: var(--screen-line-color);
                    stroke-width: var(--screen-line-width);
                    stroke: none;
                }
            </style>
            <element-article>
                <h2 slot="header">LFO (low frequency oscillator)</h2>
                <p>
                    The first of these modulation units we will be looking at is the <strong>LFO</strong>,
                    or the Low Frequency Oscillator. It is composed out of a modulator and a gain.
                </p>
                <p>
                    The human ear has a hard time keeping track of changes that happen faster that 20 times
                    per second. After that we start to group them together. The LFO has therefor its modulator's
                    frequency domain of <code>[0, 20]</code>Hz
                </p>
                <p>
                    It has prevoipusly been stated that the domain of an Oscillator is <code>[-1, 1]</code>. For our
                    LFO to work (for readons we will see shortly), we need to do a little bit of pre-processing of
                    or Oscillator/modulator before it reaches the Gain, we need to shift the domain to
                    <code>[0, 1]</code>.
                </p>
                <p>
                    Let's wrapp this into a nice bundle and have a little play with it.
                </p>
                <svg viewBox="0 0 252 281" xmlns="http://www.w3.org/2000/svg" slot="aside" class="diagram">
                    <g fill="none" fill-rule="evenodd">
                        <path class="diagram__path" d="M29 31h197v71H29z" />
                        <path class="diagram__path" d="M158 67c3.3333-6.6667
                            6.6667-10 10-10 3.3333 0 6.6667 3.3333 10 10 3.3333
                            6.6667 6.6667 10 10 10 3.3333 0 6.6667-3.3333 10-10" />
                        <text class="diagram__text" transform="translate(27 29)">
                            <tspan x="21" y="43">Modulator</tspan>
                        </text>
                        <path class="diagram__path" d="M29 185h197v71H29z" />
                        <g transform="translate(150 213)">
                            <path d="M.5 8.5h20M36.5 8.5h20" class="diagram__path" />
                            <circle cx="28" cy="8" r="6" class="diagram__path" />
                        </g>
                        <text class="diagram__text" transform="translate(27 183)">
                            <tspan x="21" y="43">Gain</tspan>
                        </text>
                        <path class="diagram__path--fill" d="M122 101v59h10l-12 24-12-24h10v-59h4z" />
                        <text font-size="10" class="diagram__text">
                            <tspan x="150" y="90">0</tspan>
                        </text>
                        <text font-size="10" class="diagram__text">
                            <tspan x="197" y="90">20</tspan>
                        </text>
                        <text font-size="16" class="diagram__text">
                            <tspan x="140" y="143">[0, 1]</tspan>
                        </text>
                    </g>
                </svg>
                <a href="/modulation" slot="footer" rel="prev">Modulation</a>
                <a href="/modulation/am" slot="footer" rel="next">Amplitude modulation</a>
            </element-article>
        `;
    }
}

window.customElements.define('page-modulation-lfo', ModulationLFO);