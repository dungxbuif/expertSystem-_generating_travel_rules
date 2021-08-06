import React, { useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import '../styles/boostrap.scss';
import Algorithm from '../process';
import _ from 'lodash';

export default function FindPlaces({
   selectData,
   children,
   loadAllRule,
   rules,
}) {
   const [selectedOption, setSelectedOption] = useState(null);
   const [events, setEvents] = useState(null);
   const [log, setLog] = useState(null);

   const handleChange = (e) => {
      setSelectedOption(e);
   };
   const handleOnClick = () => {
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
         let process = Algorithm.excute(events, rules);
         toast.dismiss();
         toast.success('🚀 Creating rule succeed !!!');
         setLog(process);
      }
   };
   const reset = () => {
      setEvents(null);
   };
   // const handleSave = async () => {
   //    const sendResult = result.value;
   //    let sendData = {
   //       result: sendResult,
   //       events,
   //    };
   //
   //    const res = await api.createNewRule(sendData);
   //    if (res.data.code === 1) {
   //       toast.dismiss();
   //       toast.success('🚀 Creating rule succeed !!!');
   //       reset();
   //       loadAllRule();
   //    } else if (res.data.code === 2) {
   //       toast.dismiss();
   //       toast.warning(`📑 ${res.data.message}`);
   //    } else {
   //       toast.dismiss();
   //       toast.error('🔥 Creating rule failed !!!');
   //    }
   // };
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
            <button
               type="button"
               className="btn btn-primary mx-1"
               onClick={() => handleOnClick()}
            >
               {events ? 'Tìm địa điểm' : 'Thêm tập sự kiện'}
            </button>
            {events ? (
               <button
                  type="button"
                  className="btn  btn-light mx-1"
                  onClick={() => reset()}
               >
                  Chọn lại
               </button>
            ) : null}
         </div>
         <div className="row justify-content-center mt-5">
            {events && (
               <div className="alert alert-success mt-5" role="alert">
                  {events.map((ele, index) => (
                     <span key={index}>
                        <b>{ele}</b>
                        {index !== events.length - 1 ? '  ^  ' : null}
                     </span>
                  ))}
               </div>
            )}
         </div>
         <div className="row mt-5 pb-5 justify-content-between">
            {log ? (
               <table className="table table-bordered table-hover bg-white col-12">
                  <thead className="thead-dark">
                     <tr>
                        <th scope="col">Quá trình thực hiện thuật toán</th>
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
                                 item.includes('Xét toàn')
                                    ? 'text-left font-weight-bold'
                                    : item.includes('Tìm thấy')
                                    ? 'alert-success pl-5 text-left'
                                    : item.includes('Không tìm thấy luật thỏa')
                                    ? 'alert-danger pl-5 text-left'
                                    : item.includes('Kết thúc thuật toán')
                                    ? 'alert-primary pl-5 text-left'
                                    : item.includes('lọc trùng')
                                    ? 'alert-secondary pl-5 text-left'
                                    : item.includes('Kết quả cuối cùng')
                                    ? 'alert-warning pl-5 text-left'
                                    : 'text-left'
                              }
                              scope="row"
                           >
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
