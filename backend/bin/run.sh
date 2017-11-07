#!/bin/bash
mongod & sleep 5 && mongorestore /backend/dump/disclose/ && nodejs /backend/bin/www