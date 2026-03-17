#!/bin/bash

git remote update
git reset --hard origin/main
npx quartz build
