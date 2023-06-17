export const Profile = {
    card: (data)  => `
        <div id="_${data._id}" class="profiles" >
            <input class="openCard" type="button" value="Abrir"> <br>

            _id: ${data._id}, <br>
            name: ${data.name}, <br>
            picture: ${data.picture}, <br>
            promotion: ${data.promotion}, <br>
            uf: ${data.uf}, <br>
            category: {<br>
                &nbsp;&nbsp; type: ${data.category.type}, <br>
                &nbsp;&nbsp; categories: ${data.category.categories} <br>
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
            promotion: ${data.promotion}, <br>
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
        promotion: ${data.promotion}, <br>
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
    profile: (data) => `
        <input class="delete" type="button" value="delete">
        ${data.name}`,
    btns: () => `
        <input class="insertOrd" type="number" placeholder="order" max="6" min="0"><br>  
        <input class="insertCard" type="button" value="Inserir"><br>`
    
}