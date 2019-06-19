//用户自己的数据管理队列
var users = {};

//用户加入
function userJoin(user) {
  if(!users[user]){
    users[user] = {
      joinTime: new Date(),
      status: 1,
      user,
      dataLoad: false
    };
  }
  
}

//用户离开
function userLeave(user) {
  users[user].leaveTime = new Date();
  users[user].status = 0;
}

function onlineUsers() {
  return Object.values(users)
    .filter(x => x.status === 1)
    .map(x => x.user);
}

function offlineUsers() {
  return Object.values(users)
    .filter(x => x.status === 0)
    .map(x => x.user);
}

function dataLoaded(user) {
  users[user].dataLoad = true;
}

function unloadDataUsers() {
  return Object.values(users)
    .filter(x => x.status === 1 && x.dataLoad === false)
    .map(x => x.user);
}

function reset() {
  //remove offline user
  //set online user dataload as false
  var offusers = offlineUsers();
  for (var user of offusers) {
    delete users[user];
  }
  var onusers = onlineUsers();
  for (var user of onusers) {
    users[user].dataLoad = false;
  }
}

module.exports = {
  userJoin,
  userLeave,
  onlineUsers,
  unloadDataUsers,
  dataLoaded,
  offlineUsers,
  reset
};
