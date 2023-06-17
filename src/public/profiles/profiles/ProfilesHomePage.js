import api from '/helper/api.js'
import validate from "/validator.js";
import { HomePage } from '/helper/Templates.js'
import Observer from '/helper/Observer.js'
import Profiles from '/profiles/profiles/Profiles.js'

class DB {
    constructor(obResponses) {
        this.obResponses = obResponses
    }
    async trycatch(fValidate, data, f) {
        try {
            const {error, value} = fValidate(data)
            if (error) throw error

            await f(value)
        } catch(err) {
            console.error(err)
        }
    }

    async insertDB(data) {
        await this.trycatch(validate.homePage.insert, data, async (value) => {
            console.log('Inserting...')
            this.obResponses.notify({type: 'insert', response: await api.homePage.insert(value)})
        })
    }
}


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
            this.DB.insertDB({
                id: data._id,
                order: profile.querySelector(`#_${data._id} input.insertOrd`).value || undefined
            }).finally(() => {
                btn.disabled = false
            })
        })
    }
}