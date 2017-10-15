#!/bin/sh
set -e
FILE=back_at_ya.zip
jshint app.js translations/*  # npm install -g jshint
rm -f $FILE
zip -r $FILE app* README.md manifest.json translations templates assets --quiet
