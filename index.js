//Dark or light theme detection on user machine, this way the slider will be on its proper position.
//Only used for the slider, picocss already detects it and loads the preferred color scheme.

let mode = "dark"
if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){
    mode = "light"
    document.getElementById("slider").checked = true
}

//Code for theme toggling via slider

function toggleTheme(){
    if(mode==="dark"){
        document.body.parentNode.setAttribute("data-theme","light")
        mode = "light"
    }else if(mode==="light"){
        document.body.parentNode.setAttribute("data-theme","dark")
        mode = "dark"
    }
}

//Code for app functionality

const form = document.getElementById('form')
const input = document.getElementById('input')
const btn = document.getElementById('btn')
const results = document.getElementById('results')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    let value = input.value
    if(!value) return

    let esValue = ""

    if(locale==="es"){
        esValue = value

        const url = 'https://google-translate113.p.rapidapi.com/api/v1/translator/html';
        const options = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '4caae5832dmshc8cc301c940600ep172f96jsncdc7d0d18813',
                'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'es',
                to: 'en',
                html: esValue,
            })
        };

        try {
            const response = await fetch(url, options);
            const result = await response.text();

            if(result)
                value = JSON.parse(result).trans;
        } catch (error) {
            results.innerHTML = `<h3>Aplicación saturada debido al límite mensual de traducciones.</h3><h3>Prueba la versión en inglés.</h3>`;
            console.error(error);
        }        
    }

    btn.setAttribute('disabled','disabled')
    btn.setAttribute('aria-busy','true')

    if(locale==="en")
        btn.innerText = "Searching..."
    else if(locale==="es")
        btn.innerText = "Buscando..."

    const foodInfo = await fetch('https://api.edamam.com/api/food-database/v2/parser?app_id=e7ec980c&app_key=e8facc8d7d04b8e6bf1793c3dc391aed&ingr='+value+'&nutrition-type=cooking')
                    .then(response => response.json())
                    .catch(err => console.error(err))

    if(foodInfo){ 
        try{    
            input.value = ""   
            results.innerHTML = ""
            if(locale==="en"){
                results.innerHTML=('<h1>'+foodInfo.parsed[0].food.label+'</h1>')
            }else if(locale==="es"){
                results.innerHTML=('<h1>'+esValue +'</h1>')
            }

            let kcal = foodInfo.parsed[0].food.nutrients.ENERC_KCAL
            let carb = foodInfo.parsed[0].food.nutrients.CHOCDF
            let prot = foodInfo.parsed[0].food.nutrients.PROCNT
            let fat = foodInfo.parsed[0].food.nutrients.FAT

            let kcCarb = carb*4
            let kcProt = prot*4
            let kcFat = fat*9
            let kcAlc = kcal - (kcCarb+kcProt+kcFat)      

            if(kcAlc>7){
                let alc = kcAlc/7

                if(locale==="en"){
                    results.innerHTML+=
                    (`<div class="grid">
                        <hgroup>
                            <h4>${kcal} kcal</h4>
                            <h6>Energy Value</h6>
                        </hgroup>
                        <hgroup>                
                            <h4 style="color: #f74b7b">${carb} g</h4>
                            <h6 style="color: #af9199">Carbohydrates</h6>
                        </hgroup>
                        <hgroup>                
                            <h4 style="color: #ffb725">${fat} g</h4>
                            <h6 style="color: #a4977e">Fats</h6>
                        </hgroup>
                        <hgroup>                
                            <h4 style="color: #4d7bf3">${prot} g</h4>
                            <h6 style="color: #9199ae">Proteins</h6>
                        </hgroup>
                        <hgroup>                
                            <h4>${alc.toFixed(2)} g</h4>
                            <h6>Alcohol</h6>
                        </hgroup>
                    </div>`)

                    results.innerHTML += "<h3 style='margin-top: 100px'>kcal % breakdown</h3>"
                }else if(locale==="es"){
                    results.innerHTML+=
                    (`<div class="grid">
                        <hgroup>
                            <h4>${kcal} kcal</h4>
                            <h6>Valor energético</h6>
                        </hgroup>
                        <hgroup>                
                            <h4 style="color: #f74b7b">${carb} g</h4>
                            <h6 style="color: #af9199">Carbohidratos</h6>
                        </hgroup>
                        <hgroup>                
                            <h4 style="color: #ffb725">${fat} g</h4>
                            <h6 style="color: #a4977e">Grasas</h6>
                        </hgroup>
                        <hgroup>                
                            <h4 style="color: #4d7bf3">${prot} g</h4>
                            <h6 style="color: #9199ae">Proteínas</h6>
                        </hgroup>
                        <hgroup>                
                            <h4>${alc.toFixed(2)} g</h4>
                            <h6>Alcohol</h6>
                        </hgroup>
                    </div>`)

                    results.innerHTML += "<h3 style='margin-top: 100px'>Desglose % kcal</h3>"
                }                

                let canvas = document.createElement("canvas");
                
                let tags = []

                if(locale==="en")
                    tags = ['Carbs', 'Fats', 'Prots', 'Alcohol']
                else if(locale==="es")
                    tags = ['Carbos', 'Grasas', 'Protes', 'Alcohol']
            
                new Chart(canvas, {
                    type: 'doughnut',
                    data: {
                    labels: tags,
                    datasets: [{
                        label: '%',
                        data: [(kcCarb/kcal)*100, (kcFat/kcal)*100, (kcProt/kcal)*100, (kcAlc/kcal)*100],
                        borderWidth: 1,
                        backgroundColor: ['#f74b7b', '#ffb725', '#4d7bf3', '#aaa']
                    }]
                    }
                })

                results.appendChild(canvas)
            }else{
                if(locale==="en"){
                    results.innerHTML+=
                    (`<div class="grid">
                        <hgroup>
                            <h4>${kcal} kcal</h4>
                            <h6>Energy Value</h6>
                        </hgroup>
                        <hgroup>                
                            <h4 style="color: #f74b7b">${carb} g</h4>
                            <h6 style="color: #af9199">Carbohydrates</h6>
                        </hgroup>
                        <hgroup>                
                            <h4 style="color: #ffb725">${fat} g</h4>
                            <h6 style="color: #a4977e">Fats</h6>
                        </hgroup>
                        <hgroup>                
                            <h4 style="color: #4d7bf3">${prot} g</h4>
                            <h6 style="color: #9199ae">Proteins</h6>
                        </hgroup>
                    </div>`)

                    results.innerHTML += "<h3 style='margin-top: 100px'>kcal % breakdown</h3>"
                }else if(locale==="es"){
                    results.innerHTML+=
                    (`<div class="grid">
                        <hgroup>
                            <h4>${kcal} kcal</h4>
                            <h6>Valor energético</h6>
                        </hgroup>
                        <hgroup>                
                            <h4 style="color: #f74b7b">${carb} g</h4>
                            <h6 style="color: #af9199">Carbohidratos</h6>
                        </hgroup>
                        <hgroup>                
                            <h4 style="color: #ffb725">${fat} g</h4>
                            <h6 style="color: #a4977e">Grasas</h6>
                        </hgroup>
                        <hgroup>                
                            <h4 style="color: #4d7bf3">${prot} g</h4>
                            <h6 style="color: #9199ae">Proteínas</h6>
                        </hgroup>
                    </div>`)

                    results.innerHTML += "<h3 style='margin-top: 100px'>Desglose % kcal</h3>"
                }   

                let canvas = document.createElement("canvas")
                
                let tags = []

                if(locale==="en")
                    tags = ['Carbs', 'Fats', 'Prots']
                else if(locale==="es")
                    tags = ['Carbos', 'Grasas', 'Protes']
            
                new Chart(canvas, {
                    type: 'doughnut',
                    data: {
                    labels: tags,
                    datasets: [{
                        label: '%',
                        data: [(kcCarb/kcal)*100, (kcFat/kcal)*100, (kcProt/kcal)*100],
                        borderWidth: 1,
                        backgroundColor: ['#f74b7b', '#ffb725', '#4d7bf3']
                    }]
                    }            
                })

                results.appendChild(canvas)
            }
        }catch(e){
            input.value = ""            
            if(locale==="en")
                results.innerHTML = "<h3> Food \"" +value +"\" not found.</h3>"
            else if(locale==="es")
                results.innerHTML = "<h3> Alimento \"" +esValue +"\" no encontrado.</h3>"
        }    
    }else{
        input.value = ""   
        if(locale==="en")
            results.innerHTML = "<h3>An error has occurred.</h3>"
        else if(locale==="es")
            results.innerHTML = "<h3>Se ha producido un error.</h3>"
    }

    if(locale==="en")
        btn.innerText = "Get nutrition data"
    else if(locale==="es")
        btn.innerText = "Mostrar la información"
    btn.removeAttribute('disabled','')
    btn.removeAttribute('aria-busy')
})

//Language code

let exceeded = "You have exceeded the MONTHLY quota for Characters on your current plan, BASIC. Upgrade your plan at https://rapidapi.com/googlecloud/api/google-translate1"

const defaultLocale = navigator.language.slice(0,2)

let locale

let translations = {}

document.addEventListener("DOMContentLoaded", () => {
    setLocale(defaultLocale)
    bindLocaleSwitcher(defaultLocale)
})

function translateElement(element){
    const key = element.getAttribute("data-i18n-key")
    const translation = translations[locale][key]
    element.innerText = translation
}

async function setLocale(newLocale){
    if(newLocale===locale) return
    const newTranslations = await fetchTranslationsFor(newLocale)
    locale = newLocale
    translations = newTranslations
    translatePage()
}

async function fetchTranslationsFor(newLocale){
    const response = await fetch(`/lang/${newLocale}.json`)
    return await response.json()
}

function translatePage(){
    document.querySelectorAll("[data-i18n-key]").forEach(translateElement)
}

function translateElement(element){
    const key = element.getAttribute("data-i18n-key")
    const translation = translations[key]
    element.innerText = translation
}

function bindLocaleSwitcher(initialValue){
    const switcher = document.getElementById("languages").children
    for(const sw of switcher){
        sw.addEventListener('click', () => {
            setLocale(sw.id)
            input.value = ""
            results.innerHTML = ""
        })
    }
}