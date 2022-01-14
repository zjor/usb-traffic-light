const TrafficLight = {
    data() {
        return {
            red: false,
            yellow: false,
            green: false,
        }
    },
    mounted() {
        const COMMAND_RED = 'красный';
        const COMMAND_YELLOW = 'жёлтый';
        const COMMAND_GREEN = 'зелёный';

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
                console.log(transcript);
                const command = transcript.toLocaleString().trim();
                if (command == COMMAND_RED) {
                    this.red = true; this.yellow = false; this.green = false;
                } else if (command == COMMAND_YELLOW) {
                    this.red = false; this.yellow = true; this.green = false;
                } else if (command == COMMAND_GREEN) {
                    this.red = false; this.yellow = false; this.green = true;
                }
                // await handleVoiceCommand(transcript.toLocaleString().trim(), client);
            }
        });

        recognition.addEventListener('end', recognition.start);
        recognition.start();
    }
}




Vue.createApp(TrafficLight).mount('#traffic-light')