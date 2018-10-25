import os
import requests
from json import dumps, loads
from math import ceil
from flask import render_template, Flask, send_from_directory, request, make_response, Markup
from config import Config

def load_dishes():
    dishes_request = requests.get("{}/get/dishes".format(Config.API_URL))
    return loads(dishes_request.text)["res"]

app = Flask(__name__)

@app.route("/vendor/<path:p>")
def vendor_handle(p):
    return send_from_directory("design/vendor", p)

@app.route("/css/<path:p>")
def css_handle(p):
    return send_from_directory("design/css", p)

@app.route("/js/<path:p>")
def js_handle(p):
    return send_from_directory("design/js", p)

@app.route("/include/<path:p>")
def include_handle(p):
    return send_from_directory("design/include", p)

@app.route("/fonts/<path:p>")
def fonts_handle(p):
    return send_from_directory("design/fonts", p)

@app.route("/images/<path:p>")
def images_handle(p):
    return send_from_directory("design/images", p)

@app.route("/third-party-scripts/<path:p>")
def third_party_scripts_handle(p):
    return send_from_directory("third-party-scripts", p)

with open("templates/components/header.html") as fin:
    header_html = Markup(fin.read())

with open("templates/components/cart_header.html") as fin:
    cart_header_html = Markup(fin.read())

with open("templates/components/footer.html") as fin:
    footer_html = Markup(fin.read())

@app.route("/cart")
def cart_handle():
    dishes_list = load_dishes()

    in_cart = {}
    try:
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

    return render_template("cart.html",
        api_url=Config.API_URL,
        in_cart_dishes=in_cart,
        dishes_list=dishes_list,
        header=cart_header_html,
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
        api_url=Config.API_URL,
        header=header_html,
        footer=footer_html)

@app.route("/track")
def track_handle():
    return render_template(
        "track.html",
        api_url=Config.API_URL,
        header=header_html,
        footer=footer_html
    )


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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)