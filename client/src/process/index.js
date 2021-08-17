import _ from 'lodash';

//Khai báo một số hằng
const KET_LUAN = ['H', 'A'];
const SU_KIEN_NGOAI_LE = ['C5', 'C3', 'G1', 'G2', 'A4'];

//Khai báo 1 số biến toàn cục
var suKienNgoaiLe = [];
var kqNgoaiLe = [];
var LOG = [];
var ketQuaTungSuKien = [];
var lastResult = [];

const excute = (events, rules) => {
   //Reset biến toàn cục
   LOG = [];
   ketQuaTungSuKien = [];
   kqNgoaiLe = [];
   suKienNgoaiLe = [];
   lastResult = [];

   // Xét thuật toán suy diễn tiến với toàn bộ sự kiện
   let ketQuaToanBo = xetToanBoSuKien(events, rules);

   if (events.length > 1) LOG.unshift('====Xét toàn bộ sự kiện====');

   //Xét riêng lẻ từng sự kiện
   eachEvents(events, rules);

   LOG.push('Chọn ra các kết quả trùng lặp');
   let ketQuaTrungLap = getDuplicateValue(ketQuaTungSuKien);

   let tatCaCacKQ = [...ketQuaToanBo, ...ketQuaTrungLap];
   if (suKienNgoaiLe.length) {
      LOG.push('Lọc các kết quả ngoại lệ');

      /* Nếu có sự kiện ngoại lệ mà các sự kiện đó không
       có kết quả trùng thì kết quả cuối cùng cũng không có*/
      if (kqNgoaiLe.length == 0) {
         lastResult = [];
      } else {
         lastResult = getDuplicateValue([...tatCaCacKQ, ...kqNgoaiLe]);
      }
   } else {
      lastResult = [...new Set(tatCaCacKQ)];
   }

   let suggests = _.differenceWith(tatCaCacKQ, lastResult, _.isEqual).map(
      (item) => item.split(': ')[1],
   );
   LOG.push(
      `==> Kết quả cuối cùng: ${
         lastResult.length > 1
            ? lastResult.map((item) => item.split(': ')[1]).join(' v ')
            : lastResult.length == 1
            ? lastResult[0]
            : 'Không tìm thấy kết quả'
      }`,
   );

   LOG.push('Kết thúc thuật toán');

   return { LOG, lastResult, suggests };
};

function eachEvents(events, rules) {
   events.forEach((item) => {
      if (events.length > 1) LOG.push(`====Xét riêng sự kiện ${item}====`);
      xetTungSuKien(item, rules);
   });
}

function getDuplicateValue(arr) {
   const count = (names) => names.reduce((a, b) => ({ ...a, [b]: (a[b] || 0) + 1 }), {});

   const duplicates = (dict) => Object.keys(dict).filter((a) => dict[a] > 1);

   //Trả lại mảng các phần từ trùng nhau
   return duplicates(count(arr));
}

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
   let data = [];
   let flag = false;
   if (SU_KIEN_NGOAI_LE.indexOf(event.split(': ')[0]) !== -1) {
      LOG.push('Phát hiện sự kiện ngoại lệ');
      suKienNgoaiLe.push(event);
   }

   if (suKienNgoaiLe.length > 1) flag = true;

   rules.filter((item) => {
      if (item.events.includes(event) && !data.includes(item.result)) {
         data.push(item.result);
         if (SU_KIEN_NGOAI_LE.indexOf(event.split(': ')[0]) !== -1) kqNgoaiLe.push(item.result);
         LOG.push(`Tìm thấy kết quả: ${item.result.split(':')[1]}`);
      }
   });

   if (flag) {
      let tmp = getDuplicateValue(kqNgoaiLe);
      kqNgoaiLe = tmp;
   }

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
         if (tapLuatBanDau[maLuat].events.every((e) => suKienGiaThiet.includes(e))) {
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
