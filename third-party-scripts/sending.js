var dishes_list = []

var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;

var xhr = new XHR();

xhr.open('GET', 'http://api.torianik.online:5000/get/dishes', true);

xhr.onload = function() {
    dishes_list = JSON.parse(this.responseText).res;
}
xhr.send();

console.log(dishes_list);

var total = 0;


var cookie = {}
try {
    cookie = JSON.parse(document.cookie);   
} catch (err) {
    null   
}
Object.keys(cookie).forEach(function(key) {
    console.log(total);
    total += dishes_list[key - 1].cost * cookie[key];
});
console.log(total);
document.getElementById("something").innerHTML = total;

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
    var street = document.getElementById("street").value;
    var house = document.getElementById("house").value;
    var sel = document.getElementById("city");
    var city = sel.options[sel.selectedIndex].value;
    answer.address = city + ' ' + street + ' ' + house;
    answer.dishes = order;
    console.log(answer.address);
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