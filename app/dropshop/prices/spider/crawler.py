import secrets

import scrapy
from http_request_randomizer.requests.proxy.requestProxy import RequestProxy
from requests import Request

proxy_list = []


class PriceItem(scrapy.Item):
    price = scrapy.Field()


class Spider(scrapy.Spider):
    name = "Spider"

    # Take url and path as argument
    def __init__(self, *args, **kwargs):
        super(Spider, self).__init__(*args, **kwargs)

        url = kwargs.get('url')
        if not url:
            raise ValueError('No url given')
        self.start_urls = [url]

        xpath = kwargs.get('xpath')
        if not xpath:
            raise ValueError('No xpath given')
        self.xpath = xpath

    def parse(self, response):
        item = PriceItem()
        item['price'] = response.xpath("{}/text()".format(self.xpath)).get()
        if item['price'] is None:
            return None
        self.crawler.price = item['price']
        return item

    def start_requests(self):
        global proxy_list
        for url in self.start_urls:

            # if not len(proxy_list):
            #     print("new list created")
            #     req_proxy = RequestProxy()  # you may get different number of proxy when  you run this at each time
            #     proxy_list = req_proxy.get_proxy_list()  # this will create proxy list
            #
            # # Selecting the proxy
            # list_length = len(proxy_list) - 1
            # random_proxy = secrets.randbelow(list_length)
            # proxy = proxy_list[random_proxy].get_address()
            # del proxy_list[random_proxy]
            proxy = "184.180.90.226"
            print('proxy is ' + proxy)
            request = scrapy.Request(url=url, callback=self.parse)
            request.meta['proxy'] = "http://{}:8080".format(proxy)
            yield request
