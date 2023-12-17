const mongoose = require('mongoose');
const app = require('./app');

let server;

mongoose.connect("mongodb+srv://gialongfp:Long15012002@stockdatabase1.m1cbarp.mongodb.net/sample_restaurants?retryWrites=true&w=majority").then(()=>{
    console.log('connectedt to mongoDB');
    server = app.listen(5000, ()=>{
        console.log("listening on port 5000");
    })
});



const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };
  
  const unexpectedErrorHandler = (error) => {
    console.log(error);
    exitHandler();
  };
  
  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);
  
  process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
      server.close();
    }
  });
