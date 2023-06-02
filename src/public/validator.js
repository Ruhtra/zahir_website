import Joi from 'https://cdn.jsdelivr.net/npm/joi@17.9.2/+esm'

const validator = (scheme) => (payload) => 
    scheme.validate(payload, { abortEarly: false })


const idScheme = Joi.string().hex().length(24)
const telephoneScheme = Joi.array().items(Joi.string().length(14))

const profileScheme = Joi.object().keys({
    picture: Joi.string(),
    name: Joi.string().max(15).required(),
    resume: Joi.string().max(250),
    category: Joi.object({
        type: Joi.string().valid('restaurante', 'hotel').required(),
        categories: Joi.array().items(Joi.string())
    }).required(),
    informations: Joi.string().max(250),
    telephones: Joi.object({
        telephone: telephoneScheme, 
        whatsapp: telephoneScheme
    }).required(),
    local: Joi.object({
        cep: Joi.string().length(8).required(),
        uf : Joi.string().length(2).required(),
        city: Joi.string().max(100).required(),
        neighborhood: Joi.string().max(100).required(),
        street: Joi.string().max(100).required(),
        number: Joi.string().max(10).required(),
        complement: Joi.string().max(250)
    }).required(),
    movie: Joi.string().uri(),
    promotion: idScheme
})
const updateScheme = profileScheme.keys({
    id: idScheme
})
export default {
    id: validator(idScheme),
    insert: validator(profileScheme),
    update: validator(updateScheme)
}