import api from '/helper/Api.js'
import { HomePage } from '/helper/Templates.js'
import Observer from '/helper/Observer.js'

import DB from '/db.js';

export default class HomePages  {
    constructor(homePage) {
        this.homePage = homePage
        this.obResponses = new Observer()
        this.DB = new DB(this.obResponses)


        // Load buttons
            this.homePage.querySelectorAll(`div.block`).forEach(e => {
                let btn = e.querySelector('button.delete')
                btn.addEventListener('click', (evt) => {
                    evt.preventDefault()

                    btn.disabled = true
                    this.DB.homePage.delete(e.id.split('_')[1])
                        .finally(() => {
                            btn.disabled = false
                        })
                })
            })
    }

    async build() {
        let response = await api.homePage.getAll()
        this.insert(response)
        return response
    }
    insert(data) {
        this.clear()
        data.forEach(e => {
            let block =  this.homePage.querySelector(`div#order_${e.order}`)
            block.querySelector('.item').innerHTML = HomePage.profile(e.profile)
            block.querySelector('.none').style.display = 'none'
            block.querySelector('.options').style.display = 'flex'
        });
    }
    clear() {
        this.homePage.querySelectorAll('.item').forEach(e => { e.innerHTML = '' })
        this.homePage.querySelectorAll('.none').forEach(e => {e.style.display = 'flex'})
        this.homePage.querySelectorAll('.options').forEach(e => {e.style.display = 'none'})
    }
}