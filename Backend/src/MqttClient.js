const express = require('express');
const http = require('http');
const mysql = require('mysql');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const options = {
  host: 'sff234f1.ala.us-east-1.emqxsl.com',
  port: 8883,
  protocol: 'mqtts',
  username: 'grupo1_arqui2_2024',
  password: "kCg!68cay-8uZX7"
};

const client = mqtt.connect(options);
const topics = ['sensores/temperatura', 'sensores/humedad', 'sensores/proximidad', 'sensores/luz', 'sensores/aire','notificacion/aire','notificaciones'];
const topicValues = {};

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

client.on('message', (receivedTopic, message) => {
  if (topics.includes(receivedTopic)) {
    topicValues[receivedTopic] = message.toString();
    console.log('Mensaje recibido en el topic', receivedTopic, ':', message.toString());
  }
});

app.get('/topicValues', (req, res) => {
  res.json(topicValues);
});

app.get('/clearNotificaciones', (req, res) => {
  if (topicValues.hasOwnProperty('notificacion/aire')) {
    delete topicValues['notificacion/aire'];
    res.send('La clave "notificaciones" ha sido eliminada.');
  } else {
    res.send('La clave "notificaciones" no existe en el diccionario.');
  }
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

// Endpoint GET para obtener los valores de la base de datos
app.get('/datos', (req, res) => {
  const sql = "SELECT tiempo, temperatura, humedad, proximidad, aire, luz FROM datos ORDER BY id DESC LIMIT 10";
  con.query(sql, (err, result) => {
    if (err) {
      console.error('Error al ejecutar consulta SELECT:', err);
      res.status(500).json({ error: 'Error al obtener los datos' });
    } else {
      // Si la consulta se realiza correctamente, enviar los resultados al cliente
      res.json(result);
    }
  });
});


const interval = setInterval(insertValues, 3000);
//con.end();





