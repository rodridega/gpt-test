
// Importar las librerías necesarias
const TelegramBot = require('node-telegram-bot-api');
const { OpenAIApi, Configuration } = require('openai');
require('dotenv').config()

const openaiApiKey = process.env.OATOKEN;
const botToken = process.env.BOTTOKEN;

const configuration = new Configuration({
  apiKey: openaiApiKey
})


// Configurar el bot de Telegram y la API de ChatGPT

const bot = new TelegramBot(botToken, { polling: true });
const openai = new OpenAIApi(configuration);

const mensajesPrevios = []

// Función para responder a los mensajes del usuario
async function responderMensaje(mensaje) {

  try {
    // Llamar a la API de ChatGPT para obtener la respuesta
    const nuevoMsj = [{ role: "user", content: mensaje.text }]
    mensajesPrevios.push(nuevoMsj[0])
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: mensajesPrevios,
      temperature: 0.9
    });

    console.log(response.data.choices[0].message);


    mensajesPrevios.push(response.data.choices[0].message)

    // Enviar la respuesta a través del bot de Telegram
    bot.sendMessage(mensaje.chat.id, response.data.choices[0].message.content);
  } catch (error) {
    console.log(error.message)

  }
}

// Escuchar los mensajes del usuario
bot.on('message', responderMensaje);
