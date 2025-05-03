// Audio
function initAudio() {
    const audioHTML = `
            <h2>You can navigate this web page with audio!</h2>
            <h4><b><i>Ensure your mic is enabled to use this feature!</i></b></h4>
            <h4>Commands:</h4>
            <ul id="commands">
                <li>Navigate to a different page:
                    <ul>
                        <li>Say: <b>"Navigate to &ltpage&gt"</b></li>
                    </ul>
                </li>
                <li>Change page color:
                    <ul>
                        <li>Say: <b>"Change color to &ltcolor&gt"</b></li>
                    </ul>
                </li>
                <li>Give a friendly greeting:
                    <ul>
                        <li>Say: <b>"Hello!"</b></li>
                    </ul>
                </li>
            </ul>
            <div id="audio-buttons" class="centered">
                <button class="audio-button" onclick="startListening()">Turn on Listening</button>
                <button class="audio-button" onclick="stopListening()">Turn off Listening</button>
            </div>`
    // Populating the audio div through js means I can just generate it dynamically rather than copy and paste on every page
    const audioDiv = document.getElementById("audio");
    audioDiv.innerHTML = audioHTML;

    if (annyang) {
        // Let's define a command.
        const commands = {
            'hello': () => { alert('Hello World!'); },
            'navigate to :page': (page) => { window.location.href=`${page}.html`; },
            'change color to :color': (color) => { const body = document.getElementById("body").style.backgroundColor = `${color}`; }
        };
      
        // Add our commands to annyang
        annyang.addCommands(commands);
      }

      annyang.addCallback('result', (speech) => {console.log(speech)});
}
function startListening() {
    if (annyang && !annyang.isListening()) {
        // Start listening.
        annyang.start();
    }
}
function stopListening() {
    if (annyang && annyang.isListening()) {
        // Stop listening.
        annyang.abort();
    }
}
