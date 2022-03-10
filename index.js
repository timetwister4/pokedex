let currentPokemon = null
let cachedPokemonNames = []
let pokemonCache = {}
let favoritePokemon= []
let favoritePokemonSet = []
let spriteIsFront = true

function getPokemon(query){
    let name = query.toLowerCase()
    console.log(Object.keys(pokemonCache))
    if(Object.keys(pokemonCache).includes(name)) {
        console.log("hit")
        currentPokemon = pokemonCache[name]
        displayPokemonData()
        hideSpinner()
    } else {
    const opts = {
        'Content-Type': "application/json"
    }
    console.log("Searching for ", name)
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, opts).then((response) => {
        if(response.ok){
            return response.json()
        }
        return Promise.reject(response)
    }).then((data) => {
        console.log(data)
        currentPokemon = data
        pokemonCache[data.species.name] = currentPokemon
        console.log(pokemonCache)
        displayPokemonData()
    }).catch((err) => {
        console.warn(err)
    }).finally(() => hideSpinner())
    }
}

function getFlavorText(query){
    const opts = {
        'Content-Type': "application/json"
    }
    let name = query.toLowerCase()
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`, opts).then((response) => {
        if(response.ok){
            return response.json()
        }
        return Promise.reject(response)
    }).then((data) => {
        console.log(data)
        currentPokemon = data
        pokemonCache[data.species.name] = currentPokemon
        console.log(pokemonCache)
        displayPokemonData()
    }).catch((err) => {
        console.warn(err)
    }).finally(() => hideSpinner())
    
}


function displayPokemonImage(){
    if(spriteIsFront){
        document.getElementById("pokemonImage").setAttribute("src", currentPokemon.sprites["front_default"])
    } else {
        document.getElementById("pokemonImage").setAttribute("src", currentPokemon.sprites["back_default"])
    }
}

function displayPokemonData(){
    displayPokemonImage()

    document.getElementById("pokemonName").innerText = toTitleCase(currentPokemon.species.name)
    document.getElementById("pokemonNumber").innerText = currentPokemon.id
    document.getElementById("pokemonTypes").innerText = getTypes()

}

function getTypes() {
    const typeArray = currentPokemon.types
    let typesString = typeArray[0].type.name
    if (typeArray.length > 1) {
        for(i = 1; i< typeArray.length; i++) {
            typesString += `, ${typeArray[i].type.name}`
        }
    }
    

    return typesString

}

function onImageClick(){
    spriteIsFront = !spriteIsFront
    displayPokemonImage()
}

function search(){
    displaySpinner()
    const query = document.getElementById("searchBar").value
    getPokemon(query)

} 

function displaySpinner(){
    document.getElementById("pokeball").classList.remove("hidden")
    console.log("displaying spinner")
}

function hideSpinner(){
    document.getElementById("pokeball").classList.add("hidden")
    console.log("hiding spinner")
}


function savePokemon(){
    let name = currentPokemon.species.name
    

    if(favoritePokemonSet.includes(name)) return
    favoritePokemonSet.push(name)
    favoritePokemon.push(currentPokemon)
    console.log("favoriting " + name )
    console.log(favoritePokemon)
    displayCarousel()

}

function removePokemon(pokemonToRemove){
    favoritePokemon = favoritePokemon.filter((pkm) => pkm.species.name !== pokemonToRemove)
    favoritePokemonSet = favoritePokemonSet.filter((pkm) => pkm !== pokemonToRemove)
    displayCarousel();
}

function displayCarousel(){
    let stable = ""
    for(i= 0; i< favoritePokemon.length; i++){
        let pokemon = favoritePokemon[i]
        let sprite = pokemon.sprites["front_default"]
        let name = pokemon.species.name
        stable += `<div class="favorites-item">
                        <img src=${sprite} class="animated bounce"> <span>${toTitleCase(name)}</span>
                        <button class="remove-button" onClick="removePokemon('${name}')">Remove</button>
                        
                        </div>`
    }

    document.getElementById("stable").innerHTML = stable

}

function toTitleCase(str) {
    let titleCase = `${str[0].toUpperCase()}${str.substring(1)}`
    return titleCase
}

