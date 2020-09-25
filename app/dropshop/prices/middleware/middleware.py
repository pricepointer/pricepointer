import secrets
import random

from http_request_randomizer.requests.proxy.requestProxy import RequestProxy
from scrapy.downloadermiddlewares.httpproxy import HttpProxyMiddleware
from scrapy.downloadermiddlewares.useragent import UserAgentMiddleware


proxy_list = []


class RotateUserAgentMiddleware(UserAgentMiddleware):
    def __init__(self, user_agent=''):
        self.user_agent = user_agent

    def process_request(self, request, spider):
        ua = random.choice(self.user_agent_list)
        if ua:
            request.headers.setdefault('User-Agent', ua)
            # Add desired logging message here.
            spider.log(
                u'User-Agent: {} {}'.format(request.headers.get('User-Agent'), request)
            )


class ProxyMiddleware(HttpProxyMiddleware):
    def __init__(self, proxy_ip=''):
        self.proxy_ip = proxy_ip

    def process_request(self, request, spider):
        global proxy_list
        if not len(proxy_list):
            print("new list created")
            req_proxy = RequestProxy()  # you may get different number of proxy when  you run this at each time
            proxy_list = req_proxy.get_proxy_list()  # this will create proxy list

        # Selecting the proxy
        list_length = len(proxy_list) - 1
        random_proxy = secrets.randbelow(list_length)
        proxy = proxy_list[random_proxy].get_address()
        del proxy_list[random_proxy]
        request.meta['proxy'] = proxy
        print('proxy is ' + proxy)
        print(request.meta)
        return request
