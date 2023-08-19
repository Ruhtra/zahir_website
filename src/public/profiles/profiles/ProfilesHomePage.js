import { HomePage } from '/helper/Templates.js'
import Observer from '/helper/Observer.js'
import Profiles from '/profiles/profiles/Profiles.js'

import DB from '/db.js';


export default class ProfilesHomePage extends Profiles {
    constructor(base) {
        super(base, true)
        this.base = base
        this.obResponses = new Observer()
        this.DB = new DB(this.obResponses)

        this.btn = {
            insertCard: (profile) =>  profile.querySelector('.insertCard'),
            iconAdd: (profile) => profile.querySelector('.insertCard .icon-add'),
            iconCancel: (profile) => profile.querySelector('.insertCard .icon-cancel')
        }

        this.status_toogleWaitPositions = false
        this.id_toogle = undefined
    }
    setFalse(profile) {
        this.btn.insertCard(profile).classList.remove('hover')
        this.btn.iconAdd(profile).style.display = 'block'
        this.btn.iconCancel(profile).style.display = 'none'
        this.status_toogleWaitPositions = false
    }
    setTrue(profile){
        this.btn.insertCard(profile).classList.add('hover')
        this.btn.iconAdd(profile).style.display = 'none'
        this.btn.iconCancel(profile).style.display = 'block'
        this.status_toogleWaitPositions = true
    }

    toggleWaitPosition(profile, id){
        if (this.status_toogleWaitPositions) {
            this.setFalse(profile)
            this.id_toogle = undefined
            return this.obResponses.notify({type: 'cancelWaitPosition', response: {}})
        }

        this.setTrue(profile)
        this.id_toogle = id
        this.obResponses.notify({type: 'startingWaitPosition', response: {id}})
    }

    endWaitPosition(){
        this.status_toogleWaitPositions = false
        this.id_toogle = undefined
    }

    insertBtn(data) {
        const profile = this.base.querySelector(`#_${data._id}`)
        profile.insertAdjacentHTML('beforeend', HomePage.btns())
        // Load buttons
        this.btn.insertCard(profile).addEventListener('click', evt => {
            evt.preventDefault()

            if (this.id_toogle != data._id && this.id_toogle != undefined) return console.log("Não permitido selecionar dois");
    
            this.toggleWaitPosition(profile, data._id);            
        })
    }
    insertPosition(data) {
        const profile = this.base.querySelector(`#_${data.profile._id}`)
        profile.insertAdjacentHTML('beforeend', HomePage.position(data.order))
    }
}