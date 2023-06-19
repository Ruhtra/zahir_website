import { InternalServerError } from "/Errors.js";

async function structure(link, data) {
    if (data) var response = await fetch(link, data)
    else var response = await fetch(link)
    
    switch(response.status){
        case 200: return response.json();
        case 500: throw new InternalServerError('Internal Server Error');

        default: return response.json()
    }
}

export default new class Api {
    profile = {
        get: async (id) => structure('/api/profile/get?id='+id),
        getList: async () => structure('/api/profile/getList'),
        insert: async (data) => structure('/api/profile/insert', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }),
        update: async (data) => structure('/api/profile/update', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }),
        delete: async (data) => structure('/api/profile/delete', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
    }
    homePage = {
        getAll: async () => structure('/api/homepage/getAll'),
        insert: async (data) => structure('/api/homePage/insert', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }),
        delete: async (data) => structure('/api/homePage/delete', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
    }
    categories = {
        getAll: async() => structure('/api/categories/getAll')
    }
    promotions = {
        getAll: async() => structure('/api/promotions/getAll')
    }
}