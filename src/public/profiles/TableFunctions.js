export default class TableFunctions {
    constructor (base) {
        this.base = base
    }
    resultNull() {
        var screen = document.createElement('div')
        screen.innerHTML = 'Nada foi encontrado, tente redefinir as pesquisas!'
        this.base.appendChild(screen)
    }
    insert(data) {
        let card = `<div id="_${data._id}"} >
            <input class="openCard" type="button" value="Abrir"> <br>

            _id: ${data._id}, <br>
            name: ${data.name}, <br>
            picture: ${data.picture}, <br>
            promotion: ${data.promotion}, <br>
            uf: ${data.uf}, <br>
            category: {<br>
                &nbsp;&nbsp; type: ${data.category.type}, <br>
                &nbsp;&nbsp; categories: ${data.category.categories} <br>
            }
        </div>`
        this.base.insertAdjacentHTML("beforeend", card)

        this.base.querySelector(`#_${data._id} > input.openCard`).addEventListener('click', e => {
            e.preventDefault()

            location.href = 'http://localhost:4000/profile?id='+data._id
        })
    }
}