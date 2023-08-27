export const Profile = {
    card: (data) => `
        <div id="_${data._id}" class="profiles profile" >
            <input class="openCard" type="button" value="Abrir" style="display: none;">
            <img src="${data.picture != undefined ? '/uploads/'+data.picture : '/images/no-image.png'}" alt="">
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
            <div id="_${data._id}" class="profiles profile" >
                <div class="options">
                    <input class="updateCard" type="button" value="Update">
                    <input class="deleteCard" type="button" value="Delete">
                </div>

                <input class="openCard" type="button" value="Abrir" style="display: none;">
                <img src="${data.picture != undefined ? '/uploads/'+data.picture : '/images/no-image.png'}" alt="">
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
        addCard: () => `
            <div class="add profiles profile">
                <button id="insert">+</button>
            </div>
        `,
        
}

export const Filter = {
    telephone: (data) => `
        <div class="${data} item">
            <label class="icon">${data.charAt(0).toUpperCase() + data.slice(1)}:</label>
            <input type="text" maxlength="16">
            <input type="button" name="delete" value="delete">
        </div>`,
    categorie: (data) => `
        <div id="${data}" class="item">
            <input id="cb_${data}" type="checkbox" name="${data}" style="display: none;" checked>
            <label for="cb_${data}">${data}</label>
        </div>`,
    error: (data) => `<span class="error">${data}</span>`,
    build: {
        categories: (data) => `
            <div id="${data.name}" class="item">
            <input id="cb_${data.name}" type="checkbox" name="${data._id}" style="display: none;">
                <label for="cb_${data.name}">${data.name}</label>
            </div>`
    }
}

export const HomePage = {
    profile: (data) => {
        if (data.picture != undefined) return `<img src="${data.picture != undefined ? '/uploads/'+data.picture : '/images/no-image.png'}" alt="">`
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