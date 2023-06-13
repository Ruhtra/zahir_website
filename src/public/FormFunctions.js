import Joi from 'https://cdn.jsdelivr.net/npm/joi@17.9.2/+esm'
import validate from '/validator.js'
import f from '/functions.js'
import Api from '/api.js'

import Observer from '/Observer.js'

/*
    Desacoplar todo o código 

    Error precisando ser tradados de forma de disparada quando houver um erro
    clears precisam ser disparados dinamicamente sem chamada "direto" da aplicação
    Isto é, caso a class seja Error seja deletada, ela apenas não notificará erros pro usuário

    
    Function retirada de telephone functions dentro da this, o método só será acesado dentro dessa página
    Vale tambem para category

    Funções relacionadas a telefones e category apenas como módulo de inicialização dentro Form
    

    Verificar se existe um jeito melhor de notificar alteraçãos via js do que usando o change
    Pois quando muda valor via .value, O change event não é disparado (gpt deu um help, da uma olahda la depois)
*/


class ErrorsFunctions {
    constructor(form) {
        this.form = form
    }
    start() {
        // Clear error when changes
        this.form.querySelectorAll('input, select, textarea').forEach(e => {
            e.addEventListener('change', () => {
                this.clear(e.parentElement)
            })
        })
    }
    clear(element) {
        if (element) {
            let err = element.querySelector('span.error')
            if (err) err.remove()
            return
        }

        this.form.querySelectorAll('span.error').forEach(e => {
            e.remove()
        })
        
    }
    insert(path, msg) {
        var element = path[0] == 'telephones'
            ? this.form.querySelectorAll(`#telephones .${path[1]}`)[path[2]]
            : this.form.querySelector(`#${path.join(' #')}`)

        this.clear(element)
        element.insertAdjacentHTML("beforeend", `<span class="error">${msg}</span>`);
    }
}

class Functions {
    constructor(form) {
        this.form = form

        this.telephoneFunctions = new TelephoneFunctions(form.querySelector('#telephones'))
        new CategoryFunctions(form.querySelector('#category'))
        new LocalFunctions(form.querySelector('#local'))
    }
    get = {
        id: () => this.form.querySelector('#id input'),
        picture: () => this.form.querySelector('#picture input'),
        name: () => this.form.querySelector('#name input'),
        resume: () => this.form.querySelector('#resume textarea'),
        category: {
            type: () => this.form.querySelector('#category select'),
            categories: () => [ ... this.form.querySelectorAll('#category #categories .item input[type="checkbox"]') ],
            newCategories: () => [ ... this.form.querySelectorAll('#category #newCategories .item input[type="checkbox"]') ],
            newCategorieText: () => this.form.querySelector('#category #newCategories #new input')
        },
        informations: () => this.form.querySelector('#informations textarea'),
        telephones: {
            telephone: () => [ ... this.form.querySelectorAll('div#telephones .telephone input[type="text"]') ],
            whatsapp: () => [ ... this.form.querySelectorAll('div#telephones .whatsapp input[type="text"]') ]
        },
        local: {
            cep: () => this.form.querySelector('#local #cep input'),
            uf: () => this.form.querySelector('#local #uf select'),
            city: () => this.form.querySelector('#local #city input'),
            neighborhood: () => this.form.querySelector('#local #neighborhood input'),
            street: () => this.form.querySelector('#local #street input'),
            number: () => this.form.querySelector('#local #number input'),
            complement: () => this.form.querySelector('#local #complement textarea'),
        },
        movie: () => this.form.querySelector('#movie input'),
        promotion: () => this.form.querySelector("#promotion select") 
    }

    getDataInsert() {
        let data = {
            picture: this.get.picture().value,
            name: this.get.name().value,
            resume: this.get.resume().value,
            category: {
                type: this.get.category.type().value
            },
            informations: this.get.informations().value,
            telephones: {
                telephone: this.get.telephones.telephone().map(e => '+55'+e.value.replace(/\D/g, '')),
                whatsapp: this.get.telephones.whatsapp().map(e => '+55'+e.value.replace(/\D/g, ''))
            },
            local: {
                cep: this.get.local.cep().value.replace(/\D/g, ''),
                uf: this.get.local.uf().value,
                city: this.get.local.city().value,
                neighborhood: this.get.local.neighborhood().value,
                street: this.get.local.street().value,
                number: this.get.local.number().value,
                complement: this.get.local.complement().value,
            },
            movie: this.get.movie().value,
            promotion: this.get.promotion().value
        }
        if (data.category.type == 'restaurante') data.category['categories'] = [ ... this.form.querySelectorAll('#category #categories input:checked') ].map(e => e.getAttribute('name'))
        if (data.category.type == 'restaurante') data.category['newCategories'] = [ ... this.form.querySelectorAll('#category #newCategories input:checked') ].map(e => e.getAttribute('name'))

        return f.removeEmptyValues(data)
    }
    getDataUpdate() {
        let data = {
            id: this.get.id().value,
            picture: this.get.picture().value,
            name: this.get.name().value,
            resume: this.get.resume().value,
            category: {
                type: this.get.category.type().value
            },
            informations: this.get.informations().value,
            telephones: {
                telephone: this.get.telephones.telephone().map(e => '+55'+e.value.replace(/\D/g, '')),
                whatsapp: this.get.telephones.whatsapp().map(e => '+55'+e.value.replace(/\D/g, ''))
            },
            local: {
                cep: this.get.local.cep().value.replace(/\D/g, ''),
                uf: this.get.local.uf().value,
                city: this.get.local.city().value,
                neighborhood: this.get.local.neighborhood().value,
                street: this.get.local.street().value,
                number: this.get.local.number().value,
                complement: this.get.local.complement().value,
            },
            movie: this.get.movie().value,
            promotion: this.get.promotion().value
        }
        if (data.category.type == 'restaurante') data.category['categories'] = [ ... this.form.querySelectorAll('#category #categories input:checked') ].map(e => e.getAttribute('name'))
        if (data.category.type == 'restaurante') data.category['newCategories'] = [ ... this.form.querySelectorAll('#category #newCategories input:checked') ].map(e => e.getAttribute('name'))

        return f.removeEmptyValues(data)
    }

    set(data) {
        console.log(data);
        this.clear()
        if (data._id) this.get.id().value = data._id
        // picture: this.form.querySelector('#picture input').value,
        this.get.name().value = data.name
        if (data.resume) this.get.resume().value = data.resume
        if (data.informations) this.get.informations().value = data.informations
        
        // Category
        this.get.category.type().value = data.category.type
        this.get.category.type().dispatchEvent(new Event('change'))

        if (data.category.categories) {
            data.category.categories.forEach(e => {
                this.form.querySelector(`#category #categories #${e} input`).checked = true
            })
        }

        // Telephones
        data.telephones.telephone.forEach(e => {
            this.telephoneFunctions.addTelephone(e.slice(3))
        })
        data.telephones.whatsapp.forEach(e => {
            this.telephoneFunctions.addWhatsapp(e.slice(3))
        })

        // Local
        this.get.local.cep().value = data.local.cep
        this.get.local.uf().value = data.local.uf
        this.get.local.city().value = data.local.city
        this.get.local.neighborhood().value = data.local.neighborhood
        this.get.local.street().value = data.local.street
        this.get.local.number().value = data.local.number
        if (data.local.complement)this.get.local.complement().value = data.local.complement

        if (data.movie)this.get.movie().value = data.movie
        if (data.promotion) {
            let idPromotion = this.form.querySelector(`#promotion option[html="${data.promotion}"]`).value
            this.get.promotion().value = idPromotion
        }
    }
    new() {
        errorsFunctions.clear()
        this.clear()
    }
    clear() {
        this.get.id().value = ''
        this.get.name().value = ''
        this.get.resume().value = ''
        this.get.category.type().value = 'restaurante'
        this.get.category.type().dispatchEvent(new Event('change'))

        this.get.category.categories().forEach(e => {
            e.checked = false
        })
        
        this.get.category.newCategories().forEach(e => {
            e.parentElement.remove()
        })
        this.get.category.newCategorieText.value = ''

        this.get.informations().value = ''
        this.get.telephones.telephone().forEach(e => {
            e.parentElement.remove()
        })
        this.get.telephones.whatsapp().forEach(e => {
            e.parentElement.remove()
        })
        this.get.local.cep().value = ''
        this.get.local.uf().value = ''
        this.get.local.city().value = ''
        this.get.local.neighborhood().value = ''
        this.get.local.street().value = ''
        this.get.local.number().value = ''
        this.get.local.complement().value = ''

        
        this.get.movie().value = ''
        this.get.promotion().value = ''
    }    
}
class TelephoneFunctions  {
    constructor(form) {
        form.querySelector('#insert [value="whatsapp"]').addEventListener('click', () => this.addWhatsapp())
        form.querySelector('#insert [value="telephone"]').addEventListener('click', () => this.addTelephone())


        this.form = form
        this.getTemp = (name) => `<div class="${name}">
            <label for="${name}">${name.charAt(0).toUpperCase() + name.slice(1)}:</label>
            <input type="text" maxlength="16">
            <input type="button" name="delete" value="delete">
        </div>`
    }
    addTelephone(value) {
        this.form.insertAdjacentHTML("beforeend", this.getTemp('telephone'));
        let element = [ ... this.form.querySelectorAll('.telephone')].slice(-1)[0]

        if (value) {
            let input = element.querySelector('input[type="text"]')
            input.value = value
            this.mask(input)
        }
        obInputInserted.notify(element)

        element.addEventListener('keyup', () => this.mask(element.querySelector('input[type="text"]')))
        element.querySelector('input[name="delete"]').addEventListener('click', () => this.delete(element))
    }
    addWhatsapp(value) {
        this.form.insertAdjacentHTML("beforeend", this.getTemp('whatsapp'));
        let element = [ ... this.form.querySelectorAll('.whatsapp')].slice(-1)[0]

        if (value) {
            let input = element.querySelector('input[type="text"]')
            input.value = value
            this.mask(input)
        }
        obInputInserted.notify(element)

        element.addEventListener('keyup', () => this.mask(element.querySelector('input[type="text"]')))
        element.querySelector('input[name="delete"]').addEventListener('click', () => this.delete(element))
    }
    delete(element) { element.remove() }
    mask (e) {
        let t = e.value
        t = t.replace(/\D/g,"")
        t = t.replace(/(\d{0})(\d)/, "$1($2")
        t = t.replace(/(\d{2})(\d)/, "$1) $2")
        t = t.replace(/(\d{2})\)\s(\d{1})(\d)/, "$1) $2 $3")
        t = t.replace(/(\d{2})\)\s(\d{1})\s(\d{4})(\d)/, "$1) $2 $3-$4")
        t = t.replace(/(\(\d{2}\)\s\d{1}\s\d{4}\-\d{4})(\d)/, "$1")
        e.value = t
    }
}
class CategoryFunctions {
    constructor (form) {
        this.type = form.querySelector('#type')
        this.categories = form.querySelector('#categories')
        this.newCategories = form.querySelector('#newCategories')

        // Set button
        this.type.addEventListener('change', (evt) => {
            evt.preventDefault()
            this.changeType()
        })
        this.newCategories.querySelector('#new input').addEventListener('change', (evt) => {
            evt.preventDefault()
            this.createCategorie()
        })
    }
    createCategorie() {
        let name = this.newCategories.querySelector('#new input').value
        this.newCategories.querySelector('#new input').value = ''

        let template = `<div id="${name}" class="item">
            <label for="cb_${name}">${name}</label>
            <input id="cb_${name}" type="checkbox" name="${name}" checked>
        </div>`

        this.newCategories.insertAdjacentHTML('beforeend', template)
    }
    changeType() {
        if (this.type.value == 'restaurante') this.categories.style.display = 'block'
        else this.categories.style.display = 'none'
    }
}
class LocalFunctions {
    constructor(form) {
        let input = form.querySelector('#cep input[type="text"]')
        input.addEventListener('keyup', () => this.mask(input))
    }
    mask (e) {
        let t = e.value
        t = t.replace(/\D/g,"")
        t = t.replace(/(\d{5})(\d)/, "$1-$2")
        t = t.replace(/(\d{5}\-\d{3})(\d)/, "$1")
        e.value = t
    }
}


class Form {
    constructor(form) {
        this.form = form
        errorsFunctions.start()
        this.functions = new Functions( form, this.telephoneFunctions )

        this.obResponses = new Observer()

        // Starter button
        this.form.querySelector('input[type=button]#insert').addEventListener('click', (evt) => {
            evt.preventDefault()
            this.insertBd()
        })
        this.form.querySelector('input[type=button]#update').addEventListener('click', (evt) => {
            evt.preventDefault()
            this.updateBd()
        })
    }
    trycatch(fValidate, data, f) {
        try {
            const {error, value} = fValidate(data)
            if (error) throw error

            f(value)
        } catch(err) {
            if (err instanceof Joi.ValidationError) return obErrorElement.notify(err.details)
            console.error(err)
        }
    }

    insertBd() {
        let data = this.functions.getDataInsert()
        this.trycatch(validate.profile.insert, data, async (value) => {
            console.log('inserting...')
            this.obResponses.notify({type: 'insert', response: await api.profile.insert(value)})
        })
    }
    updateBd() {
        let data = this.functions.getDataUpdate()
        this.trycatch(validate.profile.update, data, async (value) => {
            console.log('updating...')
            this.obResponses.notify({type: 'update', response: await api.profile.update(value)})
        })
    }
    deleteBd(id) {
        let data = id
        this.trycatch(validate.profile.id, data, async (value) => {
            console.log('deleting...')
            this.obResponses.notify({type: 'delete', response: await api.profile.delete({id: value})})
        })
    }
}


const errorsFunctions =  new ErrorsFunctions(document.querySelector('#form'))
const api = new Api()

// Observers
const obInputInserted = new Observer()
const obErrorElement = new Observer()

obInputInserted.subscribe((element) => {
    element.addEventListener('change', () => errorsFunctions.clear(element))
})
obErrorElement.subscribe((data) => {
    errorsFunctions.clear()
    data.forEach(e => {
        errorsFunctions.insert(e.path, e.message)
    })
})

export default Form