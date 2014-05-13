#!/bin/sh
set -e
FILE=asat.zip
jshint app.js translations/*  # npm install -g jshint
csslint app.css --quiet       # npm install -g csslint
rm -f $FILE
zip -r $FILE app* README.md manifest.json translations templates assets --quiet
