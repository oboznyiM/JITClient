#!/bin/bash

WSGI_MASTER_PID="$(cat deploy/var/run/uwsgi.pid)"

kill -int $WSGI_MASTER_PID

echo "Сервер остановлен."