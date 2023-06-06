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
            type: this.baseFilter.querySelector('#type')
        }

        this.btn.promotion.addEventListener('click', (e) => {
            e.preventDefault()

            // update checkbox
            let cb = this.btn.promotion.querySelector('input') 
            cb.checked ? cb.checked = false : cb.checked = true

            this.filterMain()
        })
        this.btn.type.addEventListener('change', (e) => {
            e.preventDefault()

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

    filterMain() {
        this.filterClean()
        this.cardsClean()

        this.type()
        this.promotion()
        
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
        this.baseTable.querySelectorAll('*:not(#empty)').forEach(e => {
            e.classList.remove(this.cardRemove)
        })
    }

    setArray(array) {this.data = array}
}
