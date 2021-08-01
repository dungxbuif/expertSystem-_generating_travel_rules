import Header from './components/Header';
import Main from './components/Main';
import { useState, useEffect } from 'react';
import * as api from './apis';
import { ToastContainer, toast } from 'react-toastify';

function App() {
   const [selectData, setSelectData] = useState([]);
   useEffect(() => {
      toast.info('🔄 Loading select !!!', {
         position: 'bottom-right',
         autoClose: false,
         hideProgressBar: false,
         closeOnClick: false,
         pauseOnHover: false,
         draggable: false,
         progress: undefined,
      });
      const getGroupEvents = async () => {
         const res = await api.getGroupEvents();
         if (res.data.code === 1) {
            const eventTypesArr = [...res.data.data[0]];
            const eventTypesObj = Object.fromEntries(
               eventTypesArr.map((item) => [
                  item[0],
                  { label: item[1], options: [] },
               ])
            );
            const eventsArr = [...res.data.data[1]];
            eventsArr.forEach((ele) => {
               eventTypesObj[ele[1]].options.push({
                  label: ele[2],
                  value: `${ele[1]}-${ele[2]}`,
               });
            });
            const data = Object.values(eventTypesObj);
            setSelectData(data);
            toast.dismiss();
            toast.success('🚀 Loading select succeed !!!');
         } else {
            toast.error('🔥 Loading failed !!!');
         }
      };

      getGroupEvents();
   }, []);
   return (
      <>
         <Header />
         <Main selectData={selectData}>
            {selectData.length !== 0 ? <Events events={selectData} /> : null}
         </Main>
         <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            rlt={false}
            pauseOnHover
            pauseOnFocusLoss
            closeOnClick
            draggable
         />
      </>
   );
}

const Events = ({ events }) => {
   console.log(events);
   return (
      <>
         <table className="table table-bordered table-hover col-6 bg-white">
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
};

export default App;
