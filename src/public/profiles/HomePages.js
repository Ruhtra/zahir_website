import api from '/helper/Api.js'
import { HomePage } from '/helper/Templates.js'
import Observer from '/helper/Observer.js'

import DB from '/db.js';

export default class HomePages  {
    constructor(homePage) {
        this.homePage = homePage
        this.obResponses = new Observer()
        this.DB = new DB(this.obResponses)

        this.id_inserted_wait


        // Load buttons
            this.homePage.querySelectorAll(`div.block`).forEach(e => {
                let btn = e.querySelector('button.delete')
                btn.addEventListener('click', (evt) => {
                    evt.preventDefault()
                    if (this.id_inserted_wait != undefined) return console.log('Aba de adicioanr aberta, feche para deletar')

                    btn.disabled = true
                    this.DB.homePage.delete(e.id.split('_')[1])
                        .finally(() => {
                            btn.disabled = false
                        })
                })
            })
            this.homePage.querySelectorAll(`div.block`).forEach(e => {
                let btn  = e.querySelector('button.add')
                btn.addEventListener('click', (evt) => {
                    evt.preventDefault()
                    if (this.id_inserted_wait == undefined) return console.log('id inexistente')
                    btn.disabled = true

                    let position = e.id.split('_')[1]
                    this.DB.homePage.insert({
                        id: this.id_inserted_wait,
                        order: position
                    }).finally(() => {
                        btn.disabled = false
                        this.clearWaitPosition();
                        this.obResponses.notify({type: 'endWaitPosition', response: {}})
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
            block.classList.add('active')
            block.querySelector('.none').style.display = 'none'
            block.querySelector('.options .delete').style.display = 'flex'
            block.querySelector('.options .add').style.display = 'none'
            block.querySelector('.options .add').style.opacity = 0
        });
    }
    clear() {
        this.homePage.querySelectorAll('div.block').forEach(e => { e.classList.remove('active') })
        this.homePage.querySelectorAll('.item').forEach(e => { e.innerHTML = '' })
        this.homePage.querySelectorAll('.none').forEach(e => {e.style.display = 'flex'})
        this.homePage.querySelectorAll('.options .delete').forEach(e => {e.style.display = 'none'})
        this.homePage.querySelectorAll('.options .add').forEach(e => {e.style.display = 'none'})
        this.homePage.querySelectorAll('.options .add').forEach(e => {e.style.oapcity = 0})
    }


    shinePositions() {
        let voids = this.homePage.querySelectorAll('div.block:not(.active)')
        voids.forEach(e => {
            e.querySelector('.none').style.display = 'none'
            e.querySelector('.add').style.display = 'flex'
            e.querySelector('.add').style.opacity = 1
            e.classList.add('shine')
        })
    }
    hideShinePositions(){
        let voids = this.homePage.querySelectorAll('div.block.shine')
        voids.forEach(e => {
            e.querySelector('.none').style.display = 'flex'
            e.querySelector('.add').style.display = 'none'
            e.querySelector('.add').style.opacity = 0
            e.classList.remove('shine')}
        )
    }

    createWaitPosition(id) {
        if (this.id_inserted_wait != undefined) return console.log('id ja foi setado')
        this.shinePositions()
        this.id_inserted_wait = id
    }
    clearWaitPosition() {
        this.hideShinePositions()
        this.id_inserted_wait = undefined
    }
}