function send_() {
    var cookie = {}
    try {
        cookie = JSON.parse(document.cookie);   
    } catch (err) {
        null   
    }
    if(Object.keys(cookie).length == 0)
    {
        alert("Не удалось отправить заказ: Ваша корзина пуста.");
    }
    
    var order = [];
    Object.keys(cookie).forEach(function(key) {
        var dish = new Object;
        dish.id = parseInt(key);
        dish.number = cookie[key];
        order.push(dish);
    });

    var address = document.getElementById("address").value + ", " + document.getElementById("flat").value;
    var phone = document.getElementById("phone").value;
    var name = document.getElementById("name").value;

    if(address.split(',').length - 1 < 3)
    {
        alert("Не удалось отправить заказ: Адрес введен не корректно.");
        return;
    }

    if(phone.length != "(+38)-050-081-3720".length)
    {
        alert("Не удалось отправить заказ: Телефон введен не корректно.");
        return;
    }
    phone.replace(')', '');
    phone.replace('(', '');
    phone.replace('-', '');

    if(name.length < 4)
    {
        alert("Не удалось отправить заказ: Имя введено не корректно.");
        return;
    }

    var xhr = new XMLHttpRequest();
    var url = "http://api.torianik.online:5000/make_order";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            status = json.status
            res = json.res
            if(status == 200)
            {
                alert("Операция успешна: Ваш заказ принят. Id вашего трекера: " + res);
                document.cookie = [];
                document.location.href = "/";
            }
            else
            {   
                alert("Не удалось отправить заказ: Ошибка на стороне сервер. Попробуйте оформить заказ позже.")
            }
        }
    };
    
    xhr.send(JSON.stringify({
        "address": address,
        "phone": phone,
        "name": name,
        "dishes": order
    }));
}