from config import driver, xpath_qr_code, xpath_element_bottom_qr_code
from PIL import Image, ImageOps
import io,time
from selenium.webdriver.common.action_chains import ActionChains

def screenchot_qr_code():
    time.sleep(10)
    qr_code = driver.find_element("xpath", xpath_qr_code)
    element_bottom_qr_code = driver.find_element("xpath", xpath_element_bottom_qr_code)
    ActionChains(driver) \
        .move_to_element(element_bottom_qr_code) \
        .perform()

    qr_code_bytes = qr_code.screenshot_as_png
    img_bytes = Image.open(io.BytesIO(qr_code_bytes))

    border = int(img_bytes.width * 0.15)
    img_bordered = ImageOps.expand(img_bytes, border=border, fill="white")

    img_bordered.save('qr_code.png')
