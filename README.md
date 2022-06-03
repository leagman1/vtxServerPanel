# vtxServerPanel
Simple server panel for the pre-alpha game Vertex.

Designed on and for 1080p monitors.

# Requirements

A recent stable nodejs version. Any should work, the app does not use advanced features.

# Usage

1. Edit options.json to your needs:
    * svargs: Parameters for your Vertex server.
    * path: Absolute path to your Servers MCS folder.
    * os: Leave as is. Future versions might include Linux support.
    * port: The port you want the webserver to run on.
    * custom: Not used.

2. Start the server either with "npm start" or "node app.js".