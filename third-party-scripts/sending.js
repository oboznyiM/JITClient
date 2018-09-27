var dishes_list = []

var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;

var xhr = new XHR();

xhr.open('GET', 'http://api.torianik.online:5000/get/dishes', true);

xhr.onload = function() {
    dishes_list = JSON.parse(this.responseText).res;
}
xhr.send();

function send_() {

    console.log("OZOZOZ1");
    var cookie = {}
    try {
        cookie = JSON.parse(document.cookie);   
    } catch (err) {
        null   
    }
    console.log("OZOOZ2");
    if(Object.keys(cookie).length == 0)
    {
        alert("Ваша корзина пуста");
    }
    
    var order = [];
    Object.keys(cookie).forEach(function(key) {
        var dish = new Object;
        dish.dish_id = key;
        dish.number = cookie[key];
        order.push(dish);
    });
    var answer = new Object;
    answer.address = "Kharkov Danilenko 10";
    answer.dishes = order;
    console.log("Danek pes");
    var xhr = new XMLHttpRequest();
    var url = "http://api.torianik.online:5000/make_order";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json.res.id);
            alert(json.res.id);
        }
    };
    var data = JSON.stringify(answer);
    xhr.send(data);
}