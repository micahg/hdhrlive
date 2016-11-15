# HDHomeRun Live

This is an attempt to serve live TV from older HDHomeRun units in a simple IPTV
compatible format.

This is a node.js server that can be run on a linux machine with the
hdhomerun_config utility. It is written in typescript... because I wanted to
learn typescript -- so forgive my beginners mistakes.

## Installation

`npm install`

`npm run build`

`npm start`

## Setup

Setup is easy -- browse to localhost:3000 (or whatever IP the server runs on).

* Scan devices
* Scan channels

At this point, the server will have stored off the successful channels and the
API will be able to act as a simple IPTV provider for Kodi (provided they accept
my pull request: https://github.com/xbmc/xbmc/pull/10933). Note, that the PR was
made against v17 (Krypton) so anything earlier wont work.

To setup Kodi, point the simple IPTV plugin at http://localhost:3000/channels.m3u
and you should be all set.

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

* Everything in the **Not Working** section
* Configure where stuff is stored (eg: stop using /tmp)
