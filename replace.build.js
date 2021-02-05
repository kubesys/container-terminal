var replace = require('replace-in-file');
var host = process.env.host;
const options = {
  files: './public/index.html',
  from: /(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]):/g,
  to: host,
  allowEmptyPaths: false,
};

try {
  let changedFiles = replace.sync(options);
  console.log('Build version set: ' + changedFiles);
}
catch (error) {
  console.error('Error occurred:', error);
}