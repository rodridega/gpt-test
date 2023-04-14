
// Importar las librerías necesarias
const TelegramBot = require('node-telegram-bot-api');
const OpenAI = require('openai');

// Configurar el bot de Telegram y la API de ChatGPT
const botToken = process.env.BOTTOKEN;
const openaiApiKey = process.env.OATOKEN;

const bot = new TelegramBot(botToken, { polling: true });
const openai = new OpenAI(openaiApiKey);

// Función para responder a los mensajes del usuario
async function responderMensaje(mensaje) {
  try {
    // Llamar a la API de ChatGPT para obtener la respuesta
    const respuesta = await openai.complete({
      engine: 'davinci',
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
