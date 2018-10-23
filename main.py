from flask import render_template, Flask, send_from_directory, request, make_response, Markup
import os
import requests
from json import dumps, loads
from math import ceil

# ========= CONFIG ========= #
API_URL = "http://api.torianik.online:5000"

def load_dishes():
    dishes_request = requests.get("{}/get/dishes".format(API_URL))
    return loads(dishes_request.text)["res"]

app = Flask(__name__)

@app.route("/vendor/<path:p>")
def vendor_handle(p):
    return send_from_directory("vendor", p)

@app.route("/css/<path:p>")
def css_handle(p):
    return send_from_directory("css", p)

@app.route("/js/<path:p>")
def js_handle(p):
    return send_from_directory("js", p)

@app.route("/include/<path:p>")
def include_handle(p):
    return send_from_directory("include", p)

@app.route("/fonts/<path:p>")
def fonts_handle(p):
    return send_from_directory("fonts", p)

@app.route("/images/<path:p>")
def images_handle(p):
    return send_from_directory("images", p)

@app.route("/third-party-scripts/<path:p>")
def third_party_scripts_handle(p):
    return send_from_directory("third-party-scripts", p)

resp = requests.get('http://api.torianik.online:5000/get/dishes')
dishes = resp.json()["res"]

dishes_list = []
dishes_list.append(dishes[0])
for i in range(len(dishes)):
    dishes_list.append(dishes[i])

for i in range(len(dishes_list)):
    dict2 = {"id": i}
    dishes_list[i].update(dict2)

dishes_list_sort = dishes_list.copy()

for j in range(len(dishes_list_sort)):
    for i in range(len(dishes_list_sort) - 2):
        if (dishes_list_sort[i + 1]["cost"] > dishes_list_sort[i + 2]["cost"]):
            t = dishes_list_sort[i + 1]
            dishes_list_sort[i + 1] = dishes_list_sort[i + 2]
            dishes_list_sort[i + 2] = t
            
dishes_list_sort_back = dishes_list.copy()
for i in range(len(dishes_list) - 1):
    dishes_list_sort_back[i + 1] = dishes_list_sort[len(dishes_list)-i-1]
            
dish_blocks = [
    {
        "title": "Первые блюда",
        "label": "first_cources",
        "dishes": [1, 2, 3, 4, 5]
    },
    {
        "title": "Закуски",
        "label": "main course",
        "dishes": [5, 6, 7, 8, 9, 10]
    },
]

favorites = [1, 2, 3, 4, 5]

with open("templates/components/header.html") as fin:
    header_html = Markup(fin.read())

with open("templates/components/footer.html") as fin:
    footer_html = Markup(fin.read())

@app.route("/cart")
def cart_handle():
    in_cart = {}
    try:
        print(request.cookies)
        in_cart = loads(list(request.cookies.keys())[0])
        in_cart_new = {}
        for key in in_cart.keys():
            in_cart_new[int(key)] = in_cart[key]
        in_cart = in_cart_new
    except Exception as _:
        try:
            in_cart = loads(list(request.cookies.keys())[1])
            in_cart_new = {}
            for key in in_cart.keys():
                in_cart_new[int(key)] = in_cart[key]
            in_cart = in_cart_new
        except Exception as _:
            pass

    
    print(in_cart)
    return render_template("cart.html",
        api_url=API_URL,
        in_cart_dishes=in_cart,
        dishes_list=dishes_list,
        header=header_html,
        footer=footer_html,
        show_cart_icon=False)

@app.route("/product")
def product_handle():
    dishes = load_dishes()

    tag = request.args.get("tag")
    if tag:
        dishes = list(filter(lambda dish: tag in dish.get("tags"), dishes))

    sort_type = request.args.get("sort_type")
    if sort_type:
        if sort_type == "low_to_hight":
            dishes = sorted(dishes, key=lambda dish : dish.get("cost"))
        elif sort_type == "hight_to_low":
            dishes = sorted(dishes, key=lambda dish : dish.get("cost"), reverse=True)
        elif sort_type == "alphabetically":
            dishes = sorted(dishes, key=lambda dish : dish.get("title"))

    return render_template(
        "product.html",
        dishes=dishes,
        api_url=API_URL,
        header=header_html,
        footer=footer_html)

@app.route("/")
def index_handle():
    return product_handle()

"""
@app.route("/contact")
def contact_handle():
    return render_template("contact.html",
        header = header_html,
        footer = footer_html)
"""

app.run(host="0.0.0.0", port=80, debug=True)