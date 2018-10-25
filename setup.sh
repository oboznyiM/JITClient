mkdir deploy/var/
mkdir deploy/var/log/ 
mkdir deploy/var/run/

API_URL_GLOBAL="http://torianik.online:5000"
API_URL_LOCAL="http://localhost:5000"

echo "Устанавливаются модули для Python..."
pip install -r requirements.txt > setup.log 2>&1 &
PIP_INSTALL_PID=$!
echo -ne '##                         (9%)\r'
sleep 0.2
echo -ne '####                      (18%)\r'
sleep 0.2
echo -ne '######                    (27%)\r'
sleep 0.2
echo -ne '#########                 (36%)\r'
sleep 0.2
echo -ne '###########               (45%)\r'
sleep 0.2
echo -ne '#############             (54%)\r'
sleep 0.2
echo -ne '###############           (63%)\r'
sleep 0.2
echo -ne '#################         (72%)\r'
sleep 0.2
wait $PIP_INSTALL_PID
echo -ne '###################       (81%)\r'
sleep 0.2
echo -ne '#####################     (91%)\r'
sleep 0.2
echo -ne '#######################   (100%)\r'
echo -ne '\n'

read -r -p "Хотите ли вы запустить сервер, использая локальный API-сервер? [y/N] " response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
then
    printf "class Config:\n   API_URL=\"$API_URL_LOCAL\"" > config.py
else
    printf "class Config:\n   API_URL=\"$API_URL_GLOBAL\"" > config.py
fi

echo "Сайт конфигурирован и готов к запуску."