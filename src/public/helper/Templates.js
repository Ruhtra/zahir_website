export const Profile = {
    // card: (data)  => `
    //     <div id="_${data._id}" class="profiles" >
    //         <input class="openCard" type="button" value="Abrir"> <br>

    //         _id: ${data._id}, <br>
    //         name: ${data.name}, <br>
    //         picture: ${data.picture}, <br>
    //         promotion: { <br>
    //             &nbsp;&nbsp; title: ${data.promotion.title}, <br>
    //             &nbsp;&nbsp; description: ${data.promotion.description} <br>
    //         }, <br>
    //         uf: ${data.uf}, <br>
    //         category: {<br>
    //             &nbsp;&nbsp; type: ${data.category.type}, <br>
    //             &nbsp;&nbsp; categories: ${data.category.categories} <br>
    //         }
    //     </div>`,
    card: (data) => `
        <div id="_${data._id}" class="profiles" >
            <input class="openCard" type="button" value="Abrir" style="display: none;">
            <img src="${'/images/carousel/1.png'}" alt=""> <!-- implemented image here -->
            <div class="elements">
                <span class="name">${data.name}</span>
                <span class="local">${data.local.uf} - ${data.local.city}</span>
            </div>
            ${ data.promotion.title != undefined ?
                `<div class="promotion">
                    <span class="title">${data.promotion.title}</span>
                </div>` : ''
            }
        </div>`,
    cardAdmin: (data) => `
        <div id="_${data._id}" class="profiles">
            <input class="openCard" type="button" value="Abrir"> <br>
            <input class="updateCard" type="button" value="Update"> <br>
            <input class="deleteCard" type="button" value="Delete"> <br>
            
            _id: ${data._id}, <br>
            name: ${data.name}, <br>
            picture: ${data.picture}, <br>
            promotion: { <br>
                &nbsp;&nbsp; title: ${data.promotion.title}, <br>
                &nbsp;&nbsp; description: ${data.promotion.description} <br>
            }, <br>
            uf: ${data.uf}, <br>
            category: {<br>
                &nbsp;&nbsp; type: ${data.category.type}, <br>
                &nbsp;&nbsp; categories: ${data.category.categories} <br>
            }
        </div>`,
    cardHomePage: (data) => `
    <div id="_${data._id}" class="profiles" >
        <input class="openCard" type="button" value="Abrir"> <br>

        _id: ${data._id}, <br>
        name: ${data.name}, <br>
        picture: ${data.picture}, <br>
        promotion: { <br>
            &nbsp;&nbsp; title: ${data.promotion.title}, <br>
            &nbsp;&nbsp; description: ${data.promotion.description} <br>
        }, <br>
        uf: ${data.uf}, <br>
        category: {<br>
            &nbsp;&nbsp; type: ${data.category.type}, <br>
            &nbsp;&nbsp; categories: ${data.category.categories} <br>
        }
        <input class="insertOrd" type="number" placeholder="order" max="6" min="0"><br>  
        <input class="insertCard" type="button" value="Inserir"><br>
    </div>`

        
}

export const Filter = {
    telephone: (data) => `
        <div class="${data}">
            <label>${data.charAt(0).toUpperCase() + data.slice(1)}:</label>
            <input type="text" maxlength="16">
            <input type="button" name="delete" value="delete">
        </div>`,
    categorie: (data) => `
        <div id="${data}" class="item">
            <label for="cb_${data}">${data}</label>
            <input id="cb_${data}" type="checkbox" name="${data}" checked>
        </div>`,
    error: (data) => `<span class="error">${data}</span>`,
    build: {
        categories: (data) => `
            <div id="${data.name}" class="item">
                <label for="cb_${data.name}">${data.name}</label>
                <input id="cb_${data.name}" type="checkbox" name="${data._id}">
            </div>`,
        promotions: (data) => `<option value="${data._id}" html="${data.percentage}">${data.percentage}</option>`
    }
}

export const HomePage = {
    profile: (data) => {
        if (data.picture != undefined) return `<img src="/images/carousel/${data.picture}">`
        return `<img style="width: 50%;height: 50%;" src="/images/notImage.png">`
    },

    btns: () => `
        <input class="insertOrd" type="number" placeholder="order" max="6" min="0"><br>  
        <input class="insertCard" type="button" value="Inserir"><br>`
    
}