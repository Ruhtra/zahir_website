import api from '/helper/api.js'
import validate from "/validator.js";
import { HomePage } from '/helper/Templates.js'
import Observer from '/helper/Observer.js'

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

    async deleteDB(order) {
        await this.trycatch(validate.homePage.order, order, async (value) => {
            console.log('Deleting...')
            this.obResponses.notify({type: 'delete', response: await api.homePage.delete({order: value})})
        })
    }
}

export default class HomePages  {
    constructor(homePage) {
        this.homePage = homePage
        this.obResponses = new Observer()
        this.DB = new DB(this.obResponses)
    }

    async build() {
        let response = await api.homePage.getAll()
        this.insert(response)
        return response
    }
    insert(data) {
        this.clear()
        data.forEach(e => {
            this.homePage.querySelector('div#order_'+e.order).innerHTML = HomePage.profile(e.profile)

            // Load buttons
            let btn = this.homePage.querySelector(`div#order_${e.order} input.delete`)
            btn.addEventListener('click', (evt) => {
                evt.preventDefault()

                btn.disabled = true
                this.DB.deleteDB(e.order)
                    .finally(() => {
                        btn.disabled = false
                    })
            })
        });
    }
    clear() { this.homePage.querySelectorAll('div').forEach(e => { e.innerHTML = '' }) }
}