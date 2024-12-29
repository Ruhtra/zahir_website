const Database = require("../functions/queryDB.js");
const validate = require("../functions/validator.js");
const crypto = require("crypto")
const fs = require('fs')
const { Resend } = require('resend')
const Joi = require('joi')
const resend = new Resend(process.env.RESEND_API);


const emailSchema = Joi.object({
    nome: Joi.string()
      .min(2)
      .required()
      .messages({
        "string.empty": "O campo 'nome' é obrigatório.",
        "string.min": "O nome deve ter pelo menos 2 caracteres.",
      }),
    arroba: Joi.string()
      .min(2)
      .required()
      .messages({
        "string.empty": "O campo 'arroba' é obrigatório.",
        "string.min": "O arroba deve ter pelo menos 2 caracteres.",
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.empty": "O campo 'email' é obrigatório.",
        "string.email": "Insira um endereço de email válido.",
      }),
    telefone: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .required()
      .messages({
        "string.empty": "O campo 'telefone' é obrigatório.",
        "string.pattern.base": "Insira um número de telefone válido.",
      }),
    mensagem: Joi.string()
      .min(10)
      .required()
      .messages({
        "string.empty": "O campo 'mensagem' é obrigatório.",
        "string.min": "A mensagem deve ter pelo menos 10 caracteres.",
      }),
  });

  const EmailTemplate = (nome, arroba, email, telefone, mensagem, to) => `
    <!DOCTYPE html>
    <html lang="pt-BR">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação de Envio</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #333;
                line-height: 1.6;
            }

            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .email-header {
                text-align: center;
                border-bottom: 2px solid #f4f4f4;
                padding-bottom: 10px;
            }

            .email-header h1 {
                font-size: 24px;
                color: #007BFF;
            }

            .email-body {
                margin: 20px 0;
            }

            .email-body p {
                margin: 10px 0;
            }

            .email-footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #777;
            }

            .highlight {
                color: #007BFF;
                font-weight: bold;
            }

            @media (max-width: 600px) {
                .email-container {
                    padding: 10px;
                }

                .email-header h1 {
                    font-size: 20px;
                }
            }
        </style>
    </head>

    <body>
        <div class="email-container">
            <div class="email-header">
                <h1>Mensagem Enviada com Sucesso</h1>
            </div>
            <div class="email-body">
                <p>Olá, ${nome}</p>
                <p>Estamos felizes em informar que sua mensagem foi enviada com sucesso para ${to}.</p>
                <p>Confira abaixo os detalhes enviados:</p>
                <ul>
                    <li><strong>Nome:</strong> ${nome}</li>
                    <li><strong>@:</strong> ${arroba}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Telefone:</strong> ${telefone}</li>
                    <li><strong>Mensagem:</strong> ${mensagem}</li>
                </ul>
                <p>Por gentileza, note que este endereço de e-mail é exclusivamente para envio. Não será possível visualizar respostas ou mensagens adicionais enviadas para este endereço.</p>
                <p>Se você identificar algum erro nos dados enviados, pedimos que envie uma nova mensagem através do nosso site de contato: <a href="https://sitedozahir.com/anuncie" class="highlight">sitedozahir.com/anuncie</a>.</p>
                <p>Obrigado por entrar em contato!</p>
            </div>
            <div class="email-footer">
                <p>Este é um e-mail automático, por favor, não responda.</p>
            </div>
        </div>
    </body>

    </html>
  `
  const emailcontato = "zahircontato@outlook.com"
  


const verifyJson = async (json) => {
    return new Promise((resolve, reject) => {
        try {
            if (!json) return resolve(undefined)
            return resolve(JSON.parse(json))
        }
        catch (e) { reject(e) }
    })
};


module.exports = {
    profile: {
        get: async (req, res) => {
            const {error, value} = validate.profile.id(req.query.id)
            if (error) throw error

            return res.send(await Database.profile.get(value))
        },
        getList: async (req, res) => {
            return res.send(await Database.profile.getList())
        },
        insert: async (req, res) => {
            var { file } = req
            var { json } = req.body
            
            if (file) file.filename = `${crypto.randomBytes(16).toString('hex')}-${file.originalname}`

            var jsonConverse = await verifyJson(json)

            const {error, value} = validate.profile.insert(jsonConverse)
            if (error) throw error
        
            return res.send(await Database.profile.insert(value, file))
        },
        update: async (req, res) => {
            var { file } = req
            var { json } = req.body
            
            if (file) file.filename = `${crypto.randomBytes(16).toString('hex')}-${file.originalname}`

            var jsonConverse = await verifyJson(json)

            const {error, value} = validate.profile.update(jsonConverse)
            if (error) throw error

            return res.send(await Database.profile.update(value, file))
        },
        delete: async (req, res) => {
            const {error, value} = validate.profile.id(req.body.id)
            if (error) throw error

            return res.send(await Database.profile.delete(value))
        },
        getRecents: async (req, res) => {
            return res.send(await Database.profile.recents())
        }
    },
    homePage: {
        getAll: async (req, res) => {
            return res.send(await Database.homePage.get())
        },
        insert: async (req, res) => {
            const {error, value} = validate.homePage.insert(req.body)
            if (error) throw error
          
            return res.send(await Database.homePage.insert(value.id, value.order))
        },
        delete: async (req, res) => {
            const {error, value} = validate.homePage.order(req.body.order)
            if (error) throw error
          
            return res.send(await Database.homePage.delete(value))
        }
    },
    categories: {
        getAll: async (req, res) => {
            return res.send(await Database.categories.getAll())
        }
    },
    promotions: {
        getAll: async (req, res) => {
            return res.send(await Database.promotions.getAll())
        }
    },

    email: {
        send: async (req, res) => {
          try {
            const { error, value } = emailSchema.validate(req.body);
      
            if (error) {
              return res.status(400).json({ error: error.details });
            }
      
            const { nome, arroba, email, telefone, mensagem } = value;
      
            // Configuração do email
            const { data, error: emailError } = await resend.emails.send({
              from: "zahirApp <contact@sitedozahir.com>",
              to: [email, emailcontato],
              subject: `Confirmação de contato para Zahir`,
              html: EmailTemplate(nome, arroba, email, telefone, mensagem, emailcontato),
              replyTo: emailcontato, // O usuário pode responder diretamente
            });
      
            if (emailError) {
              return res.status(400).json({ error: emailError });
            }
      
            res.status(200).json({ message: "Email enviado com sucesso!", data });
          } catch (err) {
            console.error("Erro ao enviar email:", err);
            res.status(500).json({ message: "Erro no servidor" });
          }
        },
      }
}