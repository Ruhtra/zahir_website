import { HomePage } from '/helper/Templates.js'
import Observer from '/helper/Observer.js'
import Profiles from '/profiles/profiles/Profiles.js'

import DB from '/db.js';


export default class ProfilesHomePage extends Profiles {
    constructor(base) {
        super(base, true)
        this.base = base
        this.obResponses = new Observer()
        this.DB = new DB(this.obResponses)
    }
    insertBtn(data) {
        const profile = this.base.querySelector(`#_${data._id}`)
        profile.insertAdjacentHTML('beforeend', HomePage.btns())

        // Load buttons
        let btn = profile.querySelector(` input.insertCard`)
        btn.addEventListener('click', evt => {
            evt.preventDefault()

            btn.disabled = true
            this.DB.homePage.insert({
                id: data._id,
                order: profile.querySelector(`#_${data._id} input.insertOrd`).value || undefined
            }).finally(() => {
                btn.disabled = false
            })
        })
    }
}