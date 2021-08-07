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
                     <td
                        className="text-center vertical-align-middle font-weight-bold"
                        scope="row"
                     >
                        {item.events.join(' ^ ')}
                     </td>

                     <td className="d-flex justify-content-between align-items-center">
                        <b>{item.result}</b>
                        {/* <button className="btn btn-danger">Xóa</button> */}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </>
   );
}
