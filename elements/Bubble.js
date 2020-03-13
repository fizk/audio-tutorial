export default class Bubble extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: absolute;
                    padding: 2rem;
                    background-color: orange;
                }
            </style>
            what the hell
            <slot>hello</slot>
        `;
    }
}

window.customElements.define('element-bubble', Bubble);