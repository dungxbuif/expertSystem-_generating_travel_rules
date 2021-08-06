import React from 'react';

export default function Rules({ rules }) {
   return (
      <>
         <table className="table table-bordered table-hover bg-white col-12">
            <thead className="thead-dark">
               <tr>
                  <th scope="col">Sự kiện</th>
                  <th scope="col">Kết quả</th>
               </tr>
            </thead>
            <tbody>
               {rules.map((item) => (
                  <tr key={item.id} style={{ cursor: 'pointer' }}>
                     <td className="text-center" scope="row">
                        {item.events.map((ele, index) => (
                           <span key={index}>
                              <b>{ele}</b>
                              {index != item.events.length - 1
                                 ? '  ^  '
                                 : '  =>'}
                           </span>
                        ))}
                     </td>

                     <td>
                        <b>{item.result}</b>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </>
   );
}
