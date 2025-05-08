const path = require('path');

module.exports = [{
  // The entry point file described above
  entry: './src/authprovider.mjs',
  // The location of the build folder described above
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: 'auth.js'
  },
}, {
    // The entry point file described above
    entry: './src/app/main.mjs',
    // The location of the build folder described above
    output: {
        path: path.resolve(__dirname, 'app'),
        filename: 'app.js'
    },
}];