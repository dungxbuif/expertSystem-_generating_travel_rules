import React, { useState } from 'react';
import Select from 'react-select';
import '../styles/main.scss';
import * as api from '../apis';
import { toast } from 'react-toastify';

export default function Main({ selectData, children, loadAllRule }) {
   const [selectedOption, setSelectedOption] = useState(null);
   const [events, setEvents] = useState(null);
   const [result, setResult] = useState(null);

   const handleChange = (e) => {
      setSelectedOption(e);
   };
   const handleOnClick = () => {
      if (selectedOption && events === null) {
         let data = selectedOption.map((item) => item.value);
         setSelectedOption(null);
         setEvents(data);
         return;
      }

      if (result === null) {
         setResult(selectedOption);
         setSelectedOption(null);

         return;
      }
   };

   const handleSave = async () => {
      const sendResult = result.value;
      let sendData = {
         result: sendResult,
         events,
      };
      toast.info('🔄 Creating rule !!!', {
         position: 'bottom-right',
         autoClose: false,
         hideProgressBar: false,
         closeOnClick: false,
         pauseOnHover: false,
         draggable: false,
         progress: undefined,
      });
      const res = await api.createNewRule(sendData);
      if (res.data.code === 1) {
         toast.dismiss();
         toast.success('🚀 Creating rule succeed !!!');
         loadAllRule();
      } else {
         toast.error('🔥 Creating rule failed !!!');
      }
   };
   return (
      <div className="container">
         <div className="row justify-content-center pt-5 mt-5 ">
            <Select
               closeMenuOnSelect={events ? true : false}
               value={selectedOption}
               onChange={(e) => handleChange(e)}
               isMulti={events ? false : true}
               className="w-50"
               options={selectData}
               placeholder="Chọn sự kiện..."
            />
            {result ? null : (
               <button
                  type="button"
                  className="btn btn-primary mx-1"
                  onClick={() => handleOnClick()}
               >
                  {events ? 'Chọn kết quả' : 'Chọn tập sự kiện'}
               </button>
            )}
            {!result ? null : (
               <button
                  type="button"
                  className="btn btn-warning mx-1"
                  onClick={() => handleSave()}
               >
                  Lưu
               </button>
            )}
         </div>
         <div className="row justify-content-center">
            {events && (
               <div className="alert alert-success mt-5" role="alert">
                  {events.map((ele, index) => (
                     <span key={index}>
                        <b>{ele}</b>
                        {index != events.length - 1 ? '  ^  ' : '  =>'}
                     </span>
                  ))}
                  {result != null ? <b>{result.value}</b> : null}
               </div>
            )}
         </div>
         <div className="row mt-5 pb-5 justify-content-between">{children}</div>
      </div>
   );
}
