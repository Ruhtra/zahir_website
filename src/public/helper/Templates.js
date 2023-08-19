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
        <button class="insertCard">
            <div class="icon-add">
            <svg class="add" viewBox="0 0 24 24">
                <path
                fill="white"
                d="m12.002 2c5.518 0 9.998 4.48 9.998 9.998 0 5.517-4.48 9.997-9.998 9.997-5.517 0-9.997-4.48-9.997-9.997 0-5.518 4.48-9.998 9.997-9.998zm-.747 9.25h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z" fill-rule="nonzero"/>
            </svg>
            </div>
            <div class="icon-cancel" style="display: none;">
                <svg class="close" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24">
                    <path fill="white" d="M22.14 22.14h-18.7575c-.5092 0-.9225.4133-.9225.9225s.4133.9225.9225.9225h19.3725c.6519 0 1.23-.5781 1.23-1.23v-19.3725c0-.5092-.4133-.9225-.9225-.9225s-.9225.4133-.9225.9225zm-1.23-20.91c0-.5879-.4662-1.23-1.23-1.23h-18.45c-.7626 0-1.23.6384-1.23 1.23v18.45c0 .7638.6396 1.23 1.23 1.23h18.45c.5879 0 1.23-.4662 1.23-1.23zm-19.065.615h17.22v17.22h-17.22zm8.61 7.3025 2.7294-2.7306c.1796-.1796.417-.2694.6531-.2694.4969 0 .9225.3997.9225.9225 0 .2374-.0898.4723-.2694.6531l-2.7306 2.7306 2.7331 2.7331c.1808.1808.2706.417.2706.6519 0 .5252-.4293.9237-.9225.9237-.2362 0-.4723-.0898-.6519-.2694l-2.7343-2.7343-2.7343 2.7343c-.1796.1796-.4157.2694-.6519.2694-.4932 0-.9225-.3985-.9225-.9237 0-.2349.0898-.4711.2706-.6519l2.7331-2.7331-2.7306-2.7306c-.1796-.1808-.2694-.4157-.2694-.6531 0-.5227.4256-.9225.9225-.9225.2362 0 .4736.0898.6531.2694z" fill-rule="nonzero"/>
                </svg>
            </div>
        </button>`,
    position: (position) => `
        <div class="markHomePage">
            <span>${Number(position)+1}</span>
        </div>
    `
    
}