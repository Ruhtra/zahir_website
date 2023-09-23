import api from '/helper/Api.js'

class FilterSstructure {
    constructor(data) {
        this.data = data
        this.arrFilter = this.data.map(() => 1)
    }

    filterSearch(text) {
        const textoBuscado = text.toLowerCase().trim();
        this.arrFilter = this.data.map((e, i) => {
            if (this.arrFilter[i] == 1) 
                if (e['name'].toLowerCase().includes(textoBuscado))
                    return 1
            return 0
        })
    }
    filterPromotion() {
        this.arrFilter = this.data.map((e, i) => {
            if (this.arrFilter[i] == 1) 
                if (Object.keys(e['promotion']).length > 0) return 1
            return 0
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
            if (e['local']['uf'] == uf.toUpperCase()) return 1
            return 0
        })
    }
    filterCategories(categories) {
        categories = categories.filter(e => e != undefined)

        //checks if no category is selected
        if (categories.length <= 0) {
            return this.arrFilter = this.data.map((e, i) => {
                if (this.arrFilter[i]) return 1
            })
        }

        this.arrFilter = this.data.map((e, i) => {
            if (this.arrFilter[i]) {
                if (e['category']['categories'] != undefined) {
                    let result = categories.map(name => {
                        return e['category']['categories'].includes(name)
                    })
                    if (result.filter(e => e == false).length == 0) return 1
                }
            }
            return 0
        })
    }
    filterClean() {
        this.arrFilter = this.data.map(() => 1)
    }
}

class ScreenProfiles {
    constructor (baseTable) {
        this.baseTable = baseTable
        this.cardRemove = 'unvisible'

        this.elements = {
            empty: () => this.baseTable.querySelector('#empty'),
            allProfiles: () => this.baseTable.querySelectorAll('.profiles')
        }
    }
    cardsShow(arr, data) {
        console.log('Array Permiteds: '+arr);
        this.elements['empty']().classList.add(this.cardRemove)

        arr.map((e, i) => {
            if (!e) this.baseTable.querySelector(`div#_${data[i]._id}`).classList.add(this.cardRemove)
        })
        if (arr.filter(e => e).length == 0) return this.cardsEmpty();
    }
    cardsEmpty() { this.elements['empty']().classList.remove(this.cardRemove) }
    cardsClean() { this.elements['allProfiles']().forEach(e => { e.classList.remove(this.cardRemove) }) }
}
class ScreenFilter {
    constructor (baseFilter) {
        this.baseFilter = baseFilter

        this.elements = {
            filterScreen: () => this.baseFilter.querySelector('#screenFilter')
        }
        this.btn = {
            close: this.elements.filterScreen().querySelector('.close')
        }

        // Starting buttons
        this.btn.close.addEventListener('click', (e) => {
            e.preventDefault()

            this.closeFilter()
        })
    }
    openFilter() {
        //Disabled scroll
        document.body.style.overflow = "hidden";
        this.elements.filterScreen().style.display = 'flex'
    }
    closeFilter() {
        //Enable scroll
        document.body.style.overflow = "auto";
        this.elements.filterScreen().style.display = 'none'
    }
}

export default class Filter extends FilterSstructure  {
    constructor(baseFilter, baseTable, array) {
        super(array)

        this.baseFilter = baseFilter
        this.screenProfiles = new ScreenProfiles(baseTable)
        this.screenFilter = new ScreenFilter(baseFilter)

        this.btn = {
            search: this.baseFilter.querySelector('#search'),
            promotion: this.baseFilter.querySelector('#promotion'),
            type: this.baseFilter.querySelector('#type'),
            uf: this.baseFilter.querySelector('#uf'),
            categories: this.baseFilter.querySelector('#categories'),
            clear: this.baseFilter.querySelectorAll('.clear'),
            openFilter: this.baseFilter.querySelector('#openFilter')
        }

        //Active Promotion in url variable
        const searchParams = new URLSearchParams(window.location.search);
        let promotion = searchParams.get('promotion')
        if (promotion == 'true') this.btn.promotion.querySelector('input').checked = true

        this.btn.search.addEventListener('keyup', (e) => {
            this.filterMain()
        })
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
            if (this.btn.type.querySelector('select').value == 'restaurante') this.btn.categories.parentNode.style.display = 'block'
            else this.btn.categories.parentNode.style.display = 'none'

            this.filterMain()
        })
        this.btn.uf.addEventListener('change', (e) => {
            e.preventDefault()

            this.filterMain()
        })
        this.buildCategories()
        this.btn.clear.forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault()
                
                this.btn.promotion.querySelector('input').checked = false
                this.btn.type.querySelector('select').value = 'restaurante'
                this.btn.uf.querySelector('select').value = ''
                this.btn.categories.style.display = 'flex'
                this.btn.categories.querySelectorAll('input').forEach(e => {
                    e.checked = false
                })

                this.filterMain()
            })
        })

        // openFilter
        this.btn.openFilter.addEventListener('click', (e) => {
            e.preventDefault()

            this.screenFilter.openFilter()
        })
    }
    search() {
        let search = this.btn.search.querySelector('input').value
        if (search) this.filterSearch(search)
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
        this.screenProfiles.cardsClean()

        this.search()
        this.type()
        this.promotion()
        this.uf()
        this.categories()
        
        this.screenProfiles.cardsShow(this.arrFilter, this.data)
    }

    setArray(array) {this.data = array}

    async buildCategories() {
        console.log('buildCategorie');
        const getTemplate = (e) => `<div id="${e.name}" class="item">
            <input type="checkbox" id="in_${e._id}" name="${e.name}">
            <label for="in_${e._id}" class="categorie">${e.name}</label>
        </div>`

        let data = await api.categories.getAll()
        console.log(data);
        this.btn.categories.innerHTML = ''
        console.log(this.btn.categories);
        data.forEach(e => this.btn.categories.insertAdjacentHTML('beforeend', getTemplate(e)))

        this.btn.categories.querySelectorAll('div').forEach(div => {
            div.addEventListener('click', (e) => {
                e.preventDefault()

                // update checkbox
                let cb = div.querySelector('input') 
                cb.checked ? cb.checked = false : cb.checked = true

                this.filterMain()
            })
        })
    }
}
