import React, { useState, useEffect } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import axios from 'axios';

function Home() {
  const [data, setData] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');

  const [isPopupVisible, setPopupVisible] = useState(false);
  const handleCardClick = () => { setPopupVisible(true); };
  const handleClosePopup = () => { setPopupVisible(false);  };
  const [sensorValue, setsensorValue] = useState([]);

  const [ventiladorClicked, setVentiladorClicked] = useState(false);
  const [puertaClicked, setPuertaClicked] = useState(false);
  const [focoClicked, setFocoClicked] = useState(false);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://3.235.58.25:3000/datos');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://3.235.58.25:3000/topicValues');
        if (!response.ok) {
          throw new Error('Failed to fetch sensor values');
        }
        const topicValues = await response.json();
        setsensorValue(topicValues);

        // Verificar si hay una notificación y mostrar la ventana emergente si es el caso
        if (topicValues && topicValues.notificaciones && topicValues.notificaciones.length > 0) {
          const alertMessage = topicValues.notificaciones;
          setAlertMessage(alertMessage);
          setPopupVisible(true);
          const response = await fetch('http://3.235.58.25:3000/clearNotificaciones');
        }

      } catch (error) {
        console.error(error);
      }
    };

    const intervalId = setInterval(fetchData, 1000); // Realiza la solicitud cada segundo
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handlePopupClose = () => {
    setPopupVisible(false);
    setAlertMessage('');
  };

  const handleClick = async (topic, message) => {
    try {
      const response = await axios.post('http://3.235.58.25:3000/publish', {
          topic: topic,
          message: message
      }, {
          headers: {
          'Content-Type': 'application/json'
      }
    });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleVentiladorClick = () => {
    setVentiladorClicked(!ventiladorClicked);
    handleClick('ventilador', ventiladorClicked ? '0' : '1');
  };

  const handlePuertaClick = () => {
    setPuertaClicked(!puertaClicked);
    handleClick('puerta', puertaClicked ? '0' : '1');
  };

  const handleFocoClick = () => {
    setFocoClicked(!focoClicked);
    handleClick('foco', focoClicked ? '0' : '1');
  };

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
                <h1>{sensorValue['sensores/temperatura']}</h1>
            </div>
            
            <div className='card'>
                <div className='card-inner'>
                    <h3 id="humedadH3">Humedad</h3>
                </div>
                <h1>{sensorValue['sensores/humedad']}</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3 id="proximidadH3">Proximidad</h3>
                </div>
                <h1>{sensorValue['sensores/proximidad']}</h1>
            </div>
            
            <div className='card'>
                <div className='card-inner'>
                    <h3 id="iluminacionH3">Iluminación</h3>
                </div>
                <h1>{sensorValue['sensores/luz']}</h1>
            </div>

            <div className='card'>
                <div className='card-inner'>
                    <h3 id="calidadDelAireH3">Calidad del Aire</h3>
                </div>
                <h1>{sensorValue['sensores/aire']}</h1>
            </div>
        
        </div> 

        <div className='main-title'>
        <h3>Actuador / Puerta / Iluminación </h3>
      </div>

      <div className='main-cards'>
        <div className={ventiladorClicked ? 'card clicked' : 'card'} onClick={handleVentiladorClick}>
          <div className='card-inner'>
            <h3>Ventiladores</h3>               
          </div>
          <h1></h1>
        </div>

        <div className={puertaClicked ? 'card clicked' : 'card'} onClick={handlePuertaClick}>
          <div className='card-inner'>
            <h3>Puerta</h3>               
          </div>
          <h1></h1>
        </div>

        <div className={focoClicked ? 'card clicked' : 'card'} onClick={handleFocoClick}>
          <div className='card-inner'>
            <h3>Foco</h3>               
          </div>
          <h1></h1>
        </div> 
      </div> 

        {/*{isPopupVisible && (
        <div className="popup-window">
          <div>
            <h3>Cerrar Puerta</h3>
            <button onClick={handleClosePopup}>Cancelar</button>
            <button onClick={() => console.log('Botón Guardar clickeado')}>Guardar</button>
          </div>
        </div>)}*/}
        {isPopupVisible && (
        <div className="popup-window">
          <div>
            <h3>Alerta</h3>
            <p>{alertMessage}</p>
            <button onClick={handlePopupClose}>Cerrar</button>
          </div>
        </div>
      )}

        <div className='main-title'>
            <h3>Historial</h3>
        </div>

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
                <td>{entry.tiempo}</td>
                <td>{entry.temperatura}</td>
                <td>{entry.humedad}</td>
                <td>{entry.proximidad}</td>
                <td>{entry.aire}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </main>
  )
}

export default Home;




  //useEffect(() => {
  //  const fetchAlert = async () => {
  //    try {
  //      const response = await axios.get('http://localhost:3000/alert');
  //      if (response.data && response.data.message) {
  //        setAlertMessage(response.data.message);
  //        setPopupVisible(true);
  //      }
  //    } catch (error) {
  //      console.error('Error al obtener la alerta:', error);
  //    }
  //  };
//
  //  const intervalId = setInterval(fetchAlert, 5000); // Realiza la solicitud cada 5 segundos
  //  return () => clearInterval(intervalId);
  //}, []);