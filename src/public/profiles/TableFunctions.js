import FilterFunctions from './FilterFunctions.js'

class api {
    async getList() {
        return (await fetch('http://localhost:4000/api/profile/getList')).json()
    }
}

export default class TableFunctions extends api {
    constructor (base) {
        super()
        this.base = base

        this.filterfunction = new FilterFunctions(
            document.querySelector('#filter'),
            this.base,
            []
        )

        this.build()
    }
    resultNull() {
        var screen = document.createElement('div')
        screen.innerHTML = 'Nada foi encontrado, tente redefinir as pesquisas!'
        this.base.appendChild(screen)
    }
    insert(data) {
        data.forEach(e => {
            let card = `<div id="_${e._id}" class="profiles" >
                <input class="openCard" type="button" value="Abrir"> <br>

                _id: ${e._id}, <br>
                name: ${e.name}, <br>
                picture: ${e.picture}, <br>
                promotion: ${e.promotion}, <br>
                uf: ${e.uf}, <br>
                category: {<br>
                    &nbsp;&nbsp; type: ${e.category.type}, <br>
                    &nbsp;&nbsp; categories: ${e.category.categories} <br>
                }
            </div>`
            this.base.insertAdjacentHTML("beforeend", card)

            this.base.querySelector(`#_${e._id} > input.openCard`).addEventListener('click', evt => {
                evt.preventDefault()
                
                location.href = 'http://localhost:4000/profile?id='+e._id
            })
        });
    }
    clear() {
        this.base.querySelectorAll('.profiles').forEach(e => {
            e.remove()
        })  
    }

    build(){
        this.clear()
        this.getList()
            .then((data) => {
                if (data.length == 0) return this.resultNull()

                this.filterfunction.setArray(data)
                this.insert(data)
                this.filterfunction.filterMain()
            })
            .catch((err) => { console.log(err) })
    }
}