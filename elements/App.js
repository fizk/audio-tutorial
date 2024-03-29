import { Router } from '../vaadin-router.js';
import { getScore} from '../database/db.js';
import '../pages/Home.js';
import '../pages/Wave.js'
import '../pages/WaveNumberSequence.js'
import '../pages/WaveMeasure.js'
import '../pages/WaveGainAmplitude.js'
import '../pages/WaveEpilogue.js'
import '../pages/Oscillator.js';
import "../pages/OscillatorTheremin.js";
import "../pages/OscillatorEpilogue.js";
import '../pages/Envelope.js';
import '../pages/EnvelopeAdsr.js';
import '../pages/EnvelopeEpilogue.js';
import '../pages/Modulation.js';
import "../pages/ModulationLFO.js";
import "../pages/ModulationAM.js";
import "../pages/ModulationUndefined.js";
import "../pages/ModulationAmSynth.js";
import "../pages/ModulationFMSynth.js";
import "../pages/ModulationEpilogue.js";
import '../pages/AdditiveSynthesis.js';
import '../pages/AdditiveSynthesisBuilder.js';
import '../pages/AdditiveSynthesisHarmonics.js';
import '../pages/AdditiveSynthesisADSR.js';
import '../pages/AdditiveSynthesisEpilogue.js';
import '../elements/ScoreBoard.js';

