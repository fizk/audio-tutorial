import '../elements/Workstation.js';
import '../machines/ADSR.js';
import '../machines/Trigger.js';

// function lerp(min, max, fraction) {  return (max — min) * fraction + min;}

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
            <h2>Envelope</h2>
        </header>
        <main>
            <p>
                Up to this point we have manitulated which is a drone
            </p>
            <p>
                In the phisical world a note has a lifecycle. Violin Cello...
            </p>
            <h3>Envelope ADSR</h2>
            <p>
                Mimic that with an envelope
            </p>
            <h3>A is for attach</h3>
            <h3>D is for decay</h3>
            <h3>S is for sustain</h3>
            <h3>R is for release</h3>
        </main>
        <aside>
            <p>
                Press the Spacebar and hold it in to see in ADS part, release it to se the R part.
            </p>
            <element-workstation>
                <machine-trigger></machine-trigger>
                <machine-adsr width="400" height="100"></machine-adsr>
            </element-workstation>
        </aside>
        <footer>
            <a href="/modulation/play">Play</a>
            <a href="/envelope/amplitude">ADSR Amplitude</a>
        </footer>
    </article>
`;

export default class Envelope extends HTMLElement {

    context;
    osc;
    animationFrame;
    animationTime;
    envelopeToAnimate;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.handleStart = this.handleStart.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.attackAnimation = this.attackAnimation.bind(this);
        this.releaseAnimation = this.releaseAnimation.bind(this);
    }

    connectedCallback() {
        this.shadowRoot.querySelector('machine-trigger').addEventListener('start', this.handleStart);
        this.shadowRoot.querySelector('machine-trigger').addEventListener('stop', this.handleStop);
    }

    disconnectedCallback() {
        cancelAnimationFrame(this.animationFrame);
    }

    handleStart() {
        const envelopeElement = this.shadowRoot.querySelector('machine-adsr');
        const a = Number(envelopeElement.getAttribute('a')) / 100;
        const d = Number(envelopeElement.getAttribute('d')) / 100;
        const s = Number(envelopeElement.getAttribute('s')) / 100;
        const sustainFrequency = (880 - 220) * s + 220;

        this.context = new AudioContext();
        this.osc = this.context.createOscillator();
        this.osc.frequency.value = 220;
        this.osc.frequency.linearRampToValueAtTime(880, this.context.currentTime + a);
        this.osc.frequency.linearRampToValueAtTime(sustainFrequency, this.context.currentTime + a + d);

        const analyser = this.context.createAnalyser();
        const gain = this.context.createGain();
        gain.gain.value = .5;
        this.osc.connect(gain)
        gain.connect(analyser);
        analyser.connect(this.context.destination);

        this.osc.start(this.context.currentTime);

        cancelAnimationFrame(this.animationFrame);
        this.animationTime = undefined;
        this.envelopeToAnimate = envelopeElement;
        this.attackAnimation(0);
    }

    handleStop() {
        const envelopeElement = this.shadowRoot.querySelector('machine-adsr');
        const r = Number(envelopeElement.getAttribute('r')) / 100;
        const s = Number(envelopeElement.getAttribute('s')) / 100;
        const sustainFrequency = (880 - 220) * s + 220;

        this.osc.frequency.cancelAndHoldAtTime(this.context.currentTime);
        this.osc.frequency.linearRampToValueAtTime(sustainFrequency, this.context.currentTime);
        this.osc.frequency.linearRampToValueAtTime(220, this.context.currentTime + r);
        this.osc.stop(this.context.currentTime + r);

        cancelAnimationFrame(this.animationFrame);
        this.animationTime = undefined;
        this.envelopeToAnimate = envelopeElement;
        this.releaseAnimation(0);
    }

    disconnectedCallback() {
        this.osc && this.osc.stop(this.context.currentTime);
        cancelAnimationFrame(this.animationFrame);
    }

    attackAnimation(time) {
        if (!this.envelopeToAnimate) {
            return;
        }

        if (!this.animationTime) {
            this.animationTime = time
        };
        const progress = time - this.animationTime;

        const envelopeElement = this.envelopeToAnimate;

        const a = Number(envelopeElement.getAttribute('a'));
        const d = Number(envelopeElement.getAttribute('d'));
        const sumTime = (a + d) * 10;

        const larp = (((a + d) / 4) - 0) * ((1 / sumTime) * progress) + 0;

        if (progress < sumTime) {
            envelopeElement.setAttribute('cursor', Number(larp));
            this.animationFrame = requestAnimationFrame(this.attackAnimation)
        }
    }

    releaseAnimation(time) {
        if (!this.envelopeToAnimate) {
            return;
        }

        if (!this.animationTime) {
            this.animationTime = time
        };
        const progress = time - this.animationTime;

        const envelopeElement = this.envelopeToAnimate;
        const r = Number(envelopeElement.getAttribute('r'));
        const max = 100;
        const min = max - (r / 4);

        const larp = (max - min) * ((1 / (r * 10)) * progress) + min;

        if (progress < (r * 100)) {
            envelopeElement.setAttribute('cursor', Number(larp));
            this.animationFrame = requestAnimationFrame(this.releaseAnimation)
        } else {
            cancelAnimationFrame(this.animationFrame);
            this.animationTime = undefined;
        }
    }
}

window.customElements.define('page-envelope', Envelope);