#!/usr/bin/env node
'use strict'

var request = require('request');

var config = {
  API_HOST : 'https://api.ccu.akamai.com',
  username : '',
  password : ''
};

var getHeaders = function(method) {
  var headers = {};

  if (method === 'POST') {
    headers['Content-Type'] = 'application/json'
  } else if (method === 'GET') {
    // Nothing for now
  }

  return headers;
}

var getOptions = function(endpoint, method) {
  var requestUrl = config.API_HOST + '/ccu/v2/' + endpoint;
  var options = {
    url : requestUrl,
    method : method,
    headers : getHeaders(method),
    auth : {
      user : config.username,
      pass : config.password
    }
  };

  if (method === 'POST') {
    options['json'] = {
      // ['arl', 'cpcode']
      'type' : 'arl',
      // ['remove', 'invalidate']
      'action' : 'invalidate',
      // ['production', 'staging']
      'domain' : 'production',
      // [list, of, files]
      'objects' : files
    };
  }
  return options;
};

var purgeRequest = function() {
  var options = getOptions('queues/default', 'POST');
  request(options, purgeRequestHandler);
};

var purgeStatus = function(purgeId) {
  var options = getOptions('purges/' + purgeId, 'GET');
  request(options, purgeStatusHandler);
};

var queueLength = function() {
  var options = getOptions('queues/default', 'GET');
  request(options, queueResponseHandler);

};

var purgeStatusHandler = function(error, response, body) {
  if (!error && response.statusCode === 200) {
    var info = JSON.parse(body);

    console.log('Original estimated time: ' + info.originalEstimatedSeconds + 's');
    console.log('Original queue length: ' + info.originalQueueLength);
    console.log('Completion time: ' + info.completionTime);
    console.log('Submitted by: ' + info.submittedBy);
    console.log('Purge status: ' + info.purgeStatus);
  } else {
    console.log('Something went wrong');
  }
}

var purgeRequestHandler = function(error, response, body) {
  if (!error && response.statusCode === 201) {

    console.log(body.detail);
    console.log('Estimated time: ' + body.estimatedSeconds + 's');
    console.log('Purge id: ' + body.purgeId);
    console.log('Progress Uri: ' + body.progressUri);
  } else {
    console.log('Something went wrong');
  }
}

var queueResponseHandler = function(error, response, body) {

  if (!error && response.statusCode === 200) {
    var info = JSON.parse(body);

    console.log('Queue length is ' + info.queueLength);
    console.log(info.detail);
  } else {
    console.log('Something went wrong');
  }
}

var invalidOption = function() {
  console.log('This option is not valid');
}

var option = process.argv[2];
var purgeId;
var files;

switch(option) {
  case 'purge' :
    files = process.argv[3];
    if (files === null || files === undefined) {
      console.log('Files list not found');
    } else {
      files = files.split(',');
      purgeRequest();
    }
    break;
  case 'purge-status' :
    purgeId = process.argv[3];
    if (purgeId === null || purgeId === undefined) {
      console.log('Purge id not found')
    } else {
      purgeStatus(purgeId);
    }
    break;
  case 'queue' :
    queueLength();
    break;
  default :
    invalidOption();
}

