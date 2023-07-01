import api from '/helper/Api.js'
import { HomePage } from '/helper/Templates.js'
import Observer from '/helper/Observer.js'

import DB from '/db.js';

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
                this.DB.homePage.delete(e.order)
                    .finally(() => {
                        btn.disabled = false
                    })
            })
        });
    }
    clear() { this.homePage.querySelectorAll('div').forEach(e => { e.innerHTML = '' }) }
}