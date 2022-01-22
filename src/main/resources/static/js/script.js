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

class FSM {
    constructor(transitions) {
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

        startSpeechRecognition(async (command) => {
            const timestamp = (new Date()).toLocaleTimeString()
            this.commands.unshift(`[${timestamp}] ${command}`);
            this.commands = this.commands.splice(0, 14);
            this.commandsHtml = this.commands.join('<br/>');
            if (command == COMMAND_RED) {
                this.red = true; this.yellow = false; this.green = false;
            } else if (command == COMMAND_YELLOW) {
                this.red = false; this.yellow = true; this.green = false;
            } else if (command == COMMAND_GREEN) {
                this.red = false; this.yellow = false; this.green = true;
            } else if (command == COMMAND_TRAFFIC_LIGHT) {
                // TODO: run fsm
            }
        })
    }
}

Vue.createApp(TrafficLight).mount('#app')