let fk = require("faker/locale/zh_CN");
// index.js
module.exports = () => {
  let data = {
    "userInfo": {
      "coin": 0
    },
    "prize": {
      "res":{
        "code":0,
        "detail":fk.random.uuid()
      }
    },
    "prizeList": {
      "code":0,
      "value":[]
    }
  }

  for (var i=0;i<20;i++){
    data.prizeList.value.push({
      name:fk.commerce.productName(),
      code:fk.random.uuid(),
      type:fk.random.number(1,3)
    })
  }
  return data
}