API_URL = "http://api.torianik.online:5000"

var dishes_list = []

var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;

var xhr = new XHR();

xhr.open('GET', 'http://api.torianik.online:5000/get/dishes', true);

xhr.onload = function() {
    dishes_list = JSON.parse(this.responseText).res;
}
xhr.send()

function update_info() {

var total = 0;

var cookie = {}
try {
    cookie = JSON.parse(document.cookie);   
} catch (err) {
    null   
}
console.log(dishes_list);

Object.keys(cookie).forEach(function(key) {
    console.log(key);
    total += dishes_list[key - 1].cost * cookie[key];
});
console.log(total);
document.getElementById("something").innerHTML = total;
}

var add_to_cart = function(dish_id) 
{
    try {
        cookie = JSON.parse(document.cookie);
    } catch (err) {
        cookie = {};
    }

    if(!cookie[dish_id]) {
        cookie[dish_id] = 1;
    }
    else {
        cookie[dish_id]++;
    }

    document.cookie = JSON.stringify(cookie)
    update_dropdown()
}

var delete_from_cart = function(dish_id)
{
    try {
        cookie = JSON.parse(document.cookie);
    } catch (err) {
        return;
    }

    delete cookie[dish_id];
    document.cookie = JSON.stringify(cookie)
    update_dropdown();
}

var update_dropdown = function()
{
    var cookie = {}
    try {
        cookie = JSON.parse(document.cookie);   
    } catch (err) {
        null   
    }
    dropdown = document.getElementById("cart-dropdown-main");
    dropdown.innerHTML = "";

    var summary = 0.0

    if(Object.keys(cookie).length == 0)
    {
        dropdown.innerHTML += "Ваша корзина пустая";
    }

    Object.keys(cookie).forEach(function(key) {
        console.log(key)
        dropdown.innerHTML +=
        `
        <li class="header-cart-item">
            <div class="header-cart-item-img" onclick="delete_from_cart(${key})">
				<img src="${API_URL}/public/${dishes_list[key - 1].photo}" alt="IMG">
			</div>

			<div class="header-cart-item-txt">
				<a href="#" class="header-cart-item-name">
					${dishes_list[key - 1].title}
				</a>

                <span class="header-cart-item-info">
                    ${cookie[key]} x ₴${dishes_list[key - 1].cost}
                </span>
			</div>
		</li>
        `

        summary += dishes_list[key - 1].cost * cookie[key]
    });

    document.getElementById("cart-dropdown-summary").innerHTML = "Итог: ₴" + summary.toFixed(2)
    document.getElementById("cart-size").innerHTML = Object.keys(cookie).length
}

window.onload = function() {
    update_dropdown();
}