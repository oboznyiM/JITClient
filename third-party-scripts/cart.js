// Script to handle GUI in cart.html page

API_URL = "http://api.torianik.online:5000"


function get_dishes_list()
{
    let dishes_list = []
    let XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    xhr = new XHR();
    xhr.open('GET', 'http://api.torianik.online:5000/get/dishes', false);
    xhr.onload = function() {
        dishes_list = JSON.parse(this.responseText).res;
    }
    xhr.send()
    return dishes_list
}

var dishes_list = get_dishes_list()

function update_info() {
/* 
    console.log("ozo");
    console.log(dishes_list);
    var total = 0;

    var cookie = {}
    try {
        cookie = JSON.parse(document.cookie);   
    } catch (err) {
        null   
    }
    console.log(dishes_list);

Object.keys(cookie).forEach(function(key) {
    total += dishes_list[key - 1].cost * cookie[key];
});
console.log(total);
document.getElementById("something").innerHTML = total;
*/
}

/*
var set_dish = function(dish_id, number) {
    try {
        cookie = JSON.parse(document.cookie);
    } catch (err) {
        cookie = {};
    }
    if (Number(number) == 0)
        delete_from_cart(dish_id);
    else
        cookie[dish_id] = Number(number);
    document.cookie = JSON.stringify(cookie)
    update_dropdown();
    window.location.reload();   
}
*/

function update_cart()
{
    try {
        cookie = JSON.parse(document.cookie);
    } catch (err) {
        return;
    }
    summary = document.getElementById("summary")
    summary_d = document.getElementById("summary-d")
    summaries = {}
    numbers_of = {}
    dish_ids = Object.keys(cookie)
    for(var i = 0; i < dish_ids.length; i++)
    {
        dish_ids[i] = Number(dish_ids[i])
        summaries[dish_ids[i]] = document.getElementById("summary" + dish_ids[i])
        numbers_of[dish_ids[i]] = document.getElementById("number_of" + dish_ids[i])
    }

    sum = 0
    for(var i = 0; i < dish_ids.length; i++)
    {
        id = dish_ids[i]
        sum += dishes_list[id - 1].cost * cookie[id]
        summaries[id].innerHTML = (dishes_list[id - 1].cost * cookie[id]).toFixed(2)
        numbers_of[id].innerHTML = cookie[id]
    }

    summary.innerHTML = sum.toFixed(2)
    summary_d.innerHTML = (sum * 1.1).toFixed(2)
}

var delete_dish = function(dish_id) {
    try {
        cookie = JSON.parse(document.cookie);
    } catch (err) {
        return;
    }
    delete cookie[dish_id];
    document.cookie = JSON.stringify(cookie)
    document.location.reload()
}

function increase_dish(dish_id, number)
{
    try {
        cookie = JSON.parse(document.cookie);
    } catch (err) {
        return;
    }
    cookie[dish_id] = Math.max(cookie[dish_id] + number, 0)
    document.cookie = JSON.stringify(cookie)
    if(cookie[dish_id] == 0)
    {
        delete_dish(dish_id)
    }
    update_cart()
}

var set_dish = function(dish_id) 
{
    self_xml = document.getElementById("number_of" + dish_id)
    try {
        cookie = JSON.parse(document.cookie);
    } catch (err) {
        cookie = {};
    }
    cookie[dish_id] = Math.round(Math.max(0, Number(self_xml.value)));
    document.getElementById("number_of" + dish_id).value = toString(cookie[dish_id])
    document.cookie = JSON.stringify(cookie)
    if(cookie[dish_id] == 0)
    {
        delete_dish(dish_id)
    }
    update_cart()
}


