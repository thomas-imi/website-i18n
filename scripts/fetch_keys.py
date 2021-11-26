"""
Fetches all pages in sitemap, extracts translation key pairs.

Usage:

./fetch_keys.py "https://site/sitemap.xml"
"""

from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import requests
import json
import sys
from collections import OrderedDict

sitemap_uri = sys.argv[1]

def parser_sitemap_xml(sitemap_link):
    response = requests.get(sitemap_link).text
    soup = BeautifulSoup(response, 'html.parser')
    urls = soup.find_all('loc')
    list = []
    for url in urls:
        url = str(url)
        url = url.replace("<loc>", "").replace("</loc>", "")
        list.append(url)
    return list


def run(playwright, url):
    webkit = playwright.webkit
    browser = webkit.launch()
    context = browser.new_context()
    page = context.new_page()
    page.goto(url)
    result = page.evaluate("JSON.stringify(tKeys).replaceAll('XXXHHH', '')")
    browser.close()
    return result

array = parser_sitemap_xml(sitemap_uri)

deduped_dict = OrderedDict()

with sync_playwright() as playwright:
    for url in array:
        r = run(playwright, url)
        j = json.loads(r)
        for k in j.keys():
            if k not in deduped_dict:
                deduped_dict[k] = j[k]

print(json.dumps(deduped_dict))
