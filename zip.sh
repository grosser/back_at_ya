#!/bin/sh
set -e
FILE=asat.zip
jshint app.js translations/*  # npm install -g jshint
rm -f $FILE
zip -r $FILE app* README.md manifest.json translations templates assets --quiet
