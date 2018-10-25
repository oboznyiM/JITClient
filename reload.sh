#!/bin/bash

WSGI_MASTER_PID="$(cat deploy/var/run/uwsgi.pid)"

kill -hup $WSGI_MASTER_PID

echo "Сервер перезапущен."