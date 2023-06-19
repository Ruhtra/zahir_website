import Notifications from '/helper/Notifications.js'

import ProfilesHomePage from '/profiles/profiles/ProfilesHomePage.js'
import HomePages from '/profiles/HomePages.js'

class MainFunctions {
    constructor() {
        this.hp = new HomePages(eHomePage)
        this.php = new ProfilesHomePage(eProfiles)

        this.notifications = new Notifications(document.querySelector('#notifications'))
        this.next = (obj) => {
            switch(obj.type) {
                case 'delete': {
                    this.notifications.insert('Deletado com sucesso')
                    break;
                }
                case 'insert': {
                    this.notifications.insert('Inserido com sucesso')
                    break;
                }
            }
            this.build()
        }
        this.hp.obResponses.subscribe((obj) => this.next(obj))
        this.php.obResponses.subscribe((obj) => this.next(obj))

        this.build()
    }

    async build() {
        let [phpData, hpData] = await Promise.all([
            this.php.build(),
            this.hp.build()
        ])

        let hpl = hpData.map(e => e.profile._id)
        phpData.forEach(e => {
            if (!hpl.includes(e._id) && Object.keys(e.promotion).length > 0){
                this.php.insertBtn(e)
            }
        })
    }
}


const eHomePage = document.querySelector('#homePages')
const eProfiles = document.querySelector('#profiles')

new MainFunctions()