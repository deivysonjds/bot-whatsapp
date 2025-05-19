from config import driver, link_whatsapp, chat, xpath_button_new_chat, xpath_input_number
from selenium.webdriver.common.by import By
from screenshot import screenchot_qr_code
import time

driver.get(link_whatsapp)

screenchot_qr_code()

contagem = 1
while True:
    try:
        driver.implicitly_wait(10)
        chat = driver.find_element("xpath", chat)
        print("chat iniciado...\n\n")
        break
        
    except KeyboardInterrupt as intettupt:
        print("encerrando bot")
        break
    except:
        print(f"\nchat não localizado {contagem}\n")
        contagem+=1
        pass

while True:
    time.sleep(30)
    button_new_chat = driver.find_element("xpath", xpath_button_new_chat)
    button_new_chat.click()

    input_number = driver.find_element("xpath", xpath_input_number)
    input_number.send_keys('81988993441')
    time.sleep(60)
    break

driver.quit()