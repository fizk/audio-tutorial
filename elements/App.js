import { Resolver, Router } from 'https://unpkg.com/@vaadin/router@1.6.0/dist/vaadin-router.js';

import '../pages/Home.js';
import "../pages/SineWave.js";
import "../pages/SineWaveBasics.js";
import "../pages/SineWaveHertz.js";
import '../pages/SineWaveGain.js';
import '../pages/TheOscillator.js';
import "../pages/TheOscillatorTheremin.js";
import '../pages/Modulation.js';
import "../pages/ModulationLFO.js";
import "../pages/ModulationAM.js";
import "../pages/ModulationFM.js";
import "../pages/ModulationPlay.js";
import '../pages/Envelope.js';
import '../pages/EnvelopeAmplitude.js';
import '../pages/AdditiveSynthesis.js';
import '../pages/AdditiveSynthesisBuilder.js';
import '../pages/AdditiveSynthesisHarmonics.js';
import '../pages/AdditiveSynthesisOctaves.js';
import '../pages/AdditiveSynthesisPhasing.js';
import '../pages/AdditiveSynthesisADSR.js';
import '../pages/AdditiveSynthesisConclusion.js';
import '../pages/SubtractiveSynthesis.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            --whole-tone-fill-color: white;
            --whole-tone-stroke-color: #b8c2c7;
            --half-tone-color: #37474F;
            --half-tone-stroke-color: none;

            --screen-background-color: #37474F;

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
            padding: 1rem;
            display: block;
            color: #2d2f30;
        }
        .main-menu__item--active {
            transform: translate(1rem, 0);
        }

    </style>
    <header>header</header>
    <nav>
        <ul class="main-menu" data-main-menu>
            <li class="main-menu__item">
                <a href="/" class="main-menu__link">Home</a>
            </li>
            <li class="main-menu__item">
                <a href="/sinewave" class="main-menu__link">The Sine wave</a>
            </li>
            <li class="main-menu__item">
                <a href="/oscillator" class="main-menu__link">The Oscillator</a>
            </li>
            <li class="main-menu__item">
                <a href="/modulation" class="main-menu__link">Modulation</a>
            </li>
            <li class="main-menu__item">
                <a href="/envelope" class="main-menu__link">The Envelope</a>
            </li>
            <li class="main-menu__item">
                <a href="/additive-synthesis" class="main-menu__link">Additive Synthesis</a>
            </li>
            <li class="main-menu__item">
                <a href="/subtractive-synthesis" class="main-menu__link">Subtractive synthesis</a>
            </li>
        </ul>
    </nav>
    <main></main>
`;

export default class App extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.setNav = this.setNav.bind(this);
    }

    setNav(context, commands) {
        const listItems = Array.from(this.shadowRoot.querySelectorAll('[data-main-menu] > li'));
        listItems.forEach(item => {
            item.classList.remove('main-menu__item--active');
            const link = item.querySelector('a');
            if (link.getAttribute('href') === context.path) {
                item.classList.add('main-menu__item--active');
            }
        });
    }

    connectedCallback() {
        const router = new Router(this.shadowRoot.querySelector('main'));
        router.setRoutes([
            {
                path: '/',
                action: this.setNav,
                component: 'page-home'
            },
            {
                path: '/sinewave',
                action: this.setNav,
                children: [
                    {
                        path: '/',
                        component: 'page-sine-wave',
                    },
                    {
                        path: '/basics-sine',
                        component: 'page-sine-wave-basics'
                    },{
                        path: '/hertz',
                        component: 'page-sine-wave-hertz'
                    }, {
                        path: '/gain',
                        component: 'page-sine-wave-gain'
                    }
                ]
            },
            {
                path: '/oscillator',
                action: this.setNav,
                children: [
                    {
                        path: '/',
                        component: 'page-the-oscillator',
                    },{
                        path: '/theremin',
                        component: 'page-the-oscillator-theremin'
                    }
                ]
            },
            {
                path: '/modulation',
                action: this.setNav,
                children: [
                    {
                        path: '/',
                        component: 'page-modulation',
                    }, {
                        path: '/am',
                        component: 'page-modulation-am'
                    }, {
                        path: '/fm',
                        component: 'page-modulation-fm'
                    }, {
                        path: '/lfo',
                        component: 'page-modulation-lfo'
                    }, {
                        path: '/play',
                        component: 'page-modulation-play'
                    }
                ]
            },
            {
                path: '/envelope',
                action: this.setNav,
                children: [
                    {
                        path: '/',
                        component: 'page-envelope',
                    }, {
                        path: '/amplitude',
                        component: 'page-envelope-amplitude'
                    }
                ]
            },
            {
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
                        path: '/octaves',
                        component: 'page-additive-synthesis-octaves'
                    }, {
                        path: '/octaves',
                        component: 'page-additive-synthesis-octaves'
                    }, {
                        path: '/adsr',
                        component: 'page-additive-synthesis-adsr',
                    }, {
                        path: '/phasing',
                        component: 'page-additive-synthesis-phasing',
                    }, {
                        path: '/conclusion',
                        component: 'page-additive-synthesis-conclusion',
                    }
                ]
            },
            {
                path: '/subtractive-synthesis',
                action: this.setNav,
                component: 'page-subtractive-synthesis'
            },
        ]);
    }
}

customElements.define('element-app', App);