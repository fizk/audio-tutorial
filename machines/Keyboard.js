const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: inline-block;
            padding: 1rem;
            background-color: #F0F4C3;
        }
        .whole-tone {
            fill: var(--whole-tone-fill-color, white);
            stroke: var(--whole-tone-stroke-color, #979797);
        }
        .half-tone {
            fill: var(--half-tone-color, black);
            stroke: var(--half-tone-stroke-color, none);
        }
    </style>
    <svg width="248px" height="65px" viewBox="0 0 248 65" xmlns="http://www.w3.org/2000/svg">
        <g id="Group" transform="translate(-1, 0)">
            <rect class="whole-tone" id="14" x="231.5" y="0.5" width="17" height="64"></rect>
            <rect class="whole-tone" id="12" x="214.5" y="0.5" width="16" height="64"></rect>
            <rect class="whole-tone" id="10" x="196.5" y="0.5" width="17" height="64"></rect>
            <rect class="whole-tone" id="8" x="178.5" y="0.5" width="17" height="64"></rect>
            <rect class="whole-tone" id="7" x="160.5" y="0.5" width="17" height="64"></rect>
            <rect class="whole-tone" id="5" x="143.5" y="0.5" width="16" height="64"></rect>
            <rect class="whole-tone" id="3" x="125.5" y="0.5" width="17" height="64"></rect>
            <rect class="whole-tone" id="2" x="107.5" y="0.5" width="17" height="64"></rect>
            <rect class="whole-tone" id="0" x="90.5" y="0.5" width="16" height="64"></rect>
            <rect class="whole-tone" id="-2"  x="72.5" y="0.5" width="17" height="64"></rect>
            <rect class="whole-tone" id="-4"  x="54.5" y="0.5" width="17" height="64"></rect>
            <rect class="whole-tone" id="-5"  x="36.5" y="0.5" width="17" height="64"></rect>
            <rect class="whole-tone" id="-7"  x="19.5" y="0.5" width="16" height="64"></rect>
            <rect class="whole-tone" id="-9"  x="2.5" y="0.5" width="16" height="64"></rect>
            <rect class="half-tone" id="13" x="225" y="0" width="13" height="43"></rect>
            <rect class="half-tone" id="11" x="207" y="0" width="13" height="43"></rect>
            <rect class="half-tone" id="9" x="189" y="0" width="14" height="43"></rect>
            <rect class="half-tone" id="6" x="154" y="0" width="13" height="43"></rect>
            <rect class="half-tone" id="4" x="136" y="0" width="14" height="43"></rect>
            <rect class="half-tone" id="1" x="101" y="0" width="13" height="43"></rect>
            <rect class="half-tone" id="-1"  x="83" y="0" width="13" height="43"></rect>
            <rect class="half-tone" id="-3"  x="65" y="0" width="14" height="43"></rect>
            <rect class="half-tone" id="-6"  x="30" y="0" width="13" height="43"></rect>
            <rect class="half-tone" id="-8"  x="12" y="0" width="13" height="43"></rect>
        </g>
    </svg>
`;

export default class Keyboard extends HTMLElement {
    isKeyDown = false;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.setupKeypad = this.setupKeypad.bind(this);
        this.teardownKeypad = this.teardownKeypad.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    static get observedAttributes() {
        return ['keys'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'keys':
                newValue === null ? this.teardownKeypad() : this.setupKeypad();
                break;
        }
    }

    connectedCallback() {
        if (this.hasAttribute('keys')) {
            this.setupKeypad();
        }

        Array.from(this.shadowRoot.querySelectorAll('rect')).forEach(item => {
            item.addEventListener('mousedown', this.onMouseDown);
            item.addEventListener('mouseup', this.onMouseUp);
        });
    }

    disconnectedCallback() {
        this.teardownKeypad();
    }

    onMouseDown(event) {
        this.dispatchEvent(new CustomEvent('start', {
            detail: this.transposeNote(Number(event.target.getAttribute('id'))),
        }));
    }

    onMouseUp() {
        this.dispatchEvent(new CustomEvent('stop', {
            detail: undefined
        }));
    }

    onKeyDown(event) {
        if (this.isKeyDown) {
            return;
        }

        if (event.metaKey || event.shiftKey || event.ctrlKey || event.altKey) {
            return;
        }

        const map = {
            'KeyZ':   -9,
            'KeyS':   -8,
            'KeyX':   -7,
            'KeyD':   -6,
            'KeyC':   -5,
            'KeyV':   -4,
            'KeyG':   -3,
            'KeyB':   -2,
            'KeyH':   -1,
            'KeyN':    0,
            'KeyJ':    1,
            'KeyM':    2,
            'KeyQ':    3,
            'Digit2':  4,
            'KeyW':    5,
            'Digit3':  6,
            'KeyE':    7,
            'KeyR':    8,
            'Digit5':  9,
            'KeyT':   10,
            'Digit6': 11,
            'KeyY':   12,
            'Digit7': 13,
            'KeyU':   14,
        }

        if (map[event.code] !== undefined) {
            event.preventDefault();
            this.dispatchEvent(new CustomEvent('start', {
                detail: this.transposeNote(map[event.code]),
            }));
            this.isKeyDown = true;
        }
    }

    onKeyUp(event) {
        this.isKeyDown = false;

        if (event.metaKey || event.shiftKey || event.ctrlKey || event.altKey) {
            return;
        }

        this.dispatchEvent(new CustomEvent('stop', {
            detail: undefined
        }));
    }

    transposeNote(noteOffset, baseFrequency = 440) {
        return baseFrequency * Math.pow(2, noteOffset / 12);
    }

    setupKeypad() {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    teardownKeypad() {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }
}

window.customElements.define('machine-keyboard', Keyboard);