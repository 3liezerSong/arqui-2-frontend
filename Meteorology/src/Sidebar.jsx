import React from 'react'
import { BsGrid1X2Fill, BsMenuButtonWideFill } from 'react-icons/bs'

function Sidebar({openSidebarToggle}) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <BsGrid1X2Fill className='icon'/> Meteorology
            </div>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsMenuButtonWideFill className='icon'/> Reportes
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsMenuButtonWideFill className='icon'/> Historial
                </a>
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar