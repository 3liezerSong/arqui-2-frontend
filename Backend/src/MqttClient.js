const express = require('express');
const http = require('http');
const mysql = require('mysql');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
app.use(cors());

const options = {
  host: 'sff234f1.ala.us-east-1.emqxsl.com',
  port: 8883,
  protocol: 'mqtts',
  username: 'grupo1_arqui2_2024',
  password: "kCg!68cay-8uZX7"
};

const client = mqtt.connect(options);
const topics = ['sensores/temperatura', 'sensores/humedad', 'sensores/proximidad', 'sensores/luz', 'sensores/aire','notificacion/aire','notificacion/luz'];
const topicValues = {'sensores/temperatura': "10", 'sensores/humedad': "20",
'sensores/proximidad' : "30", 'sensores/luz' : "40", 'sensores/aire': "50",
'notificacion/luz': "60"
};

client.on('connect', () => {
  console.log('Conexión exitosa al broker MQTT.');
  topics.forEach((topic) => {
    client.subscribe(topic, (err) => {
      if (err) {  console.error('Error: error al intentar suscribirse al topic: ', err);
      } else {    console.log('Suscrito al topic: ', topic); }
    });
  });
});

client.on('error', (error) => { console.error('Error: error en la conexión a MQTT:', error); });


app.post('/publish', (req, res) => {
  const { topic, message } = req.body; 
  client.publish(topic, message, (err) => {
    if (err) {
      console.error(`Error al publicar mensaje en ${topic}:`, err);
      res.status(500).send(`Error al publicar mensaje en ${topic}`);
    } else {
      console.log(`Mensaje publicado correctamente en ${topic}:`, message);
      res.send(`Mensaje publicado correctamente en ${topic}: ${message}`);
    }
  });
});

app.get('/topicValues', (req, res) => {
  res.json(topicValues);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor HTTP iniciado en http://localhost:${PORT}`); 
  const { exec } = require('child_process');
  exec(`open http://localhost:${PORT}`);
});

// Configuración de la conexión a la base de datos
const con = mysql.createConnection({
  host: '34.173.229.176', user: 'root', password: "9$C@lg*`npK[*3/b", database: "Arqui2"
});

con.connect((err) => {
  if (err) { console.error('Error al conectar a la base de datos:', err);
    return;
  }else {console.log('Conexión exitosa a la base de datos MySQL.');}
});

// Definir la función para insertar valores en la base de datos
function insertValues() {
  const temperatura = topicValues['sensores/temperatura'];
  const humedad = topicValues['sensores/humedad'];
  const proximidad = topicValues['sensores/proximidad'];
  const luz = topicValues['sensores/luz'];
  const aire = topicValues['sensores/aire'];

  const sql = "INSERT INTO datos (humedad, temperatura, aire, luz, proximidad) VALUES (?, ?, ?, ?, ?)";
  con.query(sql, [humedad, temperatura, aire, luz, proximidad], function (err, result) {
    if (err) {
      console.error('Error al insertar registro:', err);
      return;
    }
  });
}

const interval = setInterval(insertValues, 1000);
//con.end();





