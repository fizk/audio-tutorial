
const template = document.createElement('template');
template.innerHTML = `
    <h2>AdditiveSynthesisConclusion</h2>
    <p>
        Maybe the conclution to this is as we add more harmonies or overtones to our sound
        it becomes richer and more interesting. A sine wave on its own doesnt's have a lot of range
        but a lot of them in different frequencies and applitude can add a lot to a sound.
    </p>
    <p>
        This is so usefull and common, that many (almost all) of synthesisers will have the fundimental
        shapes (sine, square, saw, tri) already available to us as presets of sort. For the rest of this
        tutorial, our Oscillators will have a selector where you can select the different waveform.
        But is is good to know that they are just different combinations of different sinewaves.
    </p>
    <a href="/additive-synthesis/phasing">Inharmonicity</a>
    <a href="/subtractive-synthesis">Subtractive synthesis</a>
`;

export default class AdditiveSynthesisConclusion extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

window.customElements.define('page-additive-synthesis-conclusion', AdditiveSynthesisConclusion);