export default class Slider extends HTMLInputElement {
    // constructor() {
    //     super();

    //     // this.style.border = '1px solid red';

    //     // -webkit - appearance: none;

    // }

    // connectedCallback() {
    //     this.addEventListener('input', console.log)
    // }
}

window.customElements.define('elements-slider', Slider, { extends: 'input'});