#!/bin/bash

uwsgi --ini JITClient.ini

echo "" > deploy/var/log/uwsgi.log
echo "uWSGI работает на порту 8301."