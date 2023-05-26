module.exports = {
    profile: {
        insert: async (req, res) => {
            // await Database.profile.insert({
            //     picture: "/pictures/codepicture.png",
            //     name: "Name example",
            //     resume: "Resume text for example",
            //     category: {
            //         type: "restaurante",
            //         categories: ["6469b487fe95b07f7414afed", "6469b496fe95b07f7414afee" ]
            //     },
            //     informations: "Informations for example",
            //     telephone: {
            //         whatsapp: ['+5584999999999', '+55849999999998'],
            //         telephone: ['+5584999999997']
            //     },
            //     local: {
            //         cep: "05492852",
            //         uf: "sp",
            //         city: "São Paulo",
            //         neighborhood: "BairroQualquer",
            //         street: "Sei la das quantas",
            //         number: "82",
            //         complement: "Complemente qualquer"
            //     },
            //     movie: "/movies/codemovie.mp4",
            //     promotion: "6469b5e3fe95b07f7414afef"
            // })
            // throw new Error('A error')

            return res.send('ok')
        }
    }
}