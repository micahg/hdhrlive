# HDHomeRun Live

This is a web-app that allows you to serve live TV from older HDHomeRun units in
a simple IPTV compatible format.  The hardware targetted is the now unsupported
HDHR3 series of devices that do not integrate with Kodi.

The server uses node.js and is written in typescript. Through an angular
frontend, it allows you to add devices, scan channels, and then serve them to
Kodi.

Presumably, other non-kodi players could also use this as a backend if they
support the simple IPTV format. More information on that format is available
here: https://github.com/afedchin/xbmc-addon-iptvsimple/wiki/IPTV-Simple-Home

**IMPORTANT** This only works with the forthcoming Kodi v17 or later. There
was a change required in Kodi to get it working. More details on that are here:
https://github.com/xbmc/xbmc/pull/10933

## Installation

`npm install`

`npm run build`

`npm start`

## Setup

Setup is easy -- browse to localhost:3000 (or whatever IP the server runs on).

* Scan devices
* Scan channels

At this point, the server will have stored off the successful channels and the
API will be able to act as a simple IPTV provider for Kodi.

To setup Kodi, point the simple IPTV plugin at http://localhost:3000/channels.m3u
(or whatever IP the server runs on) and you should be all set.

## Status

**Working**:

* Device discovery
* Channel scanning

**Not Working**:

* A good UI
* Using more than one tuner
* Channel editing/deletion
* Channel logos
* Guide data

**TODO**

* Configure where stuff is stored (eg: stop using /tmp)
* Store the devices and channel in memory after startup
* Add modal for scanning progress
* Everything in the **Not Working** section
