API_URL = "http://api.torianik.online:5000"


/*
function update_info() {
 
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
}

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

/*function increase_dish(dish_id, number)
{
    //print(dish_id + " : " + number)
    console.log(dish_id);
    if (number == 1) 
        add_to_cart(dish_id);
    else
        delete_dish(dish_id);
    console.log(1);
    window.location.reload();
}


var delete_dish = function(dish_id) {
    try {
        cookie = JSON.parse(document.cookie);
    } catch (err) {
        return;
    }
    if (cookie[dish_id] == 1)
        delete cookie[dish_id];
    else
        cookie[dish_id]--;
    document.cookie = JSON.stringify(cookie)
    update_dropdown();
}
*/

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
    let dishes_list
    fetch('http://api.torianik.online:5000/get/dishes')
    .then(function(response) {
        console.log(response);
        return response.json();
    })
        .then(
    function(data) {
    dishes_list = data.res;
    console.log(dishes_list);
    console.log(dishes_list);
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
    console.log("azaza");
    console.log(Object.keys(cookie).length);
    document.getElementById("cart-size").innerHTML = Object.keys(cookie).length

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

    document.getElementById("cart-dropdown-summary").innerHTML = "Итог: ₴" + summary.toFixed(2);
    //update for mobile^
    dropdown = document.getElementById("cart-dropdown-main_");
    dropdown.innerHTML = "";

    var summary = 0.0

    if(Object.keys(cookie).length == 0)
    {
        dropdown.innerHTML += "Ваша корзина пустая";
    }
    console.log("azaza");
    console.log(Object.keys(cookie).length);
    document.getElementById("cart-size_").innerHTML = Object.keys(cookie).length

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

    document.getElementById("cart-dropdown-summary_").innerHTML = "Итог: ₴" + summary.toFixed(2);
    })
    }



window.onunload = function() {
    update_dropdown();
}
window.onload = function() {
    update_dropdown();
}