window.customElements.define('element-app', class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --line-width: 4px;
                    --line-color: #faebd7;

                    --link-color: var(--color-orange-3);

                    --whole-tone-fill-color: white;
                    --whole-tone-stroke-color: #b8c2c7;
                    --half-tone-color: #37474F;
                    --half-tone-stroke-color: none;

                    --screen-background-color: #37474F;
                    --screen-line-color: #e2d4c2;
                    --screen-line-width: 4px;
                    --screen-marker-line-color: #e2d4c2;
                    --screen-marker-line-width: 1px;
                    --screen-selection: rgba(177, 74, 74, .3996);

                    --color-red-1: #EF9A9A;
                    --color-pink-1: #F48FB1;
                    --color-purple-1: #CE93D8;
                    --color-purple-2: #B39DDB;
                    --color-indigo-1: #9FA8DA;
                    --color-blue-1: #90CAF9;
                    --color-blue-2: #81D4FA;
                    --color-cyan-1: #80DEEA;
                    --color-green-1: #80CBC4;
                    --color-green-2: #A5D6A7;
                    --color-green-3: #C5E1A5;
                    --color-lime-1: #E6EE9C;
                    --color-yellow-1: #FFF59D;
                    --color-orange-1: #FFE082;
                    --color-orange-2: #FFCC80;
                    --color-orange-3: #FFAB91;
                    --color-brown-1: #BCAAA4;
                    --color-gray-1: #CFD8DC;
                    --color-gray-2: #607D8B;
                    --color-gray-3: #263238;

                }
                :host {
                    display: grid;
                    grid-template-areas:
                        "header main"
                        "nav main"
                    ;
                    grid-template-columns: 300px 1fr;
                    grid-template-rows: auto 1fr;

                    height: 100vh;
                    width: 100vw;
                }
                header {
                    grid-area: header;
                    padding: 1rem;
                }
                nav {
                    grid-area: nav;
                    padding: 1rem;
                    align-self: end;
                }
                ul {
                    background-color: white;
                    border-radius: 1rem;

                }
                main {
                    padding: 1rem;
                    grid-area: main;
                    overflow: scroll;
                    position: relative
                }

                .main-menu {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                .main-menu__item {

                }
                .main-menu__link {
                    text-decoration: none;
                    padding: 0.8rem 1rem;
                    display: block;
                    color: #2d2f30;
                }
                .main-menu__item--active {
                    transform: translate(1rem, 0);
                }
                .users-leaving {
                    animation: .7s leave cubic-bezier(1,.02,.55,.87);
                }
                .users-entering {
                    animation: .7s enter cubic-bezier(1,.02,.55,.87);
                }
                @keyframes leave {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(-100%); opacity: 0; }
                }
                @keyframes enter {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0):  opacity: 1; }
                }
                .head-logo-front {
                    fill: none;
                    stroke-width: 3;
                    stroke: var(--color-cyan-1);
                    stroke-linecap: round;
                    // animation-name: one;
                    animation-duration: 4s;
                    animation-iteration-count: infinite;
                    animation-direction: alternate;
                }
                .head-logo-back {
                    fill: none;
                    stroke-width: 3;
                    stroke: var(--color-orange-2);
                    stroke-linecap: round;
                    // animation-name: one;
                    animation-duration: 4s;
                    animation-iteration-count: infinite;
                    animation-direction: alternate;
                    animation-delay: -1s;
                }

                @keyframes one {
                    from {stroke: var(--color-cyan-1);}
                    to {stroke: var(--color-orange-2);}
                }
            </style>
            <header>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 35" width="60" height="35">

                        <path class="head-logo-back" d="M14.68 17.5Q19.63 9 24.57 9t9.89 8.46Q39.41 26 44.35 26t9.89-8.46"/>
                        <path class="head-logo-front" d="M5.76 17.5Q10.71 9 15.65 9t9.89 8.46 9.89 8.46 9.89-8.46"/>

                </svg>
            </header>
            <nav>
                <div data-score></div>
                <ul class="main-menu" data-main-menu>
                    <li class="main-menu__item">
                        <a href="/" class="main-menu__link">Home</a>
                    </li>
                    <li class="main-menu__item">
                        <a href="/wave" class="main-menu__link">Wave</a>
                    </li>
                    <li class="main-menu__item">
                        <a href="/oscillator" class="main-menu__link">Oscillator</a>
                    </li>
                    <li class="main-menu__item">
                        <a href="/envelope" class="main-menu__link">Envelope</a>
                    </li>
                    <li class="main-menu__item">
                        <a href="/modulation" class="main-menu__link">Modulation</a>
                    </li>
                    <li class="main-menu__item">
                        <a href="/additive-synthesis" class="main-menu__link">Additive Synthesis</a>
                    </li>
                </ul>
            </nav>
            <main></main>
            <!--element-score-board></element-score-board-->
        `;

        this.setNav = this.setNav.bind(this);
        this.updateScore = this.updateScore.bind(this);
    }

    setNav(context) {
        const listItems = Array.from(this.shadowRoot.querySelectorAll('[data-main-menu] > li'));
        listItems.forEach(item => {
            item.classList.remove('main-menu__item--active');
            const link = item.querySelector('a');
            if (link.getAttribute('href') === context.path) {
                item.classList.add('main-menu__item--active');
            }
        });
    }

    updateScore(event) {
        getScore().then(result => {
            const navElement = this.shadowRoot.querySelector('[data-score]');
            const total = result.reduce((previous, next) => previous + next.score, 0);
            if (total) {
                navElement.innerHTML = total;
            }

            if (event && !localStorage.getItem('score-board-splash')) {
                const scoreBoardElement = document.createElement('element-score-board');
                scoreBoardElement.setAttribute('score', total);
                this.shadowRoot.appendChild(scoreBoardElement);

                localStorage.setItem('score-board-splash', 'true');
            }
        });
    }

    connectedCallback() {
        this.addEventListener('update-score', this.updateScore);
        this.updateScore();

        const router = new Router(this.shadowRoot.querySelector('main'));
        router.setRoutes([
            {
                path: '/',
                action: this.setNav,
                component: 'page-home'
            }, {
                path: '/wave',
                action: this.setNav,
                children: [
                    {
                        path: '/',
                        component: 'page-wave',
                    }, {
                        path: '/sequence-of-numbers',
                        component: 'page-wave-number-sequence'
                    }, {
                        path: '/measure-the-wave',
                        component: 'page-wave-measure'
                    }, {
                        path: '/gain-and-amplitude',
                        component: 'page-wave-gain-amplitude'
                    }, {
                        path: '/epilogue',
                        component: 'page-wave-epilogue'
                    }
                ]
            }, {
                path: '/oscillator',
                action: this.setNav,
                children: [
                    {
                        path: '/',
                        component: 'page-oscillator',
                    }, {
                        path: '/theremin',
                        component: 'page-oscillator-theremin'
                    }, {
                        path: '/epilogue',
                        component: 'page-oscillator-epilogue'
                    }
                ]
            }, {
                path: '/envelope',
                action: this.setNav,
                children: [
                    {
                        path: '/',
                        component: 'page-envelope',
                    }, {
                        path: '/adsr',
                        component: 'page-envelope-adsr'
                    }, {
                        path: '/epilogue',
                        component: 'page-envelope-epilogue'
                    }
                ]
            }, {
                path: '/modulation',
                action: this.setNav,
                children: [
                    {
                        path: '/',
                        component: 'page-modulation',
                    }, {
                        path: '/lfo',
                        component: 'page-modulation-lfo'
                    }, {
                        path: '/am',
                        component: 'page-modulation-am'
                    }, {
                        path: '/undefined',
                        component: 'page-modulation-undefined'
                    }, {
                        path: '/am-synth',
                        component: 'page-modulation-am-synth'
                    }, {
                        path: '/fm-synth',
                        component: 'page-modulation-fm-synth'
                    }, {
                        path: '/epilogue',
                        component: 'page-modulation-epilogue'
                    }
                ]
            }, {
                path: '/additive-synthesis',
                action: this.setNav,
                children: [
                    {
                        path: '/',
                        component: 'page-additive-synthesis',
                    }, {
                        path: '/builder',
                        component: 'page-additive-synthesis-builder'
                    }, {
                        path: '/harmonics',
                        component: 'page-additive-synthesis-harmonics'
                    }, {
                        path: '/adsr',
                        component: 'page-additive-synthesis-adsr',
                    }, {
                        path: '/epilogue',
                        component: 'page-additive-synthesis-epilogue',
                    }
                ]
            },
        ]);
    }
});
