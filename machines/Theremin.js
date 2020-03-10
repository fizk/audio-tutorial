const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: block;
        }
        div {
            width: 100%;
            height: 300px;
            position: relative;
            background-color: var(--theremin-background, black);
        }
        span {
            display: block;
            position: absolute;
            background-color: var(--theremin-object, white);
            height: 20px;
            width: 20px;
            border-radius: 50%;
            top: 50%;
            left: 50%;
        }
    </style>
    <div>
        <span></span>
    </div>
`;

export default class Theremin extends HTMLElement {
    isDown = false;
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    connectedCallback() {
        this.shadowRoot.querySelector('span').addEventListener('mousedown', this.handleMouseDown);
    }

    disconnectedCallback() {
        this.shadowRoot.querySelector('span').removeEventListener('mousedown', this.handleMouseDown);
        this.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseMove (event) {
        if (this.isDown) {
            event.preventDefault();

            const containerRect = this.shadowRoot.querySelector('div').getBoundingClientRect();
            const element = this.shadowRoot.querySelector('span');
            const y = (event.clientY - containerRect.y) - 10;
            const x = (event.clientX - containerRect.x) - 10;
            if (y < 0) return;
            if (y > containerRect.height) return;
            if (x < 0) return;
            if (x > containerRect.width) return;

            const frequency = 880 - ((y / containerRect.height) * 880);
            const amplitude = (x / containerRect.width) * 1;

            element.style.top = `${y}px`;
            element.style.left = `${x}px`;
            this.dispatchEvent(new CustomEvent('move', {
                detail: { frequency, amplitude }
            }));
        }
    }
    handleMouseDown (event) {
        event.preventDefault();

        this.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);

        this.isDown = true;
        const containerRect = this.shadowRoot.querySelector('div').getBoundingClientRect();
        const y = (event.clientY - containerRect.y) - 10;
        const x = (event.clientX - containerRect.x) - 10;

        const frequency = 880 - ((y / containerRect.height) * 880);
        const amplitude = (x / containerRect.width) * 1;

        this.dispatchEvent(new CustomEvent('start', {
            detail: { frequency, amplitude }
        }));
    }
    handleMouseUp (event) {
        event.preventDefault();
        this.isDown = false;


        this.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);

        this.dispatchEvent(new CustomEvent('stop', {
            detail: { frequency: 0, amplitude: 0 }
        }));
    }
}

window.customElements.define('machine-theremin', Theremin)