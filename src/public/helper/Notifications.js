export default class MessagesFunctions {
    constructor(base) { this.base = base }
    insert(msg) {
        this.base.innerHTML = `
            ${msg}
        `
    }
}