import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import * as api from '../apis';
import { toast } from 'react-toastify';
import '../styles/boostrap.scss';

export default function CreateRules({ selectData, children, loadAllRule }) {
   const [selectedOption, setSelectedOption] = useState([]);
   const [options, setOptions] = useState(null);
   const [events, setEvents] = useState(null);

   const handleChange = (e) => {
      setSelectedOption(e);
   };

   const handleInputOnChange = (e) => {
      let event = e.target.value;
      setEvents(event);
   };

   useEffect(() => {
      let data = selectData.map((item) => ({
         value: item.value,
         label: item.label,
      }));
      data.push({ value: 'ADD_EVENT_TYPES', label: 'Thêm loại tập luật' });
      setOptions(data);
   }, [selectData]);

   const handleOnClick = async () => {
      if (!selectedOption || !events) {
         toast.error(`You have to choose Events Type and events`);
         return;
      }
      try {
         toast.info('🔄 Creating event/event type !!!', {
            position: 'bottom-right',
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
         });
         let res = null;

         if (selectedOption.value === 'ADD_EVENT_TYPES') {
            res = await api.createEventType({ eventType: events });
         } else {
            res = await api.createEvent({ ID: selectedOption.value, event: events });
         }

         toast.dismiss();
         if (res.data.code === 1) {
            toast.success('🚀 Creating event/event type succeed !!!');
         } else {
            toast.error(`🔥 Creating event/event type failed. ${res.data.message}`);
         }
      } catch (ex) {
         toast.error(`🔥 Creating event/events type failed. ${ex.message}`);
      }
   };

   return (
      <div className='container'>
         <div className='row justify-content-center pt-5 mt-5 '>
            {options !== null ? (
               <Select
                  defaultValue={selectedOption[0]}
                  value={selectedOption}
                  onChange={(e) => handleChange(e)}
                  className='col-3'
                  options={options}
                  placeholder='Chọn sự kiện...'
                  isDisabled={selectData.length ? false : true}
               />
            ) : null}

            <input
               type='text'
               className='form-control col-5'
               placeholder='Nhập nội dung ...'
               aria-label='Nhập sự kiện'
               aria-describedby='basic-addon2'
               onChange={handleInputOnChange}
            />

            <button type='button' className='btn btn-primary mx-1' onClick={() => handleOnClick()}>
               Thêm nội dung
            </button>
         </div>

         <div className='row mt-5 pb-5 justify-content-between'>{children}</div>
      </div>
   );
}
