import Profiles from '/profiles/profiles/Profiles.js'
import { Profile } from '/helper/Templates.js'

export default class ProfilesAdmin extends Profiles {
    constructor (base, screenFunctions) {
        super(base)
        this.base = base
        this.screenFunctions = screenFunctions
    }
    insert(data) {
        data.forEach(e => {
            this.base.insertAdjacentHTML("beforeend", Profile.cardAdmin(e))

            const btn = {
                open: this.base.querySelector(`#_${e._id} > input.openCard`),
                update: this.base.querySelector(`#_${e._id} > input.updateCard`),
                delete: this.base.querySelector(`#_${e._id} > input.deleteCard`)
            }
            
            // load buttons
            btn.open.addEventListener('click', evt => {
                evt.preventDefault()
                location.href = 'http://localhost:4000/profile?id='+e._id
            })
            btn.update.addEventListener('click', evt => {
                evt.preventDefault()
                this.screenFunctions.update(e._id, btn.update)
            })
            btn.delete.addEventListener('click', evt => {
                evt.preventDefault()
                this.screenFunctions.delete(e._id, btn.delete)
            })
        });
    }
}
