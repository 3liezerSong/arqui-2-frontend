import React, { useState, useEffect } from 'react';
//import { io } from 'socket.io-client';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

function Home() {

  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleCardClick = () => { setPopupVisible(true); };

  const handleClosePopup = () => { setPopupVisible(false);  };

  const [sensorValues, setSensorValues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://3.228.217.70:3000/topicValues');
        if (!response.ok) {
          throw new Error('Failed to fetch sensor values');
        }
        const topicValues = await response.json();
        setSensorValues(topicValues);
      } catch (error) {
        console.error(error);
      }
    };

    const intervalId = setInterval(fetchData, 1000); // Realiza la solicitud cada segundo
    return () => {
      clearInterval(intervalId);
    };
  }, []);

    const data = [
        {
          name: 'Date 1',
          temperatura: 40,
          humedad: 24,
          proximidad: 10,
          calidad_aire:10,
        },
        {
          name: 'Date 2',
          temperatura: 30,
          humedad: 13,
          proximidad: 9,
          calidad_aire:10,
        },
        {
          name: 'Date 3',
          temperatura: 20,
          humedad: 98,
          proximidad: 15,
          calidad_aire:10,
        },
        {
          name: 'Date 4',
          temperatura: 27,
          humedad: 39,
          proximidad: 20,
          calidad_aire:10,
        },
        {
          name: 'Date 5',
          temperatura: 18,
          humedad: 48,
          proximidad: 10,
          calidad_aire:10,
        },
        {
          name: 'Date 6',
          temperatura: 23,
          humedad: 38,
          proximidad: 10,
          calidad_aire:10,
        },
        {
          name: 'Date 7',
          temperatura: 34,
          humedad: 43,
          proximidad: 15,
          calidad_aire:50,
        },
      ];
    
  return (
    <main className='main-container'>
        <div className='main-title'>
            <h3>Resultados en tiempo real</h3>
        </div>

        <div className='main-cards'>
            <div className='card' onClick={handleCardClick}>
                <div className='card-inner'>
                    <h3 id="temperaturaH3">Temperatura</h3>                   
                </div>
                <h1>{sensorValues['Temperatura']}</h1>
            </div>
            
            <div className='card'>
                <div className='card-inner'>
                    <h3 id="humedadH3">Humedad</h3>
                </div>
                <h1>{sensorValues['Humedad']}</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3 id="proximidadH3">Proximidad</h3>
                </div>
                <h1>{sensorValues['Proximidad']}</h1>
            </div>
            
            <div className='card'>
                <div className='card-inner'>
                    <h3 id="iluminacionH3">Iluminación</h3>
                </div>
                <h1>{sensorValues['Iluminacion']}</h1>
            </div>

            <div className='card'>
                <div className='card-inner'>
                    <h3 id="calidadDelAireH3">Calidad del Aire</h3>
                </div>
                <h1>{sensorValues['CalidadDelAire']}</h1>
            </div>

            <div className='card'>
                <div className='card-inner'>
                    <h3 id="actuadorH3">Actuador</h3>               
                </div>
                <h1>{sensorValues['Actuador']}</h1>
            </div>
        </div>     
        
        {isPopupVisible && (
        <div className="popup-window">
          <div>
            <h3>Desear Guardar la informacion</h3>
            <button onClick={handleClosePopup}>Cancelar</button>
            <button onClick={() => console.log('Botón Guardar clickeado')}>Guardar</button>
          </div>
        </div>
      )}

        <div className='charts'>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" display="none"/>
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="humedad" fill="#2962ff" />
                <Bar dataKey="temperatura" fill="#ff6d00" />
                <Bar dataKey="proximidad" fill="#2e7d32" />
                <Bar dataKey="calidad_aire" fill="#d50000" />
                </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                  
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" display="none" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="humedad" stroke="#2962ff" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="temperatura" stroke="#ff6d00" />
                <Line type="monotone" dataKey="proximidad" stroke="#2e7d32" />
                <Line type="monotone" dataKey="calidad_aire" stroke="#d50000" />
                </LineChart>
            </ResponsiveContainer>

        </div>
    </main>
  )
}

export default Home;