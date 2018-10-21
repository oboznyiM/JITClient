from flask import render_template, Flask, send_from_directory, request, make_response, Markup
import os
import requests
from json import dumps, loads
from math import ceil


# ========= CONFIG ========= #
API_URL = "http://api.torianik.online:5000"

app = Flask(__name__)

dishes_list = []
dishes_list_sort = []
dishes_lis_sort_back = []

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

def get_dishes():
    resp = requests.get('http://api.torianik.online:5000/get/dishes')
    dishes = resp.json()["res"]
    global dishes_list
    global dishes_list_sort
    global dishes_list_sort_back
    dishes_list = []
    dishes_list.append({})
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

with open("templates/components/header.html") as fin:
    header_html = Markup(fin.read())

with open("templates/components/footer.html") as fin:
    footer_html = Markup(fin.read())

@app.route("/cart")
def cart_handle():
    get_dishes()
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

def special_product_handle(tag):
    get_dishes()
    try:
        page = int(request.args.get("page"))
    except Exception as _:
        page = 1
    dish_page = []
    dish_page_sort = []
    dish_page_sort_back = []
    DISH_PER_PAGE = 1000

    start_page = (page - 1) * DISH_PER_PAGE
    i = 1
    j = 1
    while j < DISH_PER_PAGE and i + start_page < len(dishes_list):
        if dishes_list[i]["tags"][0] == tag:
            new_dish = dishes_list[i]
            new_dish["id"] = i
            dish_page.append(new_dish)
            j += 1
        i += 1
    
    i = 1
    j = 1
    while j < DISH_PER_PAGE and i + start_page < len(dishes_list):
        if dishes_list_sort_back[i]["tags"][0] == tag:
            new_dish_sort_back = dishes_list_sort_back[i]
            new_dish_sort_back["id"] = dishes_list_sort_back[i]["id"]
            dish_page_sort_back.append(new_dish_sort_back)
            j += 1
        i += 1
    
    i = 1
    j = 1
    while j < DISH_PER_PAGE and i + start_page < len(dishes_list):
        if dishes_list_sort[i]["tags"][0] == tag:
            new_dish_sort = dishes_list_sort[i]
            new_dish_sort["id"] = dishes_list_sort[i]["id"]
            dish_page_sort.append(new_dish_sort)
            j += 1
        i += 1
        
    sort_type = request.args.get("type_sort", default = 0, type = int)
    if (sort_type == 2):
        dish_page = dish_page_sort
    if (sort_type == 3):
        dish_page = dish_page_sort_back
    product = "";
    if tag == "first course":
        product = "first_courses.html"
    if tag == "main course":
        product = "main_courses.html"
    if tag == "salad":
        product = "salads.html"
    if tag == "snack":
        product = "snacks.html"
    if tag == "dessert":
        product = "desserts.html"
    if tag == "nonalcoholic drink":
        product = "non_beverages.html"
    if tag == "alcoholic drink":
        product = "alc_beverages.html"
        
    return render_template(product,
        api_url=API_URL,
        header=header_html,
        footer=footer_html,
        dish_page=dish_page,
        current_page=page,
        page_number=ceil(len(dishes_list) / DISH_PER_PAGE))


@app.route("/product")
def product_handle():
    get_dishes()
    print(dishes_list)
    try:
        page = int(request.args.get("page"))
    except Exception as _:
        page = 1

    dish_page = []
    dish_page_sort = []
    dish_page_sort_back = []
    DISH_PER_PAGE = 100000

    start_page = (page - 1) * DISH_PER_PAGE
    i = 1
    while i < DISH_PER_PAGE and i + start_page < len(dishes_list):
        new_dish = dishes_list[i]
        new_dish["id"] = i
        dish_page.append(new_dish)
        i += 1
    
    i = 1
    while i < DISH_PER_PAGE and i + start_page < len(dishes_list):
        new_dish_sort_back = dishes_list_sort_back[i]
        new_dish_sort_back["id"] = dishes_list_sort_back[i]["id"]
        dish_page_sort_back.append(new_dish_sort_back)
        i += 1
    i = 1
    while i < DISH_PER_PAGE and i + start_page < len(dishes_list):
        new_dish_sort = dishes_list_sort[i]
        new_dish_sort["id"] = dishes_list_sort[i]["id"]
        dish_page_sort.append(new_dish_sort)
        i += 1
        
    sort_type = request.args.get("type_sort", default = 0, type = int)
    if (sort_type == 2):
        dish_page = dish_page_sort
    if (sort_type == 3):
        dish_page = dish_page_sort_back
    return render_template("product.html",
        api_url=API_URL,
        header=header_html,
        footer=footer_html,
        dish_page=dish_page,
        current_page=page,
        page_number=ceil(len(dishes_list) / DISH_PER_PAGE))

#for first courses

@app.route("/first_courses")
def first_course_handle():
    return special_product_handle("first course")

@app.route("/main_courses")
def main_course_handle():
    return special_product_handle("main course")

@app.route("/snacks")
def snack_handle():
    return special_product_handle("snack")

@app.route("/salads")
def salad_handle():
    return special_product_handle("salad")

@app.route("/desserts")
def dessert_handle():
    return special_product_handle("dessert")

@app.route("/non_beverages")
def non_handle():
    return special_product_handle("nonalcoholic drink")


@app.route("/alc_beverages")
def alc_handle():
    return special_product_handle("alcoholic drink")

@app.route("/")
def index_handle():
    return product_handle()

@app.route("/contact")
def contact_handle():
    return render_template("h.html",
        header = header_html,
        footer = footer_html)

app.run(host="0.0.0.0", port=80, debug=True)