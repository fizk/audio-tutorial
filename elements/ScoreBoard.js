export default class ScoreBoard extends HTMLElement {
    constructor() {
        super();

        this.close = this.close.bind(this);

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    background-color: rgba(0,0,0,.5);
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                }
                div {
                    width: 50%;
                    height: 50%;
                    background-color: white;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            </style>
            <div>
                <span></span>
                <button>OK</button>
            </div>
        `;
    }

    static get observedAttributes() {
        return ['score'];
    }

    connectedCallback() {
        !this.hasAttribute('score') && this.setAttribute('score', '0');
        this.shadowRoot.querySelector('span').innerHTML = this.getAttribute('score');
        this.shadowRoot.querySelector('button').addEventListener('click', this.close);
        // console.log('hundur');
        // this.addEventListener('animationstart', console.log)
        // this.addEventListener('animationend', console.log);
        // this.animate([
        //     {opacity: 0},
        //     {opacity: 1}
        // ], {
        //         duration: 1000
        // });


    }

    attributeChangedCallback(name, oldValue, newValue) {

    }

    close() {
        this.parentNode.removeChild(this);
    }
}

window.customElements.define('element-score-board', ScoreBoard);