class TrafficLightClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    async getTrafficLightState() {
        try {
            const res = await fetch(`${this.baseUrl}/api/traffic-light/state`)
            return res.json()
        } catch (e) {
            console.error(e)
            return JSON.stringify(e)
        }
    }

    async setTrafficLightState(red, yellow, green) {
        const data = {red, yellow, green}
        try {
            const res = await fetch(`${this.baseUrl}/api/traffic-light/state`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return res.json()
        } catch (e) {
            console.error(e)
            return JSON.stringify(e)
        }
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
        this.timerHandle = setTimeout(() => {
            this.next()
        }, this.transitions[this.state].delay)
        this.started = true;
    }

    next() {
        console.log(`State: ${this.state}`)

        this.state = this.transitions[this.state].next
        this.stateChangedCallback(this.state)
        this.timerHandle = setTimeout(() => {
            this.next()
        }, this.transitions[this.state].delay)
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

        const setState = (r, y, g) => {
            this.red = r;
            this.yellow = y;
            this.green = g;
            client.setTrafficLightState(r, y, g).catch(console.log);
        }

        const stateMachine = new TrafficLightStateMachine(state => {
            if (state === 'red') {
                setState(true, false, false)
            } else if (state === 'redYellow') {
                setState(true, true, false)
            } else if (state == 'yellow') {
                setState(false, true, false)
            } else if (state === 'green') {
                setState(false, false, true)
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
                setState(true, false, false)
            } else if (command == COMMAND_YELLOW) {
                stateMachine.stop()
                setState(false, true, false)
            } else if (command == COMMAND_GREEN) {
                stateMachine.stop()
                setState(false, false, true)
            } else if (command == COMMAND_TRAFFIC_LIGHT) {
                stateMachine.start()
            }
        })
    }
}

Vue.createApp(TrafficLight).mount('#app')