async function loadData() {
    initAudio(); // Load Audio Div
    const quoteDiv = document.getElementById("quote");
    quoteDiv.innerHTML = await getRandomQuote();
}


// Quotes
async function getRandomQuote() {
    const baseURL = "https://zenquotes.io/api/random"
    try {
        const data = await fetch(baseURL)
            .then((resp) => resp.json());
        return data[0]["h"];
    } catch(err) { // In case of errors with the api, this will prevent anything from breaking
        return "<blockquote>&ldquo;Insert quote here.&rdquo; &mdash; <footer>Christian Sorensen</footer></blockquote>"
    }
}