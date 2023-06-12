module.exports = {
    verifyInput: {
        id: {
            invalid: 'The id passed is invalid',
            IsEmpyt: 'Id is empty',
        },
        name: {
            IsEmpy: 'Name is empty',
            // maxCaractere: `${infos.name.maxCaractere} character maximum exceeded`
        },
        resume: {
            IsEmpy: 'Resume is empty',
            // maxCaractere: `${infos.resume.maxCaractere} character maximum exceeded`
        },
        category: {
            type: {
                IsEmpy: 'Category is empty',
                notValid: 'Not valid type'
            },
            categories: {
                invalid: 'The id passed is invalid',
            }
        },
        telephone: {
            invalid: 'This phone is invalid'
        },
        local: {
            cep: {
                IsEmpy: 'Cep is empty',
                notNumber: 'This is not a number',
                // lenCaractere: `Zip code size is different from ${infos.local.city.lenCaractere}`
            },
            uf: {
                IsEmpy: 'Uf is empty',
                invalid: 'This uf is invalid'
            },
            city: {
                IsEmpy: 'City is empty',
                // maxCaractere: `${infos.local.city.maxCaractere} character maximum exceeded`
            },
            neighborhood: {
                IsEmpy: 'Neighborhood is empty',
                // maxCaractere: `${infos.local.neighborhood.maxCaractere} character maximum exceeded`
            },
            street: {
                IsEmpy: 'Street is empty',
                // maxCaractere: `${infos.local.street.maxCaractere} character maximum exceeded`
            },
            number: {
                IsEmpy: 'Number is empty',
                notNumber: 'This is not a number',
                // maxCaractere: `${infos.local.number.maxCaractere} character maximum exceeded`
            },
            complement: {
                // maxCaractere: `${infos.local.complement.maxCaractere} character maximum exceeded`
            }

        },
        promotion: {
            invalid: 'The id passed is invalid',
            IsEmpy: 'Id is empy'
        }
    },
    queryDB: {
        profile: {
            insert: {
                categorieNotFound: 'Categorie not found',
                promotionNotFound: 'Promotion not found'
            }
        },
        homePageProfile: {
            insert: {
                occupiedOrder: 'This order is occupied',
                occupiedProfile: 'This profile has already been used',
                profileNotFound: 'This profile was not found',
                promotionIsRequired: 'Promotion is required'
            },
            delete: {
                ordertNotFound: 'This order in homePage not found'
            }
        }
    }
}