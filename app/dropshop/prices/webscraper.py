import re
import secrets
from multiprocessing import Process, Queue

from http_request_randomizer.requests.proxy.requestProxy import RequestProxy
from scrapy.crawler import Crawler, CrawlerProcess
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

from .spider.crawler import Spider


def f(q, url, xpath):
    try:
        crawler = Crawler(Spider)
        process = CrawlerProcess()
        process.crawl(crawler, url=url, xpath=xpath)
        process.start()
        # runner = crawler.CrawlerRunner()
        # deferred = runner.crawl(spider)
        # deferred.addBoth(lambda _: reactor.stop())
        # reactor.run()
        q.put(getattr(crawler, "price", None))
    except Exception as e:
        q.put(e)


def search_for_price(url, xpath):
    attempts = 0
    while attempts < 5:
        q = Queue()
        p = Process(target=f, args=(q, url, xpath))
        p.start()
        price = q.get()
        p.join()

        # process = CrawlerProcess()
        # process.crawl(crawler, url=url, xpath=xpath)
        # process.start()

        if price is not None:
            price = re.sub(r'[^\d\.,$£€¥₾]', '', price)
            print(price)
            return price
        else:
            attempts += 1

    print("failed")
    return None


def search_forr_price(url, dompath):
    global proxy_list
    # if the proxy list is empty get a new proxy list
    if not len(proxy_list):
        print("new list created")
        req_proxy = RequestProxy()  # you may get different number of proxy when  you run this at each time
        proxy_list = req_proxy.get_proxy_list()  # this will create proxy list

    # repeat for 3 seperate ips
    attempts = 0
    while attempts < 5:
        list_length = len(proxy_list) - 1
        random_proxy = secrets.randbelow(list_length)
        proxy = proxy_list[random_proxy].get_address()
        del proxy_list[random_proxy]

        # Give options so it works in the background
        chrome_options = Options()
        # chrome_options.add_argument("--headless")

        webdriver.DesiredCapabilities.CHROME['proxy'] = {
            "httpProxy": proxy,
            "ftpProxy": proxy,
            "sslProxy": proxy,
            "proxyType": "MANUAL",
        }

        initwebdriver = webdriver.Chrome(ChromeDriverManager().install(), options=chrome_options)

        with initwebdriver as driver:
            # Go to given url
            driver.get(url)
            try:
                price_found = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, dompath)))
                # Found price and print without $
                cost = re.sub(r'[^\d\.,$£€¥₾]', '', price_found.text)
                print(cost)
                driver.close()
                return cost
            except TimeoutException:
                attempts += 1
                driver.close()

    print("failed")
    return None
