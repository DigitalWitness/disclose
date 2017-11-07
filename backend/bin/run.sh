#!/bin/bash
mongod & sleep 5 && mongorestore /backend/dump/test/ && nodejs /backend/bin/www