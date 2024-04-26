import React, { useState, useEffect } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

function Home() {

  const [isPopupVisible, setPopupVisible] = useState(false);
  const handleCardClick = () => { setPopupVisible(true); };
  const handleClosePopup = () => { setPopupVisible(false);  };
  const [sensorValues, setSensorValues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/topicValues');
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
                <h1>{sensorValues['sensores/temperatura']}</h1>
            </div>
            
            <div className='card'>
                <div className='card-inner'>
                    <h3 id="humedadH3">Humedad</h3>
                </div>
                <h1>{sensorValues['sensores/humedad']}</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3 id="proximidadH3">Proximidad</h3>
                </div>
                <h1>{sensorValues['sensores/proximidad']}</h1>
            </div>
            
            <div className='card'>
                <div className='card-inner'>
                    <h3 id="iluminacionH3">Iluminación</h3>
                </div>
                <h1>{sensorValues['sensores/luz']}</h1>
            </div>

            <div className='card'>
                <div className='card-inner'>
                    <h3 id="calidadDelAireH3">Calidad del Aire</h3>
                </div>
                <h1>{sensorValues['sensores/aire']}</h1>
            </div>

            <div className='card'>
                <div className='card-inner'>
                    <h3 id="actuadorH3">Actuador</h3>               
                </div>
                <h1>{sensorValues['notificacion/aire']}</h1>
            </div>

        </div>     
        
        {isPopupVisible && (
        <div className="popup-window">
          <div>
            <h3>Cerrar Puerta</h3>
            <button onClick={handleClosePopup}>Cancelar</button>
            <button onClick={() => console.log('Botón Guardar clickeado')}>Guardar</button>
          </div>
        </div>
      )}

       {/* </div>
        <div className='table-container'>
        <table className='data-table'>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Temperatura</th>
              <th>Humedad</th>
              <th>Proximidad</th>
              <th>Calidad del Aire</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index}>
                <td>{entry.name}</td>
                <td>{entry.temperatura}</td>
                <td>{entry.humedad}</td>
                <td>{entry.proximidad}</td>
                <td>{entry.calidad_aire}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>*/}
     
    </main>
  )
}

export default Home;