import Header from './components/Header';
import Main from './components/Main';
import { useState, useEffect } from 'react';
import * as api from './apis';
import { ToastContainer, toast } from 'react-toastify';

function App() {
   const [selectData, setSelectData] = useState([]);
   const [rules, setRules] = useState([]);

   const getAllRules = async () => {
      const res = await api.getAllRules();
      let data = [...res.data.data];
      data.forEach((element) => {
         element.events.sort();
      });
      data.sort((a, b) => {
         return a.events.length - b.events.length;
      });
      res.data.data = data;
      return res.data;
   };

   useEffect(() => {
      toast.info('🔄 Loading data !!!', {
         position: 'bottom-right',
         autoClose: false,
         hideProgressBar: false,
         closeOnClick: false,
         pauseOnHover: false,
         draggable: false,
         progress: undefined,
      });
      const getData = async () => {
         const res = await api.getGroupEvents();
         const res1 = await getAllRules();
         if (res.data.code === 1 && res1.code === 1) {
            setSelectData(res.data.data);
            setRules(res1.data);

            toast.dismiss();
            toast.success('🚀 Loading select succeed !!!');
         } else {
            toast.error('🔥 Loading data failed !!!');
         }
      };

      getData();
   }, []);

   const loadAllRule = async () => {
      const res = await getAllRules();

      if (res.code === 1) {
         setRules(res.data);

         toast.dismiss();
         toast.success('🚀 Reloading all rule succeed !!!');
      } else {
         toast.error('🔥 Reloading all rule failed !!!');
      }
   };

   const getAllEvents = async () => {
      let res = null;
      try {
         res = await api.getAllEvents();
         if (res.data.code !== 1) {
            toast.error('🔥 Loading all events failed !!!');
            return;
         }
      } catch (e) {
         toast.error('🔥 Loading all events failed !!!');
      }

      return res.data.data.map((item) => `${item}\n`);
   };

   const convertResults = () => {
      return rules.map((item, index) => {
         let REULTS = item.result.split(':')[0];
         let string = '';
         for (let i = 0; i < item.events.length; i++) {
            string += item.events[i].split(':')[0];

            let tmp = ' ^ ';
            if (i == item.events.length - 1) tmp = ' => ';

            string += tmp;
         }

         return `R${index + 1}: ${string}${REULTS}\n`;
      });
   };
   return (
      <>
         <Header rules={convertResults} getAllEvents={getAllEvents} />
         <Main selectData={selectData} loadAllRule={loadAllRule}>
            {rules.length !== 0 ? <Rules rules={rules} /> : null}
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
};

const Rules = ({ rules }) => {
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
};

export default App;
