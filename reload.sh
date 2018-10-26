#!/bin/bash

WSGI_MASTER_PID="$(cat deploy/var/run/uwsgi.pid)"

kill -hup $WSGI_MASTER_PID

echo "" > deploy/var/log/uwsgi.log
echo "Сервер перезапущен."