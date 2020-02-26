import '../machines/Filter.js';
import '../elements/Workstation.js';
import '../machines/Master.js';
import '../machines/Gain.js';
import '../machines/Oscillator.js';
import '../machines/Toggle.js';

const template = document.createElement('template');
template.innerHTML = `
    <h2>Subtractive Synthesis</h2>
    <element-workstation>
        <machine-toggle wave="sine"></machine-toggle>
        <machine-oscillator wave="sine"></machine-oscillator>
        <machine-filter></machine-filter>
        <machine-gain></machine-gain>
        <machine-master></machine-master>
    </element-workstation>
`;

export default class SubtractiveSynthesis extends HTMLElement {
    context;
    filter;
    osc;
    masterMonitor;
    mainGain;
    oscMonitor;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.draw = this.draw.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.animate = this.animate.bind(this);
        this.handleUpdateFilter = this.handleUpdateFilter.bind(this);
    }

    connectedCallback() {
        const filterElement = this.shadowRoot.querySelector('machine-filter');
        const oscElement = this.shadowRoot.querySelector('machine-oscillator');
        const gainElement = this.shadowRoot.querySelector('machine-gain');

        filterElement.addEventListener('frequency-change', (event) => {
            this.filter && (this.filter.frequency.value = event.detail);
            this.handleUpdateFilter();
        });
        filterElement.addEventListener('q-change', (event) => {
            this.filter && (this.filter.Q.value = event.detail);
            this.handleUpdateFilter();
        });
        filterElement.addEventListener('type-change', (event) => {
            this.filter && (this.filter.type = event.detail);
            this.handleUpdateFilter();
        });
        oscElement.addEventListener('type-change', (event) => {
            this.osc && (this.osc.type = event.detail);
        });
        oscElement.addEventListener('frequency-change', (event) => {
            this.osc && (this.osc.frequency.value = event.detail);
        });
        gainElement.addEventListener('amount-change', (event) => {
            this.mainGain && (this.mainGain.gain.value = event.detail);
        })
        this.shadowRoot.querySelector('machine-toggle').addEventListener('toggle', (
            this.handleToggle
        ));

    }

    handleToggle (event) {
        if (event.detail) {
            this.context = new AudioContext();
            this.filter = this.context.createBiquadFilter();
            this.osc = this.context.createOscillator();
            this.masterMonitor = this.context.createAnalyser();
            this.mainGain = this.context.createGain();
            this.oscMonitor = this.context.createAnalyser();
            console.log(this.context.sampleRate);
            this.osc.frequency.value = 440;

            this.osc.connect(this.oscMonitor);
            this.oscMonitor.connect(this.filter);
            this.filter.connect(this.mainGain);
            this.mainGain.connect(this.masterMonitor)
            this.masterMonitor.connect(this.context.destination);

            this.osc.start(this.context.currentTime);
            this.handleUpdateFilter();
            this.animate();
        } else {
            this.osc && this.osc.stop(this.context.currentTime);
        }
    }

    handleUpdateFilter() {
        const width = 300;
        const frequencyHz = new Float32Array(width);
        const magResponse = new Float32Array(width);
        const phaseResponse = new Float32Array(width);
        const oct = 10;

        for (let i = 0; i < width; i++) {
            let n = oct * ((i / width) - 1.0);
            frequencyHz[i] = (this.context.sampleRate / 2) * Math.pow(2.0, n);
        }
        this.filter.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
        this.shadowRoot.querySelector('machine-filter').frequencyData = magResponse;
    }

    animate() {
        // master monitor
        this.masterMonitor.fftSize = 2048;
        const amMasterMonitorDataArray = new Uint8Array(this.masterMonitor.frequencyBinCount);
        this.masterMonitor.getByteTimeDomainData(amMasterMonitorDataArray);

        this.masterMonitor.fftSize = 512;
        this.masterMonitor.minDecibels = -140;
        this.masterMonitor.maxDecibels = 0;
        const amMasterMonitorByteArray = new Uint8Array(this.masterMonitor.frequencyBinCount);
        this.masterMonitor.getByteFrequencyData(amMasterMonitorByteArray);

        // oscillator monitor
        this.oscMonitor.fftSize = 2048;
        const amCarrierMonitorDataArray = new Uint8Array(this.oscMonitor.frequencyBinCount);
        this.oscMonitor.getByteTimeDomainData(amCarrierMonitorDataArray);

        const oscElement = this.shadowRoot.querySelector('machine-oscillator');
        const masterElement = this.shadowRoot.querySelector('machine-master');

        oscElement.frequencyData = amCarrierMonitorDataArray;
        masterElement.frequencyData = amMasterMonitorDataArray;
        masterElement.byteData = amMasterMonitorByteArray;

        this.animationFrame = requestAnimationFrame(this.animate);
    }

    draw () {

        this.context = new AudioContext();
        this.filter = this.context.createBiquadFilter();
        // filter.type = $scope.type.type;
        // for (var key in $scope.params) if ($scope.params.hasOwnProperty(key)) {
        //     var val = $scope.params[key];
        //     if ($scope.type[key]) {
        //         console.log('set', key, val);
        //         filter[key].value = val;
        //     }
        // }







        // var scale = 60;
        // var ctx = canvas.getContext('2d');
        // ctx.clearRect(0, 0, canvas.width, canvas.height);







        // // ctx.beginPath();
        // // ctx.fillStyle = "#006600";
        // // for (var deg = -270; deg <= 270; deg += 90) {
        // //     var y = (deg + 360) * canvas.height / (360 * 2); // no warnings
        // //     //			ctx.moveTo(0, y);
        // //     //			ctx.lineTo(width, y);
        // //     ctx.fillText(deg + "Â°", width - 100, y);
        // // }
        // // ctx.stroke();

        // // ctx.strokeStyle = "#009900";
        // // ctx.beginPath();
        // // ctx.moveTo(0, canvas.height);
        // // for (var i = 0; i < width; i++) {
        // //     var phase = phaseResponse[i] + Math.PI;
        // //     var degree = phaseResponse[i] * (180 / Math.PI);
        // //     ctx.lineTo(i, (degree + 360) * canvas.height / (360 * 2));
        // // }
        // // ctx.stroke();
    };
}

window.customElements.define('page-subtractive-synthesis', SubtractiveSynthesis);