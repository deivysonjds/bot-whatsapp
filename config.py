from selenium import webdriver

driver = webdriver.Chrome()

xpath_qr_code = '//*[@id="app"]/div/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div[1]/div'
link_whatsapp = 'https://web.whatsapp.com/'
chat = '//*[@id="pane-side"]/div[1]/div/div/div[1]'

xpath_element_bottom_qr_code = '//*[@id="app"]/div/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div[2]/div[2]/label'
xpath_button_new_chat = '//*[@id="app"]/div/div[3]/div/div[3]/header/header/div/span/div/div[1]/button'
xpath_input_number = '//*[@id="app"]/div/div[3]/div/div[2]/div[1]/span/div/span/div/div[1]/div[2]/div/div/div/p/span'
