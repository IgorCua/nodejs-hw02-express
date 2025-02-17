const app = require('./app')
const mongoose = require('mongoose');
const {DB_HOST, PORT} = process.env;

mongoose.connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running. Use our API on port: 3000")
    })
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  })