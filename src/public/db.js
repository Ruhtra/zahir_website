import api from '/helper/api.js'
import Joi from 'https://cdn.jsdelivr.net/npm/joi@17.9.2/+esm'
import validate from '/validator.js'
import Notifications from '/helper/Notifications.js'

import { InternalServerError } from "/Errors.js";

export default class DB {
    constructor(obResponses, obErrors) {
        this.obResponses = obResponses
        if (obErrors) this.obErrors = obErrors
        this.notifications = new Notifications(document.querySelector('#notifications'))
    }

    async trycatch(fValidate, data, f) {
        try {
            const {error, value} = fValidate(data)
            if (error) throw error

            await f(value)
        } catch(err) {
            if (err instanceof Joi.ValidationError) {
                if (this.obErrors) return obErrors.notify(err.details)
            }
            if (err instanceof InternalServerError) this.notifications.insert('Não foi possível executar ação. Erro interno do servidor')
            console.error(err)
        }
    }

    profile = {
        insert: async (data) =>  {
            await this.trycatch(validate.profile.insert, data, async (value) => {
                console.log('inserting...')
                this.obResponses.notify({type: 'insert', response: await api.profile.insert(value)})
            })
        },
        update: async (data) => {
            await this.trycatch(validate.profile.update, data, async (value) => {
                console.log('updating...')
                let response = await api.profile.update(value)
                this.obResponses.notify({type: 'update', response: response})
            })
        },
        delete: async (id) => {
            await this.trycatch(validate.profile.id, id, async (value) => {
                console.log('deleting...')
                let response = await api.profile.delete({id: value})
                this.obResponses.notify({type: 'delete', response: response})
            })
        }
    }
    homePage = {
        insert: async (data) => {
            await this.trycatch(validate.homePage.insert, data, async (value) => {
                console.log('Inserting...')
                let response = await api.homePage.insert(value)
                this.obResponses.notify({type: 'insert', response: response})
            })
        },
        delete: async (order) => {
            await this.trycatch(validate.homePage.order, order, async (value) => {
                console.log('Deleting...')
                this.obResponses.notify({type: 'delete', response: await api.homePage.delete({order: value})})
            })
        }
    }
    
}