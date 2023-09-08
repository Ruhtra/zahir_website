import Filter from '/profiles/Filter.js'
import api from '/helper/Api.js'
import { Profile } from '/helper/Templates.js'

export default class Profiles {
    constructor (base, disableInicialize) {
        this.base = base
        this.filter = new Filter( document.querySelector('#filter'), this.base, [] )
        if (!disableInicialize) this.build()
    }
    insert(data) {
        data.forEach(e => {
            this.base.insertAdjacentHTML("beforeend", Profile.card(e))

            this.base.querySelector(`#_${e._id}`).addEventListener('click', evt => {
                evt.preventDefault()
                
                location.href = '/profile?id='+e._id
            })
        });
    }
    clear() { this.base.querySelectorAll('.profiles').forEach(e => e.remove()) }

    async build(){
        this.clear()
        let data = await api.profile.getList()

        this.filter.setArray(data)
        this.insert(data)
        this.filter.filterMain()

        return data
    }
}