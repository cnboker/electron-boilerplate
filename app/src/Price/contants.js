export const getFeeType = val => {
  if (val == undefined || val === 1) return "充值";
  if (val === 2) return "奖励";
  return "未知";
};

export const getStatus = item => {
  var payType = item.payType || 1;
  //充值
  if (payType == 1) {
    var status = item.status || 1;
    if (status == 0) {
      return "未付款";
    }
    if (status == 1) {
      return "已付款";
    }
  }
  //奖励
  if (payType == 2) {
    if (item.status == 0) {
      return "未提现";
    }
    if (item.status == 1) {
      return "已提现";
    }
  }

  return "未知";
};
