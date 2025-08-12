#!/bin/bash
# Install Node.js dependencies before deployment
cd /var/app/staging
npm install --production
