from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
import time
import re


def searchForPrice(url, dompath):
    chrome_driver_path = "/Users/drewdaism/Projects/dropshop/app/dropshop/chromedriver"

    # Work in the background
    chrome_options = Options()
    chrome_options.add_argument("--headless")

    initwebdriver = webdriver.Chrome(
        executable_path=chrome_driver_path,
        options=chrome_options
    )

    with initwebdriver as driver:
        # timeout
        WebDriverWait(driver, 10)

        # Go to given url
        driver.get(url)

        # Wait for url to load
        time.sleep(5)

        try:
            priceFound = driver.find_element_by_xpath(dompath)
        except NoSuchElementException as e:
            print("Price not found")
            driver.close()
            return 'None'
        finally:
            # Found price and print without $
            cost = re.sub('[^\\d]', '', priceFound.text)
            print(cost)
            driver.close()
            return cost




