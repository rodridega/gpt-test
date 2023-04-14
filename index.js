
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


// Función para responder a los mensajes del usuario
async function responderMensaje(mensaje) {
  try {    
    // Llamar a la API de ChatGPT para obtener la respuesta
    const respuesta = await openai.createCompletion({
      model: 'davinci',
      prompt: mensaje.text,
      maxTokens: 100,
      n: 1,
      stop: '\n',
      temperature: 0.5,
    });

    // Enviar la respuesta a través del bot de Telegram
    bot.sendMessage(mensaje.chat.id, respuesta.data.choices[0].text);
  } catch (error) {
    console.log(error);
  }
}

// Escuchar los mensajes del usuario
bot.on('message', responderMensaje);
