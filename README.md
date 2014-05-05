akamai-rest-client
==================

A Node.js client to communicate with Akamai REST API

Installation
============

On project's root, you can run as a node application: `node akamai-client.js <option>`

Or make it executable by stating: `chmod u+x  akamai-client.js`
And then call it: `./akamai-rest-client.js <option>`

Usage
=====

One of the following options are valid
* `queue` - Retrieves queue information
* `purge "list/of/files,to/be/flushed"` - Generates a purge request
* `purge-status <purgeId>` - Retrieves information about given purge id
