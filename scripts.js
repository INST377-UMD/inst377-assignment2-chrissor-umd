async function loadData(page) { // Dont feel like making separate functions for each page
    switch(page) {
        case "home":
            // Load Home data
            const quoteDiv = document.getElementById("quote");
            quoteDiv.innerHTML = await getRandomQuote();
            break;
    }

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


async function getRandomQuote() {
    const baseURL = "https://zenquotes.io/api/random"
    const data = await fetch(baseURL)
        .then((resp) => resp.json());
    return data[0]["h"];
}
