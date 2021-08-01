import React from 'react';
import Select from 'react-select';
import '../styles/main.scss';

export default function Main({ selectData, children }) {
   const handleOnChange = (e) => {
      console.log(e);
   };
   return (
      <div className="container">
         <div className="row justify-content-center py-5 mt-5 ">
            <Select
               closeMenuOnSelect={false}
               onChange={(e) => handleOnChange(e)}
               isMulti
               className="w-50"
               options={selectData}
            />
            <button type="button" className="btn btn-primary mx-1">
               Thêm
            </button>
            <button type="button" className="btn btn-warning mx-1">
               Chọn kết quả
            </button>
         </div>
         <div className="row mt-5">{children}</div>
      </div>
   );
}
