import React from 'react';

export default function Events({ events }) {
   return (
      <>
         <table className="table table-bordered table-hover col-12 bg-white">
            <thead className="thead-dark">
               <tr>
                  <th scope="col">Loại sự kiện</th>
                  <th scope="col">Sự Kiện</th>
               </tr>
            </thead>
            <tbody>
               {events.map((item) =>
                  item.options.map((ele, index) => (
                     <tr key={index}>
                        {index === 0 ? (
                           <th
                              className="font-weight-bold align-middle text-center"
                              scope="row"
                              rowSpan={item.options.length}
                           >
                              {item.label}
                           </th>
                        ) : null}
                        <td>{ele.label}</td>
                     </tr>
                  ))
               )}
            </tbody>
         </table>
      </>
   );
}
