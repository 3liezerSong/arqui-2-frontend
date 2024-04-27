require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();

// Configuración de CORS
app.use(cors());

const options = {
  host: 'sff234f1.ala.us-east-1.emqxsl.com',
  port: 8883,
  protocol: 'mqtts',
  username: 'grupo1_arqui2_2024',
  password: "kCg!68cay-8uZX7"
};

const client = mqtt.connect(options);
const topics = ['notificaciones'];

//---------------LOGS-------------
client.on('connect', () => {
  console.log('Conexión exitosa al broker MQTT.');
  topics.forEach((topic) => {
    client.subscribe(topic, (err) => {
      if (err) {
        console.error('Error: error al intentar suscribirse al topic: ', err);
      } else {
        console.log('Suscrito al topic: ', topic);
      }
    });
  });

  // Publicar un mensaje en el topic 'notificaciones'
  const mensaje = "Mensaje de prueba";
  client.publish('notificaciones', mensaje, (err) => {
    if (err) {
      console.error('Error al publicar mensaje en el topic "notificaciones":', err);
    } else {
      console.log('Mensaje publicado correctamente en el topic "notificaciones":', mensaje);
    }
  });
});

client.on('error', (error) => {
  console.error('Error: error en la conexión a MQTT:', error);
});
