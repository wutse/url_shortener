'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const urlShortenerSchema = new Schema({
  index: {
    type: Number, // 資料型別是數值
    required: true // 這是個必填欄位
  },
  shortDst: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  },
  src: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  },
});

/*短網址產生*/
const chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ';
let { maxIndex } = require('../config/mongoose');

/* instance method
urlShortenerSchema.methods.shorten = function () {
  console.log(this.src);
  return this.src + 'bbb';
};
*/

/* Model static method*/
urlShortenerSchema.statics.shorten = function (number) {
  const charsArr = chars.split('');
  const radix = chars.length;
  let qutient = number;
  let arr = [];
  do {
    let mod = qutient % radix;
    qutient = (qutient - mod) / radix;
    arr.unshift(charsArr[mod]);
  } while (qutient);

  return arr.join('');
};

module.exports = mongoose.model('UrlShortener', urlShortenerSchema);

/* module method
module.exports.shorten = (src) => {
  return 'bbb';
};
*/
