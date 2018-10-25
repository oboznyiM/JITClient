var dishes_list = []

var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;

var xhr = new XHR();

xhr.open('GET', API_URL + '/get/dishes', true);

xhr.onload = function() {
    dishes_list = JSON.parse(this.responseText).res;
}
xhr.send()

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

function load_without_tag()
{
    url = window.location.origin + window.location.pathname + "?";
    sort_type = findGetParameter("sort_type");
    if(sort_type)
    {
        url += "sort_type=" + sort_type;
    }
    window.location.href = url;
}

function load_with_new_tag(new_tag)
{
    url = window.location.origin + window.location.pathname + "?";
    sort_type = findGetParameter("sort_type");
    if(sort_type)
    {
        url += "sort_type=" + sort_type;
    }
    url += "&tag=" + new_tag;
    window.location.href = url;
}

function load_with_new_sort(new_sort_type)
{
    url = window.location.origin + window.location.pathname + "?";
    tag = findGetParameter("tag");
    if(tag)
    {
        url += "tag=" + tag;
    }

    if(new_sort_type == 1)
    {
        url += "&sort_type=low_to_hight";
    }
    else if(new_sort_type == 2)
    {
        url += "&sort_type=hight_to_low"
    }
    window.location.href = url;
}

window.addEventListener("load", () => {
    sort_type = findGetParameter("sort_type");
    selectTitle = document.getElementById('select2-sort_type_chooser-container')
    select = document.getElementById('sort_type_chooser')

    if(sort_type=="low_to_hight")
    {
        selectTitle.innerHTML = "От дешевых к дорогим"
        select.selectedIndex = 1
    }
    else if(sort_type=="hight_to_low")
    {
        selectTitle.innerHTML = "От дорогих к дешевым"
        select.selectedIndex = 2
    }
    else
    {
        selectTitle.innerHTML = "Без сортировки"
        select.selectedIndex = 0
    }
});