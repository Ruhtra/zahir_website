import Joi from 'https://cdn.jsdelivr.net/npm/joi@17.9.2/+esm'

const validator = (scheme) => (payload) => 
    scheme.validate(payload, { abortEarly: false })


const idScheme = Joi.string().hex().length(24)
const telephoneScheme = Joi.array().items(Joi.string().length(14))

const profileScheme = Joi.object().keys({
    name: Joi.string().max(100).required(),
    resume: Joi.string().max(500),
    category: Joi.object({
        type: Joi.string().valid('hospedagem', 'restaurante', 'parque', 'lugares').required(),
        categories: Joi.when('type', {
            is: 'restaurante',
            then: Joi.array().items(idScheme).required(),
            otherwise: Joi.forbidden()
        }),
        newCategories: Joi.when('type', {
            is: 'restaurante',
            then: Joi.array().items(Joi.string()).required(),
            otherwise: Joi.forbidden()
        })
    }).required(),
    informations: Joi.string().max(250),
    telephones: Joi.object({
        telephone: telephoneScheme, 
        whatsapp: telephoneScheme
    }).required(),
    local: Joi.object({
        cep: Joi.string().length(8).required(),
        uf : Joi.valid('AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO').required(),
        city: Joi.string().max(100).required(),
        neighborhood: Joi.string().max(100).required(),
        street: Joi.string().max(100).required(),
        number: Joi.string().max(10).required(),
        complement: Joi.string().max(250)
    }),
    movie: Joi.string().uri(),
    promotion: Joi.object().keys({
        title: Joi.string().max(20),
        description: Joi.string().max(250)
    }).required()
})
const updateScheme = profileScheme.keys({
    id: idScheme.required()
})

const orderScheme = Joi.number().min(0).max(6)
const insertHomePageScheme = Joi.object().keys({
    id: idScheme.required(),
    order: orderScheme.required()
})

export default {
    profile: {
        id: validator(idScheme.required()),
        insert: validator(profileScheme),
        update: validator(updateScheme),
    },
    homePage: {
        insert: validator(insertHomePageScheme),
        order: validator(orderScheme.required())
    },
    auth: {
        login: validator(Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required()
        }))
    }
}