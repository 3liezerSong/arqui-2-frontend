require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const http = require('http');
//const socketIo = require('socket.io');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
//const io = socketIo(server);

// Configuración de CORS
app.use(cors());

// Configuración de la conexión a la base de datos
const con = mysql.createConnection({
  host: '34.173.229.176', 
  user: 'root', 
  password: '9$C@lg*`npK[*3/b'
});

// Conexión a la base de datos
con.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

const options = {
  host: 'sff234f1.ala.us-east-1.emqxsl.com',
  port: 8883,
  protocol: 'mqtts',
  username: 'grupo1_arqui2_2024',
  password: "kCg!68cay-8uZX7"
};

const client = mqtt.connect(options);
const topics = ['Temperatura', 'Humedad', 'Proximidad', 'Iluminacion', 'CalidadDelAire', 'Actuador'];

//---------------LOGS-------------
client.on('connect', () => {
  console.log('Conexión exitosa al broker MQTT.');
  topics.forEach((topic) => {
    client.subscribe(topic, (err) => {
      if (err) {  console.error('Error: error al intentar suscribirse al topic: ', err);
      } else {    console.log('Suscrito al topic: ', topic); }
    });
  });
});


client.on('error', (error) => {
  console.error('Error: error en la conexión a MQTT:', error);
});

const topicValues = {};

client.on('message', (receivedTopic, message) => {
  if (topics.includes(receivedTopic)) {
    topicValues[receivedTopic] = message.toString();
    console.log('Mensaje recibido en el topic', receivedTopic, ':', message.toString());
  }
});

app.get('/topicValues', (req, res) => {
  res.json(topicValues);
  console.log(topicValues);
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor HTTP y WebSocket iniciado en el puerto ${PORT}`);
});



/*
// Enviar mensaje MQTT desde el frontend
socket.emit('send_mqtt_message', {
  topic: 'mi/tema/mqtt',
  payload: 'Mensaje MQTT desde el frontend'
});

*/

//const humedad = 60; // Ejemplo de valor de humedad (deberías obtener este valor de algún sensor o fuente de datos)
//client.publish('Humedad', humedad.toString(), (err) => {
//  if (err) {
//    console.error('Error al publicar mensaje de humedad:', err);
//  } else {
//    console.log('Mensaje de humedad publicado correctamente:', humedad);
//  }
//});



// Manejar mensajes desde el frontend hacia MQTT
//io.on('connection', (socket) => {
//  console.log('Nuevo cliente WebSocket conectado');
//  socket.on('send_mqtt_message', (data) => {
//    const { topic, payload } = data;
//    console.log(`Enviando mensaje al topic ${topic}: ${payload}`);
//    client.publish(topic, payload);
//  });
//});

// Servir el frontend estático
//app.use(express.static('public'));
// Servir el frontend estático