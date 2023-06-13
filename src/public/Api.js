export default class Api {
    profile = {
        get: async () => {
            return (await fetch('http://localhost:4000/api/profile/get')).json()
        },
        getAll: async () => {
            return (await fetch('http://localhost:4000/api/profile/getAll')).json()
        },
        insert: async () => {
            return 'dev'
        },
        update: async () => {
            return 'dev'
        },
        delete: async () => {
            return 'dev'
        }
    }
    homePage = {
        get: async () => {
            return (await fetch('http://localhost:4000/api/homepage/getAll')).json()
        },
        insert: async () => {
            return 'dev'
        },
        delete: async () => {
            return 'dev'
        }
    }
}