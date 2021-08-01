import { ReactComponent as ArrowIcon } from '../icons/arrow.svg';
import React, { useState, useEffect, useRef } from 'react';
import '../styles/header.scss';
export default function header() {
   return (
      <div className="header-container">
         <div className="header-content">
            <NavItem icon={<i className="fas fa-bars"></i>}>
               <DropdownMenu></DropdownMenu>
            </NavItem>
         </div>
      </div>
   );
}

function NavItem(props) {
   const [open, setOpen] = useState(false);

   return (
      <li className="menu-button">
         <div href="#" className="icon-button" onClick={() => setOpen(!open)}>
            {props.icon}
         </div>

         {open && props.children}
      </li>
   );
}

function DropdownMenu() {
   const [menuHeight, setMenuHeight] = useState(null);
   const dropdownRef = useRef(null);

   useEffect(() => {
      setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
   }, []);
   function DropdownItem(props) {
      return (
         <div href="#" className="menu-item">
            <span className="icon-button">{props.leftIcon}</span>
            {props.children}
            <span className="icon-right">{props.rightIcon}</span>
         </div>
      );
   }

   return (
      <div
         className="dropdown"
         style={{ height: menuHeight, zIndex: '1' }}
         ref={dropdownRef}
      >
         <div className="menu">
            <DropdownItem goToMenu="main" leftIcon="📝">
               Tạo tập luật
            </DropdownItem>
            <DropdownItem leftIcon="🗃️">Quản lý loại sự kiện</DropdownItem>
            <DropdownItem leftIcon="🏷️">Quản lý sự kiện</DropdownItem>
            <DropdownItem leftIcon="📄">Quản lý luật</DropdownItem>
            <DropdownItem leftIcon="🙈">Xem dữ liêu</DropdownItem>
         </div>
      </div>
   );
}
