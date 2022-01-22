class TrafficLightClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async getTrafficLightState() {
        const res = await fetch(`${this.baseUrl}/api/traffic-light/state`);
        return res.json();
    }

    async setTrafficLightState(red, yellow, green) {
        const data = {red, yellow, green}
        const res = await fetch(`${this.baseUrl}/api/traffic-light/state`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return res.json()
    }
}

const client = new TrafficLightClient('http://localhost:8080');

function startSpeechRecognition(handler) {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    // recognition.lang = 'en-US';
    recognition.lang = 'ru-RU';

    recognition.addEventListener('result', async e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        if (e.results[0].isFinal) {
            const command = transcript.toLocaleString().trim().toLowerCase();
            await handler(command);
        }
    });
    recognition.addEventListener('end', recognition.start);
    recognition.start();
}

class TrafficLightStateMachine {
    constructor(stateChangedCallback) {
        this.transitions = {
            red: {
                next: 'redYellow',
                delay: 750
            },
            redYellow: {
                next: 'green',
                delay: 750
            },
            green: {
                next: 'yellow',
                delay: 750
            },
            yellow: {
                next: 'red',
                delay: 750
            }
        }
        this.initialState = 'green'
        this.started = false
        this.stateChangedCallback = stateChangedCallback
    }

    start() {
        this.stop()
        this.state = this.initialState
        this.stateChangedCallback(this.state)
        this.timerHandle = setTimeout(() => { this.next() }, this.transitions[this.state].delay)
        this.started = true;
    }

    next() {
        console.log(`State: ${this.state}`)

        this.state = this.transitions[this.state].next
        this.stateChangedCallback(this.state)
        this.timerHandle = setTimeout(() => { this.next() }, this.transitions[this.state].delay)
    }

    stop() {
        if (this.started) {
            clearTimeout(this.timerHandle);
        }
    }
}

const TrafficLight = {
    data() {
        return {
            red: false,
            yellow: false,
            green: false,
            commands: [],
            commandsHtml: 'hello </br> world'
        }
    },
    mounted() {

        const COMMAND_RED = 'красный';
        const COMMAND_YELLOW = 'жёлтый';
        const COMMAND_GREEN = 'зелёный';
        const COMMAND_TRAFFIC_LIGHT = 'светофор';

        const stateMachine = new TrafficLightStateMachine(state => {
            if (state === 'red') {
                this.red = true; this.yellow = false; this.green = false;
            } else if (state === 'redYellow') {
                this.red = true; this.yellow = true; this.green = false;
            } else if (state == 'yellow') {
                this.red = false; this.yellow = true; this.green = false;
            } else if (state === 'green') {
                this.red = false; this.yellow = false; this.green = true;
            } else {
                throw new Error(`Unsupported state: ${state}`)
            }
        });

        startSpeechRecognition(async (command) => {
            const timestamp = (new Date()).toLocaleTimeString()
            this.commands.unshift(`[${timestamp}] ${command}`);
            this.commands = this.commands.splice(0, 14);
            this.commandsHtml = this.commands.join('<br/>');
            if (command == COMMAND_RED) {
                stateMachine.stop()
                this.red = true; this.yellow = false; this.green = false;
            } else if (command == COMMAND_YELLOW) {
                stateMachine.stop()
                this.red = false; this.yellow = true; this.green = false;
            } else if (command == COMMAND_GREEN) {
                stateMachine.stop()
                this.red = false; this.yellow = false; this.green = true;
            } else if (command == COMMAND_TRAFFIC_LIGHT) {
                stateMachine.start()
            }
        })
    }
}

Vue.createApp(TrafficLight).mount('#app')