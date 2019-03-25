exports.userGrade = function(grade) {
  if (grade == 1) {
    return "免费账号";
  } else if (grade == 2) {
    return "VIP账号"; 
  } else if (grade == 3) {
    return "企业账户";
  } else {
    return "未知";
  }
}