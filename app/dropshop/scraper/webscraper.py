import re
from os import path

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


def search_for_price(url, dompath):
    chrome_driver_path = path.join(path.dirname(path.realpath(__file__)), "chromedriver")

    # Work in the background
    chrome_options = Options()
    chrome_options.add_argument("--headless")

    initwebdriver = webdriver.Chrome(
        executable_path=chrome_driver_path,
        options=chrome_options
    )

    with initwebdriver as driver:
        # Go to given url
        driver.get(url)
        try:
            price_found = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, dompath)))
        except TimeoutException:
            driver.close()
            return None

        # Found price and print without $
        cost = re.sub(r'[^\d\.]', '', price_found.text)
        print(cost)
        driver.close()
        return cost
