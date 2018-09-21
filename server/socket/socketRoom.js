const rooms = []

for(var i = 0; i< 10; i++){
    rooms.push({
        name: `room${rooms.length}`,
        clientCount:0
    })
}
//随机加入room, 每个room 10个用户,超过用户重新增加新的room, 用户又离开，又有人加入则补充离开的空缺
module.exports.join = function(socket){
    var room = getRoom();
    socket.join(room.name)
    room.clientCount += 1    
    socket.roomName = room.name; socket.roomName = room.name;
    //console.log('rooms', rooms)
}

module.exports.leave = function(socket){
    var room = rooms.find(x=>x.name == socket.roomName)
    room.clientCount -= 1;
   // console.log('rooms', rooms)
}

function getRoom(){
    var room = rooms.find(x=>x.clientCount < 10)
    //全满
    if(room == undefined){
        room = {
            name: `room${rooms.length}`,
            clientCount:0
        }
        rooms.push(room)
    }
    return room;
}

//
module.exports.emit = function(app,user, eventName, payload){
    var io = app.io;
    var clients = app.clients;
    var socket = clients[user]
    io.to(socket.roomName).emit(eventName,payload)
}