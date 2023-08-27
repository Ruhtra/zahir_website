import Profiles from '/profiles/profiles/Profiles.js'
import { Profile } from '/helper/Templates.js'

export default class ProfilesAdmin extends Profiles {
    constructor (base, screenFunctions) {
        super(base)
        this.base = base
        this.screenFunctions = screenFunctions

    }
    insert(data) {
        this.base.insertAdjacentHTML("beforeend", Profile.addCard())

        data.forEach(e => {
            this.base.insertAdjacentHTML("beforeend", Profile.cardAdmin(e))

            const btn = {
                // open: this.base.querySelector(`#_${e._id} input.openCard`),
                update: this.base.querySelector(`#_${e._id} input.updateCard`),
                delete: this.base.querySelector(`#_${e._id} input.deleteCard`)
            }
            
            // load buttons
            this.base.querySelector(`#_${e._id}`).addEventListener('click', evt => {
                evt.preventDefault()
                location.href = '/profile?id='+e._id
            })
            btn.update.addEventListener('click', evt => {
                evt.preventDefault()
                this.screenFunctions.update(e._id, btn.update)
                evt.stopPropagation()
            })
            btn.delete.addEventListener('click', evt => {
                evt.preventDefault()
                this.screenFunctions.delete(e._id, btn.delete)
                evt.stopPropagation()
            })
            
        });

        this.base.querySelector('#insert').addEventListener('click', (evt) => {
            evt.preventDefault()
            this.screenFunctions.build()
        })
    }
}
