import f from '/helper/functions.js'
import api from '/helper/api.js'
import { Filter } from '/helper/Templates.js'

import Observer from '/helper/Observer.js'

import DB from '/db.js'


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
        element.insertAdjacentHTML("beforeend", Filter.error(msg) );
    }
}

class TelephoneFunctions  {
    constructor(baseTelephone) {
        this.baseTelephone = baseTelephone

        // Build buttons
        this.baseTelephone.querySelector('#insert [value="whatsapp"]').addEventListener('click', () => this.add.whatsapp())
        this.baseTelephone.querySelector('#insert [value="telephone"]').addEventListener('click', () => this.add.telephone())
    }
    addMain(type, value) {
        if (!type) throw new Error('The type parameter must be passed')
        type = type.trim().toLowerCase()
        if (!['telephone', 'whatsapp'].includes(type)) throw new Error('Type passed must be "telephone" or "whatsapp"')

        this.baseTelephone.insertAdjacentHTML("beforeend", Filter.telephone(type));
        let element = [ ... this.baseTelephone.querySelectorAll('.'+type)].slice(-1)[0]

        if (value) {
            let input = element.querySelector('input[type="text"]')
            input.value = value
            this.mask(input)
        }
        obInputInserted.notify(element) // Rever essa linha de código

        element.addEventListener('keyup', () => this.mask(element.querySelector('input[type="text"]')))
        element.querySelector('input[name="delete"]').addEventListener('click', () => this.delete(element))
    }
    add = {
        telephone: (value) => this.addMain('telephone', value),
        whatsapp: (value) => this.addMain('whatsapp', value)
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
    constructor (base) {
        this.type = base.querySelector('#type')
        this.categories = base.querySelector('#categories')
        this.newCategories = base.querySelector('#newCategories')

        // Build buttons
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
        let input = this.newCategories.querySelector('#new input')

        let name = input.value
        input.value = ''

        this.newCategories.insertAdjacentHTML('beforeend', Filter.categorie(name))
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
        promotion: () => this.form.querySelector("#promotion select"),
        promotionOption: (name) => this.form.querySelector(`#promotion select option[html="${name}"]`)
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
            this.telephoneFunctions.add.telephone(e.slice(3))
        })
        data.telephones.whatsapp.forEach(e => {
            this.telephoneFunctions.add.whatsapp(e.slice(3))
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
            let idPromotion = this.get.promotionOption(data.promotion).value
            this.get.promotion().value = idPromotion
        }
    }
    async new(data) {
        errorsFunctions.clear()
        this.clear()

        await this.build()
        if(data) this.set(data)
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

    build() { return Promise.all([this.buildCategories(), this.buildPromotions()]) }
    async buildCategories() {
        let base = this.form.querySelector('#categories')
        base.innerHTML = '' //clear

        let data = await api.categories.getAll()
        data.forEach(e => {
            base.insertAdjacentHTML('beforeend', Filter.build.categories(e))
        })
    }
    async buildPromotions() {
        let base = this.form.querySelector('#promotion select')
        base.innerHTML = '<option value="" selected>None</option>' //clear

        let data = await api.promotions.getAll()
        data.forEach(e => {
            base.insertAdjacentHTML('beforeend', Filter.build.promotions(e))
        })
    }
}
class Form {
    constructor(form) {
        errorsFunctions.start()
        this.form = form
        this.functions = new Functions( form, this.telephoneFunctions )

        this.obResponses = new Observer()
        this.db = new DB(this.obResponses, obErrors)

        const btn = {
            insert: this.form.querySelector('input[type=button]#insert'),
            update: this.form.querySelector('input[type=button]#update')
        }

        // Starter button
        btn.insert.addEventListener('click', (evt) => {
            evt.preventDefault()
            btn.insert.disabled = true

            let data = this.functions.getDataInsert()
            this.db.profile.insert(data)
                .finally(() => {
                    btn.insert.disabled = false
                })
        })
        btn.update.addEventListener('click', (evt) => {
            evt.preventDefault()
            btn.update.disabled = true

            let data = this.functions.getDataUpdate()
            this.db.profile.update(data)
                .finally(() => {
                    btn.update.disabled = false
                })
        })
    }
}


const errorsFunctions =  new ErrorsFunctions(document.querySelector('#form'))

// Observers
const obInputInserted = new Observer()
const obErrors = new Observer()

obInputInserted.subscribe((element) => {
    element.addEventListener('change', () => errorsFunctions.clear(element))
})
obErrors.subscribe((data) => {
    errorsFunctions.clear()
    data.forEach(e => {
        errorsFunctions.insert(e.path, e.message)
    })
})

export default Form