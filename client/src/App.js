import Manu from './components/Menu';
import CreateRules from './components/CreateRules';
import Events from './components/Events';
import Rules from './components/Rules';
import FindPlaces from './components/FindPlaces';
import { useState, useEffect } from 'react';
import * as api from './apis';
import { ToastContainer, toast } from 'react-toastify';
import { PageType } from './config/PageType';

function App() {
   const [selectData, setSelectData] = useState([]);
   const [rules, setRules] = useState([]);
   const [page, setPage] = useState(PageType.CREATE_RULES);

   const getAllRules = async () => {
      const res = await api.getAllRules();
      let data = [...res.data.data];

      data.forEach((element) => {
         element.events.sort();
      });
      data.sort((a, b) => {
         return a.events[0]
            .split(':')[0]
            .localeCompare(b.events[0].split(':')[0]);
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
            if (i === item.events.length - 1) tmp = ' => ';

            string += tmp;
         }

         return `R${index + 1}: ${string}${REULTS}\n`;
      });
   };

   const renderPage = () => {
      switch (page) {
         case PageType.FIND_PLACES:
            return (
               <FindPlaces
                  selectData={selectData}
                  loadAllRule={loadAllRule}
                  rules={rules}
               >
                  {rules.length !== 0 ? <Rules rules={rules} /> : null}
                  {selectData.length !== 0 ? (
                     <Events events={selectData} />
                  ) : null}
               </FindPlaces>
            );
         default:
            return (
               <CreateRules selectData={selectData} loadAllRule={loadAllRule}>
                  {rules.length !== 0 ? <Rules rules={rules} /> : null}
                  {selectData.length !== 0 ? (
                     <Events events={selectData} />
                  ) : null}
               </CreateRules>
            );
      }
   };
   return (
      <>
         <Manu
            rules={convertResults}
            getAllEvents={getAllEvents}
            setPage={setPage}
         />
         {renderPage()}
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

export default App;
