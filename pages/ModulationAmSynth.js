import '../elements/Article.js';
import '../pads/AmplitudeSynth.js';

export default class ModulationAmSynth extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">AM Synth</h2>
                <p>
                    Building off of what we have discussed, let's build a patch.
                </p>
                <p>
                    First we have the Carrier. It is connected to a Gain which is in turn connected to the Master. The carrier is here
                    represented as a keyboard but it is just as the Oscillators we have seen previously. Each note on the keyboard is
                    assign a frequency in the "equal tempered scale" and when it is pressed, it will fire of an Oscillator with that frequency.
                </p>
                <p>
                    The keyboard is also connected to the Undefined unit. The frequency that is picked by the keyboard is therefor
                    also sent there. The Undefined unit has a <strong>index</strong> slider. It will determine the multiplication factor
                    applied to the Oscillator inside the Undefined unit. For example: if we on the keyboard, strike <strong>A<sub>4</sub></strong>,
                    which is 440Hz, and we have the index inside our Undefined unit set to <code>2</code>, the modulation frequency
                    will be 880Hz. So, the carrier is 440Hz, the modulator is 880Hz.
                </p>
                <p>
                    Next the Oscillator inside the Undefined unit will go through a pre-processor unit that will shift the domain to be
                    <code>[0, 1]</code>. After that, it will go to a Gain inside the Undefined unit. That Gain is controlled by the
                    <strong>amount</strong> slider. It will control how much of the amplitude modulation will be applied. For example: if the
                    amount is set to <code>0.5</code> the domain coming out of the Undefined unit will be <code>[0, 0.5]</code>, meaning
                    that half of the amplitude modulation will be applied to the final outcome.
                </p>
                <p>
                    Finally, the Undefined unit is connected to the Gain unit that is to be modulated.
                </p>
                <p> So, the note we strike is 440Hz, the Undefined's index is <code>2</code> and the amount is <code>0.5</code>
                    When a note is struck on the keyboard, the carrier will play the 440Hz note, but the Gain will
                    go from 0 to 0.5 to 0 again, 880 times per second.
                </p>
                <p>
                    One might think that the result would be an fast tremolo effect, but something else happens. We get an interesting
                    <a href="https://en.wikipedia.org/wiki/Timbre">timbre</a>.
                </p>
                <button data-preset-1 slot="aside">Preset 1</button>
                <button data-preset-2 slot="aside">Preset 2</button>
                <button data-preset-3 slot="aside">Preset 3</button>
                <pad-amplitude-synth slot="aside"></pad-amplitude-synth>
                <p slot="aside">
                    The reason this is happening, while not complicated, involves a little bit of math and a little
                    bit of theory <a href="https://www.soundonsound.com/techniques/amplitude-modulation"><sup>[1]</sup></a>.
                    For our purposes, it's sufficient to hear the impact amplitude modulation has.
                </p>
                <p slot="aside">
                    Have a play with the sliders, or try out the presets.
                </p>
                <a href="/modulation/undefined" slot="footer" rel="prev">undefined</a>
                <a href="/modulation/fm-synth" slot="footer" rel="next">FM Synth</a>
            </element-article>
        `;
    }

    connectedCallback () {
        this.shadowRoot.querySelector('[data-preset-1]').addEventListener('click', () => {
            const synthElement = this.shadowRoot.querySelector('pad-amplitude-synth');
            synthElement.setAttribute('index', '0.5');
            synthElement.setAttribute('amount', '0.5');
        });
        this.shadowRoot.querySelector('[data-preset-2]').addEventListener('click', () => {
            const synthElement = this.shadowRoot.querySelector('pad-amplitude-synth');
            synthElement.setAttribute('index', '4');
            synthElement.setAttribute('amount', '0.5');
        });
        this.shadowRoot.querySelector('[data-preset-3]').addEventListener('click', () => {
            const synthElement = this.shadowRoot.querySelector('pad-amplitude-synth');
            synthElement.setAttribute('index', '2.3');
            synthElement.setAttribute('amount', '1');
        });
    }
}

window.customElements.define('page-modulation-am-synth', ModulationAmSynth);