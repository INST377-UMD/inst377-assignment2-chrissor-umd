async function loadData() {
    initAudio();
    await loadDogSlides(10);
    simpleslider.getSlider();
    await loadDogBreeds();

    const commandList = document.getElementById("commands");
    const newItem = document.createElement("li");
    newItem.innerHTML = `Load Dog Breed:<ul><li>Say: <b>"Load &ltbreed&gt"</b></li></ul>`
    commandList.appendChild(newItem);

    if (annyang) {
        const command = {
            'Load :breed': async (breed) => {
                await loadBreedFacts(breed);
            }
        }
        annyang.addCommands(command);
    }
}

var dogBreeds;

async function loadDogSlides(numSlides) {
    const dogSlidesDiv = document.getElementById("dogSlides");
    var dogSlides = [];
    const breedRegex = new RegExp("breeds\\\/(.+)(?=\\\/)");
    var data;
    for (var i=0; i < numSlides; i++) {
        var dogSlide = {
            image: "",
            breed: ""
        }
        do {
            data = await fetch(`https://dog.ceo/api/breeds/image/random`).then((resp) => resp.json());
            dogSlide.image = data["message"];
            dogSlide.breed = breedRegex.exec(data["message"])[1];
        } while (data["status"] != "success");
        dogSlides.push(dogSlide);
    }
    for (var i=0; i < dogSlides.length; i++) {
        const slide = document.createElement("img");
        slide.src = dogSlides[i].image;
        slide.style.width="612px";
        slide.style.height="612px";
        dogSlidesDiv.appendChild(slide);
    }
}

var breedFacts = new Map();

async function loadDogBreeds() {
    const dogBreedURL = "https://dogapi.dog/api/v2/breeds";
    const buttonsDiv = document.getElementById("breedButtons");
    const data = (await fetch(dogBreedURL).then((resp) => resp.json()))["data"];
    for (let i=0; i < data.length; i++) {
        const breed = data[i]["attributes"];
        const breedInfo = {
            name: breed["name"],
            desc: breed["description"],
            minLife: breed["life"]["min"],
            maxLife: breed["life"]["max"]
        }
        breedFacts.set(breedInfo["name"], breedInfo);
        const button = document.createElement("button");
        button.innerHTML = breedInfo.name;
        button.className = "roundButton";
        button.onclick = () => loadBreedFacts(breedInfo["name"]);
        buttonsDiv.appendChild(button);
    }
}

async function loadBreedFacts(breedName) {
    const breedDiv = document.getElementById("breeds");
    var factsDiv = document.getElementById("facts");
    if (factsDiv) {
        breedDiv.removeChild(factsDiv);
    }
    factsDiv = document.createElement("div");
    factsDiv.id = "facts";

    const name = document.createElement("h2");
    const description = document.createElement("p");
    const min = document.createElement("p");
    const max = document.createElement("p");

    factsDiv.appendChild(name);
    factsDiv.appendChild(description);
    factsDiv.appendChild(min);
    factsDiv.appendChild(max);

    const facts = breedFacts.get(breedName);
    name.innerHTML = `<b>Name: </b>${facts["name"]}`;
    description.innerHTML = `<b>Description: </b>${facts["desc"]}`;
    min.innerHTML = `<b>Minimum Lifespan: </b>${facts["minLife"]} years`;
    max.innerHTML = `<b>Maximum Lifespan: </b>${facts["maxLife"]} years`;

    breedDiv.appendChild(factsDiv);

}