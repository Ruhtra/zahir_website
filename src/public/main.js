const form = document.querySelector('form#form')

function removeEmptyValues(obj) {
    if (Array.isArray(obj)) { return obj.map((item) => removeEmptyValues(item)) } else if (typeof obj === 'object' && obj !== null) {
      return Object.fromEntries(
        Object.entries(obj)
          .filter(([_, value]) => value !== '')
          .map(([key, value]) => [
            key,
            typeof value === 'object' && value !== null ? removeEmptyValues(value) : value,
          ])
      );
    }
    return obj
}
function getForm() {
    return removeEmptyValues({
        picture: form.querySelector('#picture input').value,
        name: form.querySelector('#name input').value,
        resume: form.querySelector('#resume textarea').value,
        category: {
            type: form.querySelector('#category select').value,
            categories: [ ... form.querySelectorAll('#category #categories input:checked') ].map(e => e.getAttribute('name'))
        },
        informations: form.querySelector('#informations textarea').value,
        telephones: {
            telephone: [ ... form.querySelectorAll('div#telephones .telephone input[type="text"]') ].map(e => '+55'+e.value.replace(/\D/g, '')),
            whatsapp: [ ... form.querySelectorAll('div#telephones .whatsapp input[type="text"]') ].map(e => '+55'+e.value.replace(/\D/g, ''))
        },
        local: {
            cep: form.querySelector('#local #cep input').value.replace(/\D/g, ''),
            uf: form.querySelector('#local #uf select').value,
            city: form.querySelector('#local #city input').value,
            neighborhood: form.querySelector('#local #neighborhood input').value,
            street: form.querySelector('#local #street input').value,
            number: form.querySelector('#local #number input').value,
            complement: form.querySelector('#local #complement textarea').value,
        },
        movie: form.querySelector('#movie input').value,
        promotion: form.querySelector("#promotion select").value
    })
}
class TelephoneFunctions {
    constructor(form) {
        this.form = form
        this.getTemp = (name) =>  `<div class="${name}">
            <label for="${name}">${name.charAt(0).toUpperCase() + name.slice(1)}:</label>
            <input type="text" name="${name}" onchange="Erros.clear(this.parentElement)" onkeyup="phoneFunctions.mask(this)" maxlength="16">
            <input type="button" name="delete" value="delete" onclick="phoneFunctions.delete(this)">
        </div>`
        this.templates = {
            telephone: this.getTemp('telephone'),
            whatsapp: this.getTemp('whatsapp')
        }
    }
    addTelephone() { 
        this.form.insertAdjacentHTML("beforeend", this.templates.telephone);
    }
    addWhatsapp() {
        this.form.insertAdjacentHTML("beforeend", this.templates.whatsapp);
    }
    delete(element) {
        element.parentElement.remove()
    }
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
function maskCep (e) {
    let t = e.value

    t = t.replace(/\D/g,"")
    t = t.replace(/(\d{5})(\d)/, "$1-$2")
    t = t.replace(/(\d{5}\-\d{3})(\d)/, "$1")
    
    e.value = t
}
class myErrors {
    constructor() {
        this.form = document.querySelector('#form')
        form.querySelectorAll('input, select, textarea').forEach(e => {
            e.addEventListener('change', () => {
                this.clear(e.parentElement)
            })
        })
    }
    clear(element) {
        let err = element.querySelector('span.error')
        if (err) err.remove()
    }
    insert(path, msg) {
        var element = path[0] == 'telephones'
            ? this.form.querySelectorAll(`#telephones .${path[1]}`)[path[2]]
            : this.form.querySelector(`#${path.join(' #')}`)
        
        this.clear(element)
        element.insertAdjacentHTML("beforeend", `<span class="error">${msg}</span>`);
    }
}

const phoneFunctions = new TelephoneFunctions(form.querySelector('#telephones'))
const Erros = new myErrors()