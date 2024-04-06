import React from 'react';

const PopupWindow = ({ onClose }) => {
  return (
    <div className="popup-window">
      <table>
        <thead>
          <tr>
            <th>Columna 1</th>
            <th>Columna 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dato 1</td>
            <td>Dato 2</td>
          </tr>
        </tbody>
      </table>
      <div>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default PopupWindow;
