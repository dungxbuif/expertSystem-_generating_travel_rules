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
      console.log(e.target.value);
   };

   useEffect(() => {
      let data = selectData.map((item) => ({
         value: item.value,
         label: item.label,
      }));
      setOptions(data);
   }, [selectData]);

   const handleOnClick = () => {
      if (!selectedOption || !events) {
         toast.error(`You have to choose Events Type and events`);
         return;
      }
   };
   const reset = () => {
      setEvents(null);
   };
   const handleSave = async () => {
      const sendResult = events.value;
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
         reset();
         loadAllRule();
      } else if (res.data.code === 2) {
         toast.dismiss();
         toast.warning(`📑 ${res.data.message}`);
      } else {
         toast.dismiss();
         toast.error('🔥 Creating rule failed !!!');
      }
   };
   return (
      <div className="container">
         <div className="row justify-content-center pt-5 mt-5 ">
            {options !== null ? (
               <Select
                  defaultValue={selectedOption[0]}
                  value={selectedOption}
                  onChange={(e) => handleChange(e)}
                  className="col-3"
                  options={options}
                  placeholder="Chọn sự kiện..."
                  isDisabled={selectData.length ? false : true}
               />
            ) : null}

            <input
               type="text"
               className="form-control col-5"
               placeholder="Nhập sự kiện ..."
               aria-label="Nhập sự kiện"
               aria-describedby="basic-addon2"
               onChange={handleInputOnChange}
            />

            <button
               type="button"
               className="btn btn-primary mx-1"
               onClick={() => handleOnClick()}
            >
               Thêm sự Kiện
            </button>
         </div>

         <div className="row mt-5 pb-5 justify-content-between">{children}</div>
      </div>
   );
}
