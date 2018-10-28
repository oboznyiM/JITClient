map = null
driver_marker = null
target_marker = null

var parseCoords = (coords) => coords.split(',').map(v => parseFloat(v.replace(' ', '')));

function loadMap()
{
    var mapProp= {
        center:new google.maps.LatLng(49.992345, 36.231020),
        zoom: 13,
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);


    xhr = new XMLHttpRequest();
    xhr.open("GET", API_URL + "/get/cafes", false);
    xhr.send();

    response = JSON.parse(xhr.responseText).res;
    response.forEach((el) => {
        console.log(123)
        coords = parseCoords(el.coordinates);

        cafe_marker = new google.maps.Marker({
            position: new google.maps.LatLng(coords[0], coords[1]),
            title: el.title,
            icon: 'images/cafe.png'
          });

        cafe_marker.setMap(map);
    });
}

function checkIfTokenValid(token)
{
    if(token == "")
    {
        return false;
    }
    xhr = new XMLHttpRequest();
    xhr.open("GET", API_URL + "/track/" + token, false);
    xhr.send()
    response = JSON.parse(xhr.responseText);
    console.log(response)
    return (parseInt(response.status) == 200);
}

function trackOrder(token)
{
    if(token == "")
    {
        return;
    }
    xhr = new XMLHttpRequest();
    xhr.open("GET", API_URL + "/track/" + token, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            response = JSON.parse(xhr.responseText);

            driverCoords = parseCoords(response.res["driver-coords"]);
            targetCoords = parseCoords(response.res["target-coords"]);
            orderStatus = parseInt(response.res["status"])

            if(orderStatus == 3)
            {
                if(target_marker == null)
                {
                    target_marker = new google.maps.Marker({
                        position: new google.maps.LatLng(targetCoords[0], targetCoords[1]),
                        title: 'Точка доставки'
                      });

                      target_marker.setMap(map);
                }

                if(driver_marker != null)
                {
                    driver_marker.setMap(null);
                }

                driver_marker = new google.maps.Marker({
                    position: new google.maps.LatLng(driverCoords[0], driverCoords[1]),
                    title: 'Водитель',
                    icon: 'images/car.png'
                  });

                driver_marker.setMap(map);
            }

            statusField = document.getElementById("status")
            if(orderStatus == 0)
            {
                statusField.innerHTML = "Статус заказа: <font color='grey'>Не подтвержден<font>"
            }
            if(orderStatus == 1)
            {
                statusField.innerHTML = "Статус заказа: <font color='#adf442'>Готовится<font>"
            }
            if(orderStatus == 2)
            {
                statusField.innerHTML = "Статус заказа: <font color='#47f441'>В ожиданик доставки<font>"
            }
            if(orderStatus == 3)
            {
                statusField.innerHTML = "Статус заказа: <font color='#4c41f4'>Доставляется<font>"
            }
            if(orderStatus == 4)
            {
                statusField.innerHTML = "Статус заказа: <font color='#f441cd'>Доставлено<font>"
            }
        }
    };

    xhr.send()
}

track_timer = null;

window.addEventListener("load", () => {
    document.getElementById("track").addEventListener("click", () => {
        token = document.getElementById("token").value;

        if(checkIfTokenValid(token))
        {
            clearInterval(track_timer);
            if(target_marker != null)
            {
                target_marker.setMap(null);
                target_marker = null;
            }
            if(driver_marker != null)
            {
                driver_marker.setMap(null);
                driver_marker = null;
            }
            
            track_timer = setInterval(() => {
                trackOrder(token);
            }, 500);
        }
        else
        {
            alert("Ошибка: вы ввели неверный токен.")
        }
    });
});
