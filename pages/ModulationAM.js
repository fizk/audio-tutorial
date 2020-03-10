import '../elements/Article.js';
import '../pads/AmplitudeModulation.js';

export default class ModulationAM extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">Amplitude modulation</h2>
                <p>
                    We need a Oscillator. This will be the <strong>Carrier</strong>,
                    the one that is playing the actual sound. We can change its pitch by changing its frequency.
                </p>
                <p>
                    The Carrier is connected to a Gain and then to the master.
                </p>
                <p>
                    Next an LFO is connected to the Gain. This LFO will modulate the Gain it is connected to.
                </p>
                <p>
                    Turn on the workstation and see what happens.
                    The LFO starts to open and close the Gain , in effect raising and lowering the
                    volume in accordance to the sine wave generated inside the LFO. The frequency of the LFO controls
                    how fast it goes from low volume to high volume. Lets therefor call it
                    <strong>rate</strong> rather that frequency cause we are more interested in the rate (how fast)
                    of it then the frequency. The LFO's amount controls how much the volume is raised or lowered.
                </p>
                <p>
                    The Gain we are modulating has a domain of <code>[0, 1]</code>. Zero meaning no sound and One meaning
                    full volume. This is the reason we pre-processed the Oscillator inside of the LFO to produce the same
                    domain. Now the Gain inside of the LFO can be changed to multiply the output by some <strong>amount</strong>.
                    If the amount is set to <code>0.5</code> the output domain will be:
                    <pre>[(0 * 0.5), (1 * 0.5)] = [0, 0.5]</pre>
                </p>
                <p>
                    Have a play with the sliders in the patch for difference sounds. There are also some presets at the top.
                    Preset 1, is a medium LFO effect.
                    In Preset 2, have a look at the correlation between the LFO frequency and the Master frequency. See
                    how the Master frequency pulses up and down in accordance with the LFO's sine wave.
                </p>
                <pad-amplitude-modulation slot="aside"></pad-amplitude-modulation>
                <a href="/modulation/lfo" slot="footer" rel="prev">LFO</a>
                <a href="/modulation/undefined" slot="footer" rel="next">undefined</a>
            </element-article>
        `;
    }
}

window.customElements.define('page-modulation-am', ModulationAM);