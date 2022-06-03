# Vertex Server Panel
Simple admin console for the pre-alpha game Vertex.  
Can start and stop a single server and edit its settings.

Designed for 1080p.

# Requirements

A recent stable nodejs version. Any should work, the app does not use advanced features.  

# Usage

1. Edit options.json to your needs:
    * svargs: Parameters for your Vertex server.
    * path: Absolute path to your server's MCS folder.
    * os: Leave as is. Currently only supports windows.
    * port: The port you want the webserver to use.
    * custom: Not used.

2. Start the server from the console with either "npm start" or "node app.js".