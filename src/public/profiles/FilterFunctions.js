import Api from '/api.js'

class FilterSstructure {
    constructor(data) {
        this.data = data
        this.arrFilter = this.data.map(() => 1)
    }

    filterPromotion() {
        this.arrFilter = this.data.map((e, i) => {
            if (this.arrFilter[i]) 
                if (e['promotion']) return 1
            return 0;
        })
    }
    filterCategory(type) {
        this.arrFilter = this.data.map((e, i) => {
            if (this.arrFilter[i]) 
                if (e['category'].type == type) return 1
            return 0
        });
    }
    filterUf(uf) {
        this.arrFilter = this.data.map((e, i) => {
            if (this.arrFilter[i])
            if (e['uf'] == uf.toUpperCase()) return 1
            return 0
        })
    }
    filterCategories(categories) {
        categories = categories.filter(e => e != undefined)

        this.arrFilter = this.data.map((e, i) => {
            if (this.arrFilter[i]) {
                let result = categories.map(name => {
                    return e['category']['categories'].includes(name)
                })
                if (result.filter(e => e == false).length == 0) return 1
            }
            return 0
        })
    }
    filterClean() {
        this.arrFilter = this.data.map(() => 1)
    }
}

export default class FilterFunctions extends FilterSstructure  {
    constructor(baseFilter, baseTable, array) {
        super(array)

        this.baseFilter = baseFilter
        this.baseTable = baseTable
        this.cardRemove = 'unvisible'

        this.btn = {
            promotion: this.baseFilter.querySelector('#promotion'),
            type: this.baseFilter.querySelector('#type'),
            uf: this.baseFilter.querySelector('#uf'),
            categories: this.baseFilter.querySelector('#categories'),
            clear: this.baseFilter.querySelector('#clear')
        }

        this.api = new Api()

        this.btn.promotion.addEventListener('click', (e) => {
            e.preventDefault()

            // update checkbox
            let cb = this.btn.promotion.querySelector('input') 
            cb.checked ? cb.checked = false : cb.checked = true

            this.filterMain()
        })
        this.btn.type.addEventListener('change', (e) => {
            e.preventDefault()

            // change visible categories
            if (this.btn.type.querySelector('select').value == 'restaurante') this.btn.categories.style.display = 'block'
            else this.btn.categories.style.display = 'none'

            this.filterMain()
        })
        this.btn.uf.addEventListener('change', (e) => {
            e.preventDefault()

            this.filterMain()
        })
        // this.buildCategories()
        this.btn.clear.addEventListener('click', (e) => {
            e.preventDefault()
            
            this.btn.promotion.querySelector('input').checked = false
            this.btn.type.querySelector('select').value = 'restaurante'
            this.btn.uf.querySelector('select').value = ''
            this.btn.categories.style.display = 'block'
            this.btn.categories.querySelectorAll('input').forEach(e => {
                e.checked = false
            })

            this.filterMain()
        })
    }
    promotion() {
        let promo = this.btn.promotion.querySelector('input').checked
        if (promo) this.filterPromotion()
    }
    type() {
        let type = this.btn.type.querySelector('select').value
        this.filterCategory(type)
    }
    uf() {
        let uf = this.btn.uf.querySelector('select').value
        if (uf) this.filterUf(uf)
    }
    categories() {
        if (this.btn.type.querySelector('select').value != 'restaurante') return

        let categories = [ ... this.btn.categories.querySelectorAll('input') ].map(e => {
            if (e.checked) return e.getAttribute('name')
        })
        this.filterCategories(categories)
    }

    filterMain() {
        this.filterClean()
        this.cardsClean()

        this.type()
        this.promotion()
        this.uf()
        this.categories()
        
        this.cardsShow()
    }

    cardsShow() {
        this.baseTable.querySelector('#empty').classList.add(this.cardRemove)

        this.arrFilter.map((e, i) => {
            if (!e) this.baseTable.querySelector(` div#_${this.data[i]._id}`).classList.add(this.cardRemove)
        })
        
        if (this.arrFilter.filter(x => x==1).length == 0) return this.cardsEmpty();
    }
    cardsEmpty() {
        this.baseTable.querySelector('#empty').classList.remove(this.cardRemove)
    }
    cardsClean() {
        this.baseTable.querySelectorAll('.profiles').forEach(e => {
            e.classList.remove(this.cardRemove)
        })
    }

    setArray(array) {this.data = array}

    buildCategories() {
        const getTemplate = (e) => `<div id="${e.name}" class="item">
            <input type="checkbox" id="in_${e._id}" name="${e.name}">
            <label for="in_${e._id}" class="categorie">${e.name}</label>
        </div>`

        this.api.categories.getAll()
            .then(data => {
                this.btn.categories.innerHTML = ''
                data.forEach(e => {
                    this.btn.categories.insertAdjacentHTML('beforeend', getTemplate(e))
                })
                this.btn.categories.querySelectorAll('div').forEach(div => {
                    div.addEventListener('click', (e) => {
                        e.preventDefault()
        
                        // update checkbox
                        let cb = div.querySelector('input') 
                        cb.checked ? cb.checked = false : cb.checked = true
        
                        this.filterMain()
                    })
                })
        })
    }
}
