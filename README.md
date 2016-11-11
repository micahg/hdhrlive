<h1>HDHomeRun Live</h1>

This is an attempt to serve live TV from older HDHomeRun units in a simple IPTV
compatible format.

This is a node.js server that can be run on a linux machine with the
hdhomerun_config utility.  That's the plan, anyway -- nothing actually works
yet.

<h2>Installation</h2>
Coming soon.

<h2>Development Notes</h3>

kodi udp://:5000
hdhomerun_config 10319F74 set /tuner0/target 192.168.0.171:5000

kodi has to be listening first or the hdhomerun_config to set the stream target
fails.
