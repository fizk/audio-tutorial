
const template = document.createElement('template');
template.innerHTML = `
    <button>On</button>
`;

export default class Toggle extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['toggle'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'toggle':
                this.shadowRoot.querySelector('button').innerHTML = newValue === 'off' ? 'On' : 'Off';
            break;
        }
    }

    connectedCallback() {
        this.shadowRoot.querySelector('button').addEventListener('click', event => {
            this.dispatchEvent(new CustomEvent('toggle', {
                detail: !(this.hasAttribute('toggle') && this.getAttribute('toggle') === 'on')
            }));
            this.setAttribute(
                'toggle',
                this.hasAttribute('toggle') && this.getAttribute('toggle') === 'on' ? 'off' : 'on'
            );
        });
    }

}

window.customElements.define('machine-toggle', Toggle);
