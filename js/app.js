var app = require("http").createServer();
var io = require("socket.io")(app);
var port = 8001;
app.listen(port);
console.log("app listen at" + port);

/*用戶陣列*/
let users = [];

io.on("connection", function (socket) {
  /*是否為新用戶*/
  let isNewPerson = true;
  /*當前登入用戶*/
  let username = null;
  var kai = 'trash';
  //監聽登入
  socket.on("login", function (data) {
    for (var i = 0; i < users.length; i++) {
      isNewPerson = users[i].username === data.username ? false : true;
    }
    if (isNewPerson) {
      username = data.username;
      users.push({
        username: data.username,
      });
      data.userCount = users.length;
      /*發送 登入成功 事件*/
      socket.emit("loginSuccess", data);
      /*向所有連接的用戶廣播 add 事件*/
      io.sockets.emit("add", data);
    } else {
      /*發送 登入失敗 事件*/
      socket.emit("loginFail", "");
    }
  });
  //監聽登出
  socket.on("logout", function () {
    /* 發送 離開成功 事件 */
    socket.emit("leaveSuccess");
    users.map(function (val, index) {
      if (val.username === username) {
        users.splice(index, 1);
      }
    });
    /* 向所有連接的用戶廣播 有人登出 */
    io.sockets.emit("leave", { username: username, userCount: users.length });
  });
  socket.on('sendMessage', function(data){
    /*發送receiveMessage事件*/
    io.sockets.emit('receiveMessage', data)
})
});
