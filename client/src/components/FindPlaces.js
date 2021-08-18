import React, { useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import '../styles/boostrap.scss';
import Algorithm from '../process';

export default function FindPlaces({ selectData, rules }) {
   const [selectedOption, setSelectedOption] = useState(null);
   const [events, setEvents] = useState(null);
   const [suggest, setSuggest] = useState(null);
   const [log, setLog] = useState(null);
   const [lastResult, setLastResult] = useState(null);

   const handleChange = (e) => {
      setSelectedOption(e);
   };
   const handleOnClick = () => {
      if (selectedOption === null && events === null) {
         toast.error(`Please choose the events`);
         return;
      }

      if (events === null) {
         let data = selectedOption.map((item) => item.value);
         setSelectedOption(null);
         setEvents(data);
         return;
      } else {
         toast.info('🔄 We are  finding the best place for you !!!', {
            position: 'bottom-right',
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
         });
         let { LOG, lastResult, suggests } = Algorithm.excute(events, rules);

         toast.dismiss();
         toast.success('🚀 Finding places succeed !!!');
         setLog(LOG);
         setLastResult(lastResult);
         setSuggest(suggests);
      }
   };
   const reset = () => {
      setSelectedOption(null);
      setEvents(null);
      setLog(null);
      setLastResult(null);
      setSuggest(null);
   };

   return (
      <div className='container'>
         <div className='row justify-content-center pt-5 mt-5 '>
            <Select
               closeMenuOnSelect={events ? true : false}
               value={selectedOption}
               onChange={(e) => handleChange(e)}
               isMulti={events ? false : true}
               className='w-50'
               isDisabled={lastResult !== null ? true : false}
               options={selectData}
               placeholder='Chọn sự kiện...'
            />
            <button type='button' className='btn btn-primary mx-1' onClick={() => handleOnClick()}>
               {events ? 'Tìm địa điểm' : 'Thêm tập sự kiện'}
            </button>
            {events ? (
               <button type='button' className='btn  btn-light mx-1' onClick={() => reset()}>
                  Chọn lại
               </button>
            ) : null}
         </div>
         <div className='row justify-content-center mt-5 mb-3'>
            {events && (
               <div className='alert alert-success mt-5' role='alert'>
                  {events.map((ele, index) => (
                     <span key={index}>
                        <b>{ele.split(': ')[1]}</b>
                        {index !== events.length - 1 ? '  ^  ' : ' => '}
                     </span>
                  ))}
                  {lastResult !== null && lastResult.length === 1 ? (
                     <b>{lastResult[0]}</b>
                  ) : lastResult !== null && lastResult.length > 1 ? (
                     <b>{lastResult.map((item) => item.split(': ')[1]).join(' v ')}</b>
                  ) : lastResult === null ? null : (
                     <span className='badge badge-danger' style={{ fontSize: '1rem' }}>
                        Không có kết quả
                     </span>
                  )}
               </div>
            )}
         </div>
         <div className='row justify-content-center'>
            {suggest && suggest.length && (
               <div className='alert alert-info' role='alert'>
                  <span className='badge badge-warning' style={{ fontSize: '1rem' }}>
                     Gợi ý:
                  </span>{' '}
                  {suggest.map((ele, index) => (
                     <span key={index}>
                        <b>{ele}</b>
                        {index !== suggest.length - 1 ? '    v    ' : null}
                     </span>
                  ))}
               </div>
            )}
         </div>
         <div className='row mt-5 pb-5 justify-content-between'>
            {log ? (
               <table className='table table-bordered table-hover bg-white col-12'>
                  <thead className='thead-dark'>
                     <tr>
                        <th scope='col'>Quá trình thực hiện thuật toán</th>
                     </tr>
                  </thead>
                  <tbody>
                     {log.map((item, index) => (
                        <tr key={index}>
                           <td
                              className={
                                 item.includes('Lần duyệt thứ') ||
                                 item.includes('=> Xét luật') ||
                                 item.includes('Xét riêng') ||
                                 item.includes('Xét toàn') ||
                                 item.includes('Lọc các kết quả ngoại lệ') ||
                                 item.includes('Chọn ra các kết quả trùng lặp')
                                    ? 'text-left font-weight-bold'
                                    : item.includes('Tìm thấy')
                                    ? 'alert-success pl-5 text-left'
                                    : item.includes('Không tìm')
                                    ? 'alert-danger pl-5 text-left'
                                    : item.includes('lọc trùng')
                                    ? 'alert-secondary pl-5 text-left'
                                    : item.includes('Kết quả cuối cùng')
                                    ? 'alert-warning pl-5 text-left'
                                    : item.includes('Kết thúc thuật toán')
                                    ? 'alert-dark text-left'
                                    : item.includes('Phát hiện sự kiện')
                                    ? 'alert-info text-left'
                                    : 'text-left'
                              }>
                              {item}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            ) : null}
         </div>
      </div>
   );
}
