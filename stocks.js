async function loadData() {
    initAudio();
    const form = document.getElementById("stocksForm");
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const ticker = document.getElementById("ticker").value;
        const dateRange = document.getElementById("dateRange").value;
        await loadChartData(await getChartData(ticker, dateRange));
    });
    window.onresize = function(event) {
        var canvas = document.getElementById("stocksChart");
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            loadChartData(loadedData);
        }
    }
    await loadTopStocks();

    const commandList = document.getElementById("commands");
    const newItem = document.createElement("li");
    newItem.innerHTML = `Lookup stock information:<ul><li>Say: <b>"Lookup &ltstock ticker&gt"</b></li></ul>`
    commandList.appendChild(newItem);

    if (annyang) {
        const command = {
            'Look up :ticker': async (ticker) => {
                await loadChartData(await getChartData(ticker, 30));
                console.log(ticker);
            }
        }
        annyang.addCommands(command);
    }
}


// Stocks
async function getChartData(ticker, dateRange) {
    var currentDate = new Date();
    // currentDate.setMinutes(0);
    // currentDate.setSeconds(0);
    // currentDate.setMilliseconds(0);
    var fromDate = new Date();
    fromDate.setDate(currentDate.getDate() - Number(dateRange));
    var fromDateISO = fromDate.toISOString().split("T")[0];
    var currentDateISO = currentDate.toISOString().split("T")[0];
    // console.log(dateRange);
    // console.log(currentDateISO);
    // console.log(fromDateISO);
    var stocksURL = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromDateISO}/${currentDateISO}?apiKey=Q1OZ9X8CjEu4Tx7nl3VylCy1Abn6JF1E`;
    var labels = [];
    var stocksData = [];
    const resp = await fetch(stocksURL);    
    if (resp["status"] == 429) {
        return 1;
    }
    const data = await resp.json();
    for (var i = 0; i < data["resultsCount"]; i++) {
        var result = data["results"][i];
        var date = new Date(Number(result["t"]));
        date = date.toISOString().split("T")[0].split("-");
        date = `${date[1]}-${date[2]}`;
        //date = `${date.getMonth()}-${date.getDate()}`;
        var val = result["c"];
        labels.push(date);
        stocksData.push(Number(val));
    }
    if (stocksData.length == 0) {
        return 0;
    }
    var chartData = {
        labels: labels,
        datasets: [{
            label: `Stocks for ${ticker} from ${fromDateISO}`,
            data: stocksData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
    }]};
    loadedData = chartData;
    return chartData;
}

var loadedData; // Stores the stock data in case the chart needs to be redrawn

async function loadChartData(chartData) {
    const chartDiv = document.getElementById("chartDiv");
    while (chartDiv.firstChild) { // Clear all elements
        chartDiv.removeChild(chartDiv.firstChild);
    }
    if (chartData == 0 || chartData == 1) {
        const error = document.createElement("h1");
        switch (chartData) {
            case 0:
                error.innerHTML = "No data found";
                break;
            case 1:
                error.innerHTML = "Too many calls made in the last minute";
                break;
        }
        chartDiv.appendChild(error);
    } else {
        const canvas = document.createElement("canvas");
        canvas.id = "stocksChart";
        chartDiv.appendChild(canvas);
        const chartElem = document.getElementById('stocksChart');
        new Chart(chartElem, {type: "line", data: chartData});
    }
}

async function loadTopStocks() {
    const topStocksURL = `https://tradestie.com/api/v1/apps/reddit?date=2022-04-03`;
    const topStocksTable = document.getElementById("topStocks");
    const yahooBaseURL = `https://finance.yahoo.com/quote`
    var topStocks = await fetch(topStocksURL).then((resp) => resp.json());
    for (var i = 0; i < Math.min(5, topStocks.length); i++) {
        const newRow = document.createElement("tr");
        const ticker = document.createElement("th");
        const commentCount = document.createElement("td");
        const sentiment = document.createElement("td");

        ticker.innerHTML = `<a class="stocksTicker" href="${yahooBaseURL}/${topStocks[i]["ticker"]}">${topStocks[i]["ticker"]}</a>`;
        commentCount.innerHTML = `<p class="commentCount">${topStocks[i]["no_of_comments"]}</p>`;
        sentiment.innerHTML = `<img src="${topStocks[i]["sentiment"]}.png" class="stocksIcon"></img>`;
        sentiment.className = "sentiment";

        newRow.appendChild(ticker);
        newRow.appendChild(commentCount);
        newRow.appendChild(sentiment);
        topStocksTable.appendChild(newRow);
    }
}