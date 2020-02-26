const template = document.createElement('template');
template.innerHTML = `
    <h2>Additive synthesis</h2>
    <p>
        When we pluck the A string on a guitar, the string wil vibrate at 110Hz. In addion to that, we hear
        infinite number of additional vibrations that are a multiply of that original wave.
    </p>
    <p>
        So for our 110Hz, we also hear vibrations of 220, 330, 440, 550, 660....
    </p>
    <p>
        Our original is called <strong>the fundimental</strong> and the additionals are called
        <strong>over-tones.</strong>. Sometimes this is also reffered to as the <strong>harmonics</strong>.
        Going back to our 110Hz; that would be our 1st harmonic, but our 2nd overtone. So, harmonics include
        the fundimental, while over-tones start counting after the fundimental.
    </p>
    <blockquote>
        In 1822, Joseph Fourier showed that some functions could be written as an infinite sum of harmonics.
    </blockquote>
    <p>
        This roughly translates to: we can produce any sound by adding together sinewaves of different frequency and amplitude.
    </p>


    <a href="/envelope/amplitude">Envelope Amplitude</a>
    <a href="/additive-synthesis/builder">Wave Builder</a>

`;
export default class AdditiveSynthesis extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

window.customElements.define('page-additive-synthesis', AdditiveSynthesis);