Onsen UI Quick Startup Guide
====

This document describes the minimum information required to develop an app using Onsen UI.

## Requirement

 * Node.js - [Install Node.js](http://nodejs.org)
 * Cordova - Install by `npm install cordova`
 * Git Crypt for encrypted content, see https://github.com/lorenwest/node-config/wiki/Securing-Production-Config-Files


## Getting code
 * ``git clone ...``
 * ``git-crypt unlock`` to unlock secured files 

## Development Instructions

1. Install dependencies

    $ npm install

2. Install Gulp globally

    $ npm install -g gulp
    
3. Run `gulp prepare` to copy dependencies

### Directory Layout

    README.md     --> This file
    gulpfile.js   --> Gulp tasks definition
    www/          --> Asset files for app
      index.html  --> App entry point
      js/
      lib/
        angular/  --> AngularJS dependency
        onsen/
          stylus/ --> Stylus files for onsen-css-components.css
          js/     --> JS files for Onsen UI
          css/    --> CSS files for Onsen UI
      scripts/    --> Cordova scripts directory
    platforms/    --> Cordova platform directory
    plugins/      --> Cordova plugin directory
    merges/       --> Cordova merge directory
    hooks/        --> Cordova hook directory
    scripts/      --> Cordova TS scripts directory and TS definitions

## Gulp Tasks

 * `gulp prepare` - Copies dependencies to proper directory.