import { ReactComponent as ArrowIcon } from '../icons/arrow.svg';
import React, { useState, useEffect, useRef } from 'react';
import '../styles/header.scss';
import { toast } from 'react-toastify';

export default function header({ getAllEvents, rules }) {
   const NavItem = (props) => {
      const [open, setOpen] = useState(false);

      return (
         <li className="menu-button">
            <div
               href="#"
               className="icon-button"
               onClick={() => setOpen(!open)}
            >
               {props.icon}
            </div>

            {open && props.children}
         </li>
      );
   };

   const DropdownMenu = () => {
      const [menuHeight, setMenuHeight] = useState(null);
      const dropdownRef = useRef(null);
      useEffect(() => {
         setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
      }, []);
      const DropdownItem = (props) => {
         return (
            <div href="#" className="menu-item" onClick={(e) => testOnClick(e)}>
               <span className="icon-button">{props.leftIcon}</span>
               {props.children}
               <span className="icon-right">{props.rightIcon}</span>
            </div>
         );
      };

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
               <DropdownItem leftIcon="📥" onClick={testOnClick}>
                  Tải tập luật
               </DropdownItem>
            </div>
         </div>
      );
   };

   const createFile = (fileText, name) => {
      const element = document.createElement('a');
      const file = new Blob(fileText, {
         type: 'text/plain',
      });
      element.href = URL.createObjectURL(file);
      element.download = name;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
   };

   const testOnClick = async (e) => {
      if (e.target.innerText.includes('Tải tập luật')) {
         createFile(rules(), 'Rules.txt');
         createFile(await getAllEvents(), 'Events.txt');
      }
   };
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
