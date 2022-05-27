const socketio = require('socket.io');

let io;
module.exports = {
   init: function(server,port) {
       io = socketio(server,{
           cors:{
               origin:[`http://localhost:${port}`]
           }
       });
       return io;
   },
   getIO: function() {
       if (!io) {
          throw new Error("Can't get io instance before calling .init()");
       }
       return io;
   }
}