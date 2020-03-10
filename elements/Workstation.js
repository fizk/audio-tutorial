
const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: block;
            background-color: #e8e8e8;
            box-shadow: inset 0 0 8px -2px rgba(0,0,0,.3);
            border-radius: 1rem;
        }

        div {
            padding: 1rem;
            position: relative;
        }
    </style>

    <div>
        <slot></slot>
    </div>
`;

export default class Workstation extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

window.customElements.define('element-workstation', Workstation);
