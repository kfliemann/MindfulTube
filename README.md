# MindfulTube
[![Extension Link](https://img.shields.io/badge/Mozilla%20Extension-Link-blue?style=for-the-badge&logo=FirefoxBrowser)](https://addons.mozilla.org/firefox/addon/mindfultube/)

Firefox extension that makes you focus on the important thing of Youtube: <b> watch videos, distraction free </b>

## Features

- The YouTube homepage has been completely redesigned to resemble Google's simple search view.
- The watch video page has been optimized: suggested videos and comments are hidden, and the video is centered. Playlist videos are now displayed below the video instead of on the side.
- The navigation bar includes optional buttons for Subscriptions, Playlists, and History for quick access.
- All other aspects of YouTube remain untouched (e.g., user profiles, YouTube settings, etc.).

## Installation

Install from [Mozilla Add-ons](https://addons.mozilla.org/firefox/addon/mindfultube/) webpage.

### Add the Add-on temporarily:
1. Download the project
2. In Firefox browser go to the debugging page by typing in url <b>[about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)</b>
4. Click on <b>Load Temporary Add-on...</b>
5. Select a file (eg. 'manifest.json' file) inside of downloaded git project. Or you can ZIP contents of the project and select it instead.

<br>

### If you would like to modify the project, I suggest doing the following:
1. Download the project
2. Download the npm package [web-ext](https://www.npmjs.com/package/web-ext)
3. Open the project in your code editor, open a terminal in the project folder and use the command `web-ext run` to start an instance of Firefox, which hotloads changes made to the extension 

This way, you don't have to manually reload the extension in the <b>about:debugging</b> window everytime you make a change in the code.

<br>

## License

[GPL-3.0](https://github.com/Vulpelo/hide-youtube-shorts/blob/master/LICENCE.md)
