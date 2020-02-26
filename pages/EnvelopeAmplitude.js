import '../elements/Envelope.js';
import '../machines/Keyboard.js';
import '../elements/EnvelopeControlls.js';
import '../elements/Workstation.js';
import '../machines/ADSR.js';

// function lerp(min, max, fraction) {  return (max — min) * fraction + min;}

const template = document.createElement('template');
template.innerHTML = `
    <h2>Control the gain</h2>
    <button data-button-preset-bell>Bell</button>
    <button data-button-preset-strings>String</button>
    <button data-button-preset-reset>Reset</button>

    <element-workstation>
        <machine-keyboard keys></machine-keyboard>
        <machine-adsr></machine-adsr>
    </element-workstation>

    <a href="/envelope">Envelope</a>
    <a href="/additive-synthesis">/Additive Synthesis</a>
`;

export default class EnvelopeAmplitude extends HTMLElement {
    isKeyDown = false;

    animationFrame;
    animationTime;

    keyboardOsc;
    keyboardGain;
    keyboardContext;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.attackAnimation = this.attackAnimation.bind(this);
        this.releaseAnimation = this.releaseAnimation.bind(this);
        this.startKeyboardNote = this.startKeyboardNote.bind(this);
        this.stopKeyboardNote = this.stopKeyboardNote.bind(this);
    }

    connectedCallback() {
        const keyboardElement = this.shadowRoot.querySelector('machine-keyboard');
        const envelopeElement = this.shadowRoot.querySelector('machine-adsr');

        // Keyboard events
        keyboardElement.addEventListener('start', this.startKeyboardNote);
        keyboardElement.addEventListener('stop', this.stopKeyboardNote);

        //presets
        this.shadowRoot.querySelector('[data-button-preset-bell]').addEventListener('click', () => {
            envelopeElement.setAttribute('a', '1');
            envelopeElement.setAttribute('d', '10');
            envelopeElement.setAttribute('s', '20');
            envelopeElement.setAttribute('r', '100');
        });
        this.shadowRoot.querySelector('[data-button-preset-strings]').addEventListener('click', () => {
            envelopeElement.setAttribute('a', '100');
            envelopeElement.setAttribute('d', '90');
            envelopeElement.setAttribute('s', '90');
            envelopeElement.setAttribute('r', '50');
        });
        this.shadowRoot.querySelector('[data-button-preset-reset]').addEventListener('click', () => {
            envelopeElement.setAttribute('a', '100');
            envelopeElement.setAttribute('d', '100');
            envelopeElement.setAttribute('s', '50');
            envelopeElement.setAttribute('r', '100');
        });
    }

    disconnectedCallback() {
        this.keyboardOsc && this.keyboardOsc.stop(this.keyboardContext.currentTime);
        cancelAnimationFrame(this.animationFrame);
    }

    attackAnimation(time) {
        const envelopeElement = this.shadowRoot.querySelector('machine-adsr');

        if (!this.animationTime) {
            this.animationTime = time
        };
        const progress = time - this.animationTime;
        const a = Number(envelopeElement.getAttribute('a'));
        const d = Number(envelopeElement.getAttribute('d'));
        const sumTime = (a + d) * 10;

        const linearInterpolation = (((a + d) / 4)) * ((1 / sumTime) * progress);

        if (progress < sumTime) {
            envelopeElement.setAttribute('cursor', Number(linearInterpolation));
            this.animationFrame = requestAnimationFrame(this.attackAnimation)
        }
    }

    releaseAnimation(time) {
        const envelopeElement = this.shadowRoot.querySelector('machine-adsr');

        if (!this.animationTime) {
            this.animationTime = time
        };
        const progress = time - this.animationTime;
        const r = Number(envelopeElement.getAttribute('r'));
        const max = 100;
        const min = max - (r / 4);

        const linearInterpolation = (max - min) * ((1 / (r * 10)) * progress) + min;

        if (progress < (r * 100)) {
            envelopeElement.setAttribute('cursor', Number(linearInterpolation));
            this.animationFrame = requestAnimationFrame(this.releaseAnimation)
        } else {
            cancelAnimationFrame(this.animationFrame);
            this.animationTime = undefined;
        }
    }

    startKeyboardNote(event) {
        const envelopeElement = this.shadowRoot.querySelector('machine-adsr');

        this.keyboardContext = new AudioContext();
        this.keyboardOsc = this.keyboardContext.createOscillator();
        this.keyboardGain = this.keyboardContext.createGain();
        this.keyboardOsc.frequency.value = event.detail;

        this.keyboardOsc.connect(this.keyboardGain);
        this.keyboardGain.connect(this.keyboardContext.destination);
        this.keyboardOsc.start(this.keyboardContext.currentTime);

        const a = Number(envelopeElement.getAttribute('a')) / 100;
        const d = Number(envelopeElement.getAttribute('d')) / 100;
        const s = Number(envelopeElement.getAttribute('s')) / 100;

        this.keyboardGain.gain.setValueAtTime(0, this.keyboardContext.currentTime);
        this.keyboardGain.gain.linearRampToValueAtTime(1, this.keyboardContext.currentTime + a);
        this.keyboardGain.gain.linearRampToValueAtTime(s, this.keyboardContext.currentTime + a + d);

        cancelAnimationFrame(this.animationFrame);
        this.animationTime = undefined;
        this.attackAnimation(0);

    }

    stopKeyboardNote() {
        if (this.keyboardOsc) {
            const envelopeElement = this.shadowRoot.querySelector('machine-adsr');

            const r = Number(envelopeElement.getAttribute('r')) / 100;

            this.keyboardGain.gain.cancelAndHoldAtTime(this.keyboardContext.currentTime);
            this.keyboardGain.gain.linearRampToValueAtTime(0.01, this.keyboardContext.currentTime + r);
            this.keyboardOsc.stop(this.keyboardContext.currentTime + r + 0.01);

            cancelAnimationFrame(this.animationFrame);
            this.animationTime = undefined;
            this.releaseAnimation(0);
        }
    }

}

window.customElements.define('page-envelope-amplitude', EnvelopeAmplitude);