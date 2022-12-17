let mode = "dark"
if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){
    mode = "light"
    document.getElementById("slider").checked = true
}

const form = document.getElementById('form')
const input = document.getElementById('input')
const btn = document.getElementById('btn')
const results = document.getElementById('results')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const value = input.value
    if(!value) return

    btn.setAttribute('disabled','disabled')
    btn.setAttribute('aria-busy','true')
    btn.innerText = "Searching..."

    const foodInfo = await fetch('https://api.edamam.com/api/food-database/v2/parser?app_id=e7ec980c&app_key=e8facc8d7d04b8e6bf1793c3dc391aed&ingr='+value+'&nutrition-type=cooking')
                    .then(response => response.json())
                    .catch(err => console.error(err));

    if(foodInfo){ 
        try{    
            input.value = ""   
            results.innerHTML = ""
            results.innerHTML=('<h1>'+foodInfo.parsed[0].food.label+'</h1>')

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

                results.innerHTML += "<h3 style='margin-top: 100px;'>kcal % breakdown</h3>"

                let canvas = document.createElement("canvas")    
            
                new Chart(canvas, {
                    type: 'doughnut',
                    data: {
                    labels: ['Carbs', 'Fats', 'Prots', 'Alcohol'],
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

                results.innerHTML += "<h3 style='margin-top: 100px;'>kcal % breakdown</h3>"

                let canvas = document.createElement("canvas")    
            
                new Chart(canvas, {
                    type: 'doughnut',
                    data: {
                    labels: ['Carbs', 'Fats', 'Prots'],
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
            results.innerHTML = "<h3> Food \"" +value +"\" not found.</h3>"
        }    
    }else{
        input.value = ""   
        results.innerHTML = "<h3>An error has occurred.</h3>"
    }

    btn.innerText = "Get nutrition data"
    btn.removeAttribute('disabled','')
    btn.removeAttribute('aria-busy')
})

function toggleTheme(){
    if(mode==="dark"){
        document.body.parentNode.setAttribute("data-theme","light")
        mode = "light"
    }else if(mode==="light"){
        document.body.parentNode.setAttribute("data-theme","dark")
        mode = "dark"
    }
}