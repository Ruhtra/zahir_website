import Filter from '/profiles/Filter.js'
import api from '/helper/Api.js'
import { Profile } from '/helper/Templates.js'

export default class Profiles {
    constructor (base, disableInicialize) {
        this.base = base
        this.filter = new Filter( document.querySelector('#filter'), this.base, [] )
        if (!disableInicialize) this.build()
    }
    resultNull() {
        var screen = document.createElement('div')
        screen.innerHTML = 'Nada foi encontrado, tente redefinir as pesquisas!'
        this.base.appendChild(screen)
    }
    insert(data) {
        data.forEach(e => {
            this.base.insertAdjacentHTML("beforeend", Profile.card(e))

            this.base.querySelector(`#_${e._id} > input.openCard`).addEventListener('click', evt => {
                evt.preventDefault()
                
                location.href = '/profile?id='+e._id
            })
        });
    }
    clear() { this.base.querySelectorAll('.profiles').forEach(e => e.remove()) }

    async build(){
        this.clear()
        let data = await api.profile.getList()

        if (data.length == 0) return this.resultNull()

        this.filter.setArray(data)
        this.insert(data)
        this.filter.filterMain()

        return data
    }
}