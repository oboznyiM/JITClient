
var dishes_list = []

var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;

var xhr = new XHR();

xhr.open('GET', 'http://api.torianik.online:5000/get/dishes', true);

xhr.onload = function() {
    dishes_list = JSON.parse(this.responseText).res;
}
xhr.send()

window.addEventListener("load", function()
{
    update_cart();
})

function send_() {
    var cookie = {}
    try {
        cookie = JSON.parse(document.cookie);   
    } catch (err) {
        null   
    }
    if(Object.keys(cookie).length == 0)
    {
        alert("Ваша корзина пуста");
    }
    
    var order = [];
    Object.keys(cookie).forEach(function(key) {
        var dish = new Object;
        dish.dish_id = parseInt(key);
        dish.number = cookie[key];
        order.push(dish);
    });
    var answer = new Object;
    var street = document.getElementById("street").value;
    var house = document.getElementById("house").value;
    var mobile = document.getElementById("mobile").value;
    var name = document.getElementById("name").value;
    var sel = document.getElementById("city");
    var city = sel.options[sel.selectedIndex].value;
    if (city == "Выберите город...") {
        alert("Введите город");
        return;
    }
    if (street == "") {
        alert("Введите улицу");
        return;
    }
    var reg_street = /(^[а-яё]+$)/i;
    if (reg_street.test(street) == false) {
        alert("Вы неправильно ввели улицу");
        return;
    }
    if (house == "") {
        alert("Введите дом");
        return;
    }
    var reg_house = /^[0-9]+\s?-?\s?[а-яё]?$/i
    if (reg_house.test(house) == false) {
        alert("Вы неправильно ввели номер дома");
        return;
    }
    if (mobile == "") {
        alert("Введите мобильный телефон");
        return;
    }
    var reg_mobile = /^\+?[0-9]+$/i
    if (reg_mobile.test(mobile) == false) {
        alert("Вы неправильно ввели номер телефона");
        return;
    }
    if (name == "") {
        alert("Введите имя");
        return;
    }
    var reg_name = /^[а-яё]+/i;
    if (reg_name.test(name) == false) {
        alert("Вы неправильно ввели имя");
        return;
    }
    answer.address = city + ' ' + street + ' ' + house;
    answer.phone = mobile;
    answer.name = name;
    answer.dishes = order;
    console.log(answer.address);
    var xhr = new XMLHttpRequest();
    var url = "http://api.torianik.online:5000/make_order";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("SERVER SENT A RESPONSE: " + xhr.responseText)
            var json = JSON.parse(xhr.responseText);
            console.log(json.res.id);
            alert(json.res.id);
        }
    };
    var data = JSON.stringify(answer);
    console.log(data);
    xhr.send(data);
    console.log(1);
    alert("Ваш заказ принят")
    //document.cookie = [];
    ///document.location.href = "/";
}