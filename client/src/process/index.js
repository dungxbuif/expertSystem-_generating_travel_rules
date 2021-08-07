import _ from 'lodash';
const KET_LUAN = ['H'];
var LOG = [];
var ketQuaTungSuKien = [];

const excute = (events, rules) => {
   LOG = [];
   ketQuaTungSuKien = [];
   // Xét thuật toán suy diễn tiến với toàn bộ sự kiện
   const ketQuaToanBo = xetToanBoSuKien(events, rules);

   var lastResult = [];

   //Xét riêng lẻ từng sự kiện
   if (events.length > 1) {
      LOG.unshift('====Xét toàn bộ sự kiện====');
      events.forEach((item) => {
         LOG.push(`====Xét riêng sự kiện ${item}====`);
         xetTungSuKien(item, rules);
      });

      //Lọc các kết quả trùng nhau
      if (ketQuaToanBo.length && ketQuaTungSuKien.length) {
         LOG.push(`Tiến hành lọc trùng chọn ra kết quả được chọn nhiều nhất`);
         //Trộn tất cả kết quả thu được vào 1 mảng arr
         let arr = [...ketQuaToanBo, ...ketQuaTungSuKien];
         let max = arr[0];

         //Tìm số lần các sự kiện được lặp lại
         let uniq = arr
            .map((name) => {
               return {
                  count: 1,
                  name: name,
               };
            })
            .reduce((a, b) => {
               a[b.name] = (a[b.name] || 0) + b.count;
               if (a[b.name] >= a[max]) max = b.name;
               return a;
            }, {});
         lastResult.push(max.split(':')[1]);
         //Sau khi tìm được số lần lặp thì tìm ra những sự kiện đưuọc lặp nhiều nhất
         arr.forEach((ele) => {
            if (ele !== max && uniq[max] === uniq[ele])
               lastResult.push(ele.split(':')[1]);
         });
         // Cho vào Set để lọc trùng
         lastResult = [...new Set([...lastResult])];
         LOG.push(
            `Kết quả cuối cùng: ${
               lastResult.length > 1 ? lastResult.join(' và ') : lastResult[0]
            }`
         );
      } else {
         LOG.push(`Tiến hành lọc trùng chọn ra kết quả được chọn nhiều nhất`);
         //Trộn tất cả kết quả thu được vào 1 mảng arr
         let arr = [...ketQuaTungSuKien];
         let max = arr[0];

         //Tìm số lần các sự kiện được lặp lại
         let uniq = arr
            .map((name) => {
               return {
                  count: 1,
                  name: name,
               };
            })
            .reduce((a, b) => {
               a[b.name] = (a[b.name] || 0) + b.count;
               if (a[b.name] >= a[max]) max = b.name;
               return a;
            }, {});
         lastResult.push(max.split(':')[1]);
         //Sau khi tìm được số lần lặp thì tìm ra những sự kiện đưuọc lặp nhiều nhất
         arr.forEach((ele) => {
            if (ele !== max && uniq[max] === uniq[ele])
               lastResult.push(ele.split(':')[1]);
         });
         // Cho vào Set để lọc trùng
         lastResult = [...new Set([...lastResult])];
         LOG.push(
            `Kết quả cuối cùng: ${
               lastResult.length > 1 ? lastResult.join(' và ') : lastResult[0]
            }`
         );
      }
   }

   LOG.push('Kết thúc thuật toán');

   return { LOG, lastResult };
};

function khoiTaoTapLuatBanDau(rules) {
   let arr = [...rules];
   let tapLuatBanDau = {},
      maTapLuatBanDau = [];
   maTapLuatBanDau = arr.map((item) => {
      let MA_TAP_LUAT = item.id;
      tapLuatBanDau[MA_TAP_LUAT] = item;

      return MA_TAP_LUAT;
   });

   return { tapLuatBanDau, maTapLuatBanDau };
}

function xetTungSuKien(event, rules) {
   const data = [];
   rules.filter((item) => {
      if (item.events.includes(event) && !data.includes(item.result)) {
         data.push(item.result);
         LOG.push(`Tìm thấy kết quả: ${item.result.split(':')[1]}`);
      }
   });

   ketQuaTungSuKien = [...ketQuaTungSuKien, ...data];
}

function xetToanBoSuKien(events, rules) {
   let suKienGiaThiet = [...events];
   let { tapLuatBanDau, maTapLuatBanDau } = khoiTaoTapLuatBanDau(rules);
   let tapLuatThoa = [];
   let i = 1;
   let flag = true;
   let tapKetLuan = [];

   // Chạy thuật toán
   while (flag) {
      LOG.push(`Lần duyệt thứ ${i}, các luật thỏa: `);
      //Tìm các luật thỏa SAT
      timLuatThoa({ events, maTapLuatBanDau });
      if (!tapLuatThoa.length) {
         LOG.push('Không tìm được kết quả');
         break;
      }
      //Xét luật thỏa đầu tiên trong mảng
      xetLuatDauTien();
      i++;
      if (!tapKetLuan.length && !tapLuatThoa.length) {
         LOG.push('Không tìm được kết quả');
         break;
      }

      if (!tapLuatThoa.length) {
         flag = false;
      }
   }

   return tapKetLuan;

   function timLuatThoa() {
      let maLuatThoa = [];

      // Lặp tất cả để tìm các luật thỏa
      maTapLuatBanDau.forEach((maLuat) => {
         if (
            tapLuatBanDau[maLuat].events.every((e) =>
               suKienGiaThiet.includes(e)
            )
         ) {
            maLuatThoa.push(maLuat);
            tapLuatThoa.push(maLuat);
            taoLogLuatThoa(maLuat);
         }
      });

      if (!maLuatThoa.length) LOG.push(`Không tìm thấy luật thỏa`);

      //Xóa luật thỏa khỏi mảng tất cả các luật
      let tmp = _.differenceWith(maTapLuatBanDau, maLuatThoa, _.isEqual);
      maTapLuatBanDau = tmp;
   }

   function taoLogLuatThoa(maLuat) {
      let tmpLuat = tapLuatBanDau[maLuat];

      let string = formatLuat(tmpLuat);

      LOG.push(`Tìm thấy luật thỏa: ${string}`);
   }

   function xetLuatDauTien() {
      //Lấy mã của luật đầu tiên
      let maLuat = tapLuatThoa[0];

      //Xóa luật đầu tiên ra khỏi mảng
      tapLuatThoa.shift();
      let tmpLuat = tapLuatBanDau[maLuat];
      // let cacSuKienMoi = [...tmpLuat.events, tmpLuat.result];
      // //Thêm các sự kiện vào tập luật giả thiết
      // let tmpArr = new Set([...suKienGiaThiet, ...cacSuKienMoi]);
      suKienGiaThiet.push(tmpLuat.result);

      let string = formatLuat(tmpLuat);
      LOG.push(`=> Xét luật ${string}`);
      // LOG.push(`\t&#09;=> Tìm thấy kết quả ${string}`);
      //Kiểm tra kết quả đã có trong mệnh đề hay không
      kiemTraKetQua(tmpLuat.result);
   }
   function formatLuat(luat) {
      let REULTS = luat.result.split(':')[1];
      let string = '';
      for (let i = 0; i < luat.events.length; i++) {
         string += luat.events[i].split(':')[1];

         let tmp = ' ^ ';
         if (i == luat.events.length - 1) tmp = ' => ';

         string += tmp;
      }
      return `R${luat.id}: ${string}${REULTS}`;
   }

   function kiemTraKetQua(ketQua) {
      if (
         _([`${ketQua.charAt(0)}`])
            .differenceWith(KET_LUAN, _.isEqual)
            .isEmpty() &&
         !tapKetLuan.includes(ketQua)
      ) {
         tapKetLuan.push(ketQua);
         LOG.push(`\tTìm thấy kết quả: ${ketQua.split(':')[1]}`);
      }
      // if (tmp.length) {
      // }
   }
}
export default { excute };
