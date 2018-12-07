var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../qa-factbot12.zip');
var kuduApi = 'https://qa-factbot12.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$qa-factbot12';
var password = 'NlnKEdMjeYooMynPsphB5LdoluQW5jvyXTAvAJ9bAR1knun5ZQHw4yiYBXSN';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('qa-factbot12 publish');
  } else {
    console.error('failed to publish qa-factbot12', err);
  }
});