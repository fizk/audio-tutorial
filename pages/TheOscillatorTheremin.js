const template = document.createElement('template');
template.innerHTML = `
        <h2>Theremin</h2>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Etherwave_Theremin_Kit.jpg/500px-Etherwave_Theremin_Kit.jpg" />
        <a href="https://en.wikipedia.org/wiki/Theremin">wikipedia</a>
        <a href="/oscillator">The Oscillator</a>
        <a href="/modulation">Modulation</a>
`;

export default class TheOscillatorTheremin extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

window.customElements.define('page-the-oscillator-theremin', TheOscillatorTheremin);