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
        data.forEach(e => {
            let card = `<div id="_${e._id}"} >
                <input class="openCard" type="button" value="Abrir"> <br>
                <input class="updateCard" type="button" value="Update"> <br>

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
}