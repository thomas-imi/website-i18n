#!/bin/bash

# Use this to generate altered keys for faster translation.

git diff HEAD^ HEAD|grep +|cut -f2 -d\"|grep -v -e '+++' -e '@@' > NEXT
