const template = document.createElement('template');
template.innerHTML = `
    <button>[Space key]</button>
`;

export default class Trigger extends HTMLElement {
    isPressed = false;

    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    connectedCallback() {
        const button = this.shadowRoot.querySelector('button');

        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        button.addEventListener('mousedown', this.handleMouseDown);
        button.addEventListener('mouseup', this.handleMouseUp);
    }

    disconnectedCallback() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    handleMouseDown(event) {
        this.dispatchEvent(new CustomEvent('start'));
    }

    handleMouseUp(event) {
        this.dispatchEvent(new CustomEvent('stop'));
    }

    handleKeyDown(event) {
        if (event.code === 'Space') {
            event.preventDefault();
            if (this.isPressed) {
                return;
            }
            this.isPressed = true;
            this.dispatchEvent(new CustomEvent('start'));
        }
    }

    handleKeyUp() {
        if (this.isPressed) {
            this.isPressed = false;
            this.dispatchEvent(new CustomEvent('stop'));
        }
    }
}

window.customElements.define('machine-trigger', Trigger);