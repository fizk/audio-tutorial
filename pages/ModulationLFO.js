import '../elements/Workstation.js';
import '../machines/Gain.js';
import '../machines/LFO.js';
import '../machines/Oscillator.js';
import '../machines/Master.js';
import '../machines/Keyboard.js';

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
                    <h2>LFO (low frequency oscillator)</h2>
                </header>
                <main>
                    <p>
                        A module called <strong>LFO</strong> does just that. There are just two caviets.
                    </p>
                    <p>
                        If we have a oscillator set at 440Hz to change the volume of an oscillator, it would move so fast
                        that we wouldn't hear a difference. It only becomes interesting when the frequency is
                        capped between 0Hz and 20Hz. That's is where the <strong>L</strong> in the LFO comes
                        from: LOW frequency.
                    </p>
                    <p>
                        Remember that a oscillator produces numbers between -1 and 1. If we move the volume
                        knob up and down only by two units, the change is doing to be so small that we will not
                        hear the difference. I will need a Gain module to amplify the signal coming from the
                        oscillator.
                    </p>
                    <p>
                        Lets take an oscillator module with its frequency range capped between 0 and 20 and
                        connect it to a Gain module. Let's wrapp that all together in a new module called LFO
                    </p>
                    <p>
                        Let's change the labeling a little as well. Rather than saying that the LFO has a frequency
                        slider (the one that is changing the frequency of the oscillator), let's change it to
                        <strong>rate</strong>, since we are more interested in the speed (or rate) of the oscillator,
                        rather than its frequency.
                    </p>
                </main>
                <aside>
                    <svg width="283px" height="312px" viewBox="0 0 283 312" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <rect id="path-1" x="75" y="183" width="283" height="304" rx="16"></rect>
                            <filter x="-0.7%" y="-0.7%" width="101.4%" height="101.3%" filterUnits="objectBoundingBox" id="filter-2">
                                <feGaussianBlur stdDeviation="1.5" in="SourceAlpha" result="shadowBlurInner1"></feGaussianBlur>
                                <feOffset dx="0" dy="1" in="shadowBlurInner1" result="shadowOffsetInner1"></feOffset>
                                <feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite>
                                <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowInnerInner1"></feColorMatrix>
                            </filter>
                        </defs>
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Desktop" transform="translate(-75.000000, -183.000000)">
                                <g id="Rectangle">
                                    <use fill="#E8E8E8" fill-rule="evenodd" xlink:href="#path-1"></use>
                                    <use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use>
                                </g>
                                <rect id="Rectangle" fill="#F08DAE" x="133" y="244" width="154" height="181"></rect>
                                <line x1="209.5" y1="330.5" x2="209.5" y2="368.5" id="Line" stroke="#979797" stroke-width="2" fill="#D8D8D8" stroke-linecap="square"></line>
                                <line x1="209" y1="407" x2="209.5" y2="445.5" id="Line" stroke="#979797" stroke-width="2" fill="#D8D8D8" stroke-linecap="square"></line>
                                <rect id="Rectangle" fill="#FAA88E" x="155" y="363" width="108" height="44"></rect>
                                <rect id="Rectangle" fill="#1CE0B0" x="155" y="286" width="108" height="44"></rect>
                                <text id="Oscillator" font-size="16" font-weight="normal" fill="#4A4A4A">
                                    <tspan x="161" y="307">Oscillator</tspan>
                                </text>
                                <text id="LFO" font-size="16" font-weight="normal" fill="#4A4A4A">
                                    <tspan x="143" y="267">LFO</tspan>
                                </text>
                                <text id="Gain" font-size="16" font-weight="normal" fill="#4A4A4A">
                                    <tspan x="161" y="382">Gain</tspan>
                                </text>
                            </g>
                        </g>
                    </svg>
                </aside>
                <footer>
                    <a href="/modulation">Modulation</a>
                    <a href="/modulation/am">AM synth</a>
                </footer>
            </article>
`;

export default class ModulationLFO extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

window.customElements.define('page-modulation-lfo', ModulationLFO);