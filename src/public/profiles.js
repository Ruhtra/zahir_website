import Notifications from '/helper/Notifications.js'
import api from '/helper/Api.js'

import Form from '/profiles/Form.js'
import ProfilesAdmin from '/profiles/profiles/ProfilesAdmin.js'

class LoadingFunctions {
    constructor(base) {
        this.base = base
    }
    show() { this.base.style.display = 'block' }
    hide() { this.base.style.display = 'none' }
}

class ScreenFunctions { 
    constructor(base) {
        this.base = base

        this.form = new Form(this.base.querySelector('#form'))
        this.loading = new LoadingFunctions(this.base.querySelector('#loading'))
        this.message = new Notifications(document.querySelector('#notifications'))

        this.form.obResponses.subscribe((obj) => {
            switch (obj.type) {
                case 'insert': {}
                    this.message.insert('Inserido com sucesso')
                    break;
                case 'update':
                    this.message.insert('Atualizado com sucesso')
                    break;
                case 'delete':
                    this.message.insert('Deletado com sucesso')
                    break;
            }

            tableFunctions.filter.buildCategories()
            tableFunctions.build()
            this.hide()
        })

        // load buttons 
        this.base.querySelector(`input.close`).addEventListener('click', evt => {
            evt.preventDefault()
            this.hide()
        })
        document.querySelector('#insert').addEventListener('click', (evt) => {
            evt.preventDefault()
            this.build()
        })
    }
    async build(id) {
        this.show()
        this.loading.show()
        await this.form.functions.new()

        if (id) {
            let data = await api.profile.get(id)

            data = data[0]
            data._id = id
            this.form.functions.new(data)
        }
        this.loading.hide()
    }
    
    insert() { this.build() }
    update(id, btn) {
        btn.disabled = true
        this.build(id)
            .finally(() => {
                btn.disabled = false
            })
    }
    delete(id, btn) {
        btn.disabled = true
        this.form.db.profile.delete(id)
            .finally(() => {
                btn.disabled = false
            })
    }

    show() { this.base.style.display = 'block' }
    hide() { this.base.style.display = 'none' }
}

// items
const eScreen = document.querySelector('div#screen')
const eProfiles = document.querySelector('div#profiles')

// classes
const tableFunctions = new ProfilesAdmin(eProfiles, new ScreenFunctions( eScreen ))