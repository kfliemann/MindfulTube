# MindfulTube

Firefox add-on that makes you focus on the important thing of Youtube: <b> watch videos, distraction free </b>

## Features

- The YouTube homepage has been completely redesigned to resemble Google's simple search view.
- The watch video page has been optimized: suggested videos and comments are hidden, and the video is centered. Playlist videos are now displayed below the video instead of on the side.
- The navigation bar includes optional buttons for Subscriptions, Playlists, and History for quick access.
- All other aspects of YouTube remain untouched (e.g., user profiles, YouTube settings, etc.).

## Installation

### Add the Add-on temporarily:
1. Download the project
2. In Firefox browser go to the debugging page by typing in url <b>[about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)</b>
4. Click on <b>Load Temporary Add-on...</b>
5. Select a file (eg. 'manifest.json' file) inside of downloaded git project. Or you can ZIP contents of the project and select it instead.

<br>

### If you want to make changes to the project, i recommend the following:
1. Download the project
2. Download the npm package [web-ext](https://www.npmjs.com/package/web-ext)
3. Open the project in your code editor, open a terminal in the project folder and use the command <b>web-ext run</b> to start an instance of Firefox, which hotloads changes made to the extension 

This way, you don't have to manually reload the extension in the <b>about:debugging</b> window everytime you make a change in the code.
