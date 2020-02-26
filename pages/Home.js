
const template = document.createElement('template');
template.innerHTML = `
    <h2>Home</h2>
`;

export default class Home extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

window.customElements.define('page-home', Home);