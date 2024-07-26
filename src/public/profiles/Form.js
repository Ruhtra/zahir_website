import f from '/helper/functions.js'
import api from '/helper/Api.js'
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
                this.clear(e)
            })
        })
    }
    clear(element) {
        if (element) {
            element.classList.remove('error')
            return
        }
        this.form.querySelectorAll('.error').forEach(e => {
            e.classList.remove('error')
        })
        
    }
    insert(path, msg) {
        var element = path[0] == 'telephones'
            ? this.form.querySelectorAll(`#telephones .${path[1]}`)[path[2]]
            : this.form.querySelector(`#${path.join(' #')}`)

        console.log(path, msg)
        let input = element.querySelector('input, select, textarea')
    input.classList.add('error')
    }
}

class TelephoneFunctions  {
    constructor(baseTelephone) {
        this.baseTelephone = baseTelephone

        // Build buttons
        this.baseTelephone.querySelector('.insert-cell [value="whatsapp"]').addEventListener('click', () => this.add.whatsapp())
        this.baseTelephone.querySelector('.insert-cell [value="telephone"]').addEventListener('click', () => this.add.telephone())
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
        if (this.type.value == 'restaurante') {
            this.categories.style.display = 'flex'
            this.newCategories.style.display = 'flex'
        }
        else {
            this.categories.style.display = 'none'
            this.newCategories.style.display = 'none'
        }
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
class ImageFunctions {
    constructor(base) {
        this.base = base
        // this.apiUploadController = new ApiUploadController('/api/uploads/upload', this.base.querySelector('.uploading'))

        this.elements = {
            img: this.base.querySelector('img'),
            input: this.base.querySelector('input#in_picture'),
            span: {
                select: this.base.querySelector('.select'),
                insert: this.base.querySelector('.new')
            },
            options: this.base.querySelector('.options')
        }
        this.btns = {
            clear: this.base.querySelector('.options .clear')
        }

        //Starting button
        this.elements.input.addEventListener('change', evt => {
            const [file] = evt.target.files
            if (file) return this.insertImg(file)
            this.clearImg()
        })
        // this.btns.clear.addEventListener('click', (evt) => {
        //     evt.preventDefault()
        //     this.clearImg()
        // })
    }
    insertImg(file) {
        this.elements.img.src = URL.createObjectURL(file)
        this.elements.img.onload = () => {
            URL.revokeObjectURL(this.elements.img.src) // free memory
        }
    }
    clearImg() { this.elements.img.src = "#" }
}


class Functions {
    constructor(form) {
        this.form = form

        this.telephoneFunctions = new TelephoneFunctions(form.querySelector('#telephones'))
        new CategoryFunctions(form.querySelector('#category'))
        new LocalFunctions(form.querySelector('#local'))
        new ImageFunctions(document.querySelector('#picture'))
    }
    get = {
        id: () => this.form.querySelector('#id input'),
        picture: () => this.form.querySelector('#picture input[type="file"]'),
        picturePreview: () => this.form.querySelector('#picture img'),
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
        promotion: {
            active: () => this.form.querySelector("#promotion #active input"),
            title: () => this.form.querySelector("#promotion #title input"),
            description: () => this.form.querySelector("#promotion #description textarea")
        },
    }

    getDataInsert() {
        let file = this.get.picture().files[0]
        let data = {
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
            promotion: {
                active: this.get.promotion.active().checked,
                title: this.get.promotion.title().value,
                description: this.get.promotion.description().value
            }
        }
        
        if (Object.values(data.local).every(value => !value)) {
            delete data.local;
        }
        if (data.category.type == 'restaurante') data.category['categories'] = [ ... this.form.querySelectorAll('#category #categories input:checked') ].map(e => e.getAttribute('name'))
        if (data.category.type == 'restaurante') data.category['newCategories'] = [ ... this.form.querySelectorAll('#category #newCategories input:checked') ].map(e => e.getAttribute('name'))

        return {
            data: f.removeEmptyValues(data),
            file: file
        }
    }
    getDataUpdate() {
        let file = this.get.picture().files[0]
        let data = {
            id: this.get.id().value,
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
            promotion: {
                active: this.get.promotion.active().checked,
                title: this.get.promotion.title().value,
                description: this.get.promotion.description().value
            }
        }

        if (Object.values(data.local).every(value => !value)) {
            delete data.local;
        }
        if (data.category.type == 'restaurante') data.category['categories'] = [ ... this.form.querySelectorAll('#category #categories input:checked') ].map(e => e.getAttribute('name'))
        if (data.category.type == 'restaurante') data.category['newCategories'] = [ ... this.form.querySelectorAll('#category #newCategories input:checked') ].map(e => e.getAttribute('name'))

        return {
            data: f.removeEmptyValues(data),
            file: file
        }
    }

    set(data) {
        if (data._id) this.get.id().value = data._id
        if (data.picture) this.get.picturePreview().src = data.picture // funciona
        // if (data.picture) this.get.pictureName().dispatchEvent(new Event('change'))
        this.get.name().value = data.name
        if (data.resume) this.get.resume().value = data.resume
        if (data.informations) this.get.informations().value = data.informations
        
        // Category
        this.get.category.type().value = data.category.type
        this.get.category.type().dispatchEvent(new Event('change'))

        if (data.category.categories) {
            data.category.categories.forEach(e => {
                this.form.querySelector(`#category #categories div[name="${e}"] input`).checked = true
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
        if (data.local) {
            this.get.local.cep().value = data.local.cep
            this.get.local.uf().value = data.local.uf
            this.get.local.city().value = data.local.city
            this.get.local.neighborhood().value = data.local.neighborhood
            this.get.local.street().value = data.local.street
            this.get.local.number().value = data.local.number
            if (data.local.complement)this.get.local.complement().value = data.local.complement
        }

        if (data.movie)this.get.movie().value = data.movie
        // Promotion
        this.get.promotion.active().checked = data.promotion.active
        if (data.promotion.title) this.get.promotion.title().value = data.promotion.title
        if (data.promotion.description) this.get.promotion.description().value = data.promotion.description
    }
    async new(data) {
        errorsFunctions.clear()
        this.clear()

        await this.build()
        if(data) this.set(data)
    }
    clear() {
        this.get.id().value = ''
        this.get.picture().value = ''
        this.get.picture().dispatchEvent(new Event('change'))
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
        this.get.promotion.active().checked = false
        this.get.promotion.title().value = ''
        this.get.promotion.description().value = ''
    }

    async build() { 
        // Build in categories
        let base = this.form.querySelector('#categories')
        base.innerHTML = '' //clear

        let data = await api.categories.getAll()
        data.forEach(e => {
            base.insertAdjacentHTML('beforeend', Filter.build.categories(e))
        })
    }
}
class Form {
    constructor(form) {
        errorsFunctions.start()
        this.form = form
        this.functions = new Functions(form, this.telephoneFunctions )

        this.obResponses = new Observer()
        this.db = new DB(this.obResponses, obErrors)

        const btn = {
            insert: this.form.querySelector('input[type=button]#insert'),
            update: this.form.querySelector('input[type=button]#update')
        }

        // Starter buttons
        btn.insert.addEventListener('click', (evt) => {
            evt.preventDefault()
            btn.insert.disabled = true

            let {data, file} = this.functions.getDataInsert()
            this.db.profile.insert(data, file)
                .finally(() => {
                    btn.insert.disabled = false
                })
        })
        btn.update.addEventListener('click', (evt) => {
            evt.preventDefault()
            btn.update.disabled = true

            let {data, file} = this.functions.getDataUpdate()
            this.db.profile.update(data, file)
                .finally(() => {
                    btn.update.disabled = false
                })
        })
    }

    hide() { this.form.style.display = 'none' }
    show() { this.form.style.display = 'grid' }
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