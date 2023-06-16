export default class Api {
    profile = {
        get: async () => {
            return (await fetch('/api/profile/get')).json()
        },
        getList: async () => {
            return (await fetch('/api/profile/getList')).json()
        },
        insert: async (data) => {
            return (await fetch('/api/profile/insert', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })).json()
        },
        update: async (data) => {
            return (await fetch('/api/profile/update', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })).json()
        },
        delete: async (data) => {
            return (await fetch('/api/profile/delete', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })).json()
        }
    }
    homePage = {
        getAll: async () => {
            return (await fetch('/api/homepage/getAll')).json()
        },
        insert: async (data) => {
            return (await fetch('/api/homePage/insert', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })).json()
        },
        delete: async (data) => {
            return (await fetch('/api/homePage/delete', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })).json()
        }
    }
    categories = {
        getAll: async() => {
            return (await fetch('/api/categories/getAll')).json()
        }
    }
    promotions = {
        getAll: async() => {
            return (await fetch('/api/promotions/getAll')).json()
        }
    }
}