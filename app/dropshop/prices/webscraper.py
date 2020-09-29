import asyncio
import base64
import re

import shadow_useragent
from django.conf import settings
from pyppeteer import launch

ua = shadow_useragent.ShadowUserAgent()
proxy_list = []


async def scraper(url, xpath):
    try:
        browser = await launch(
            headless=True,
            http_proxy=settings.SCRAPER_PROXY_URL,
        )
        page = await browser.newPage()
        await page.setUserAgent(ua.random_nomobile)
        await page.setExtraHTTPHeaders({
            'Proxy-Authorization': (
                'Basic ' + base64.b64encode(
                '{}:{}'.format(settings.SCRAPER_PROXY_USERNAME, settings.SCRAPER_PROXY_PASSWORD).encode()).decode()
            ),
        })
        await page.goto(url, {
            'waitUntil': 'networkidle0',
        })
        elements = await page.xpath(xpath)
        if elements:
            return await page.evaluate('(element) => element.textContent', elements[0])
    except Exception as e:
        print(e)
    return None


def search_for_price(url, xpath):
    # global proxy_list
    # if not len(proxy_list):
    #     print("new list created")
    #     req_proxy = RequestProxy()  # you may get different number of proxy when  you run this at each time
    #     proxy_list = req_proxy.get_proxy_list()  # this will create proxy list

    attempts = 0
    while attempts < 5:
        # Selecting the proxy
        # list_length = len(proxy_list) - 1
        # random_proxy = secrets.randbelow(list_length)
        # proxy = proxy_list[random_proxy].get_address()
        # del proxy_list[random_proxy]

        price = asyncio.get_event_loop().run_until_complete(scraper(url, xpath))

        if price is not None:
            price = re.sub(r'[^\d\.,$£€¥₾]', '', price)
            return price
        else:
            attempts += 1

    print("failed")
    return None
