export const stringFormat = val => {
  if (val == undefined) return "-";
  if (val === true) return "是";
  if (val === false) return "否";
  if (Number.isInteger(val)) {
    if (val == -1) return "120+";
    return val;
  }
  if (this.isValidDate(val)) {
    return moment(val).format("YYYY-MM-DD");
  }
  return val;
};

export const isValidDate = value => {
  var dateWrapper = new Date(value);
  return !isNaN(dateWrapper.getDate());
};

export const statusFormat = value => {
  if (value == 1) return "在运行";
  if (value == 2) return "已停止";
  return "未知";
};

export const DifferenceFormatter = (dynamicRank, originRank) => {
  var diffText = "-";
  if (dynamicRank === 0 || originRank === 0 || dynamicRank === -1) {
  } else {
    var diff = originRank - dynamicRank;
    if (diff > 0) {
      diffText = "+" + diff;
    } else if (diff === 0) {
      diffText = diff;
    } else {
      diffText = diff;
    }
  }
  return diffText;
};
