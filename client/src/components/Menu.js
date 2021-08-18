import React, { useState, useEffect, useRef } from 'react';
import '../styles/menu.scss';
import { PageType } from '../config/PageType';

export default function Menu({ getAllEvents, rules, setPage }) {
   const NavItem = (props) => {
      const [open, setOpen] = useState(false);

      return (
         <li className='menu-button'>
            <div href='#' className='icon-button' onClick={() => setOpen(!open)}>
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
            <div href='#' className='menu-item' onClick={(e) => testOnClick(e)}>
               <span className='icon-button'>{props.leftIcon}</span>
               {props.children}
               <span className='icon-right'>{props.rightIcon}</span>
            </div>
         );
      };

      return (
         <div className='dropdown' style={{ height: menuHeight, zIndex: '1' }} ref={dropdownRef}>
            <div className='menu'>
               <DropdownItem goToMenu='main' leftIcon='📝' onClick={testOnClick}>
                  Tạo tập luật
               </DropdownItem>
               <DropdownItem leftIcon='🗃️' onClick={testOnClick}>
                  Quản lý sự kiện
               </DropdownItem>
               <DropdownItem leftIcon='🗺' onClick={testOnClick}>
                  Tìm địa điểm
               </DropdownItem>
               <DropdownItem leftIcon='📥' onClick={testOnClick}>
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

      if (e.target.innerText.includes('Tìm địa điểm')) {
         setPage(PageType.FIND_PLACES);
      }

      if (e.target.innerText.includes('Quản lý sự kiện')) {
         setPage(PageType.MANAGE_EVENTS);
      }

      if (e.target.innerText.includes('Tạo tập luật')) {
         setPage(PageType.CREATE_RULES);
      }
   };
   return (
      <NavItem icon={<i className='fas fa-bars'></i>}>
         <DropdownMenu></DropdownMenu>
      </NavItem>
   );
}
