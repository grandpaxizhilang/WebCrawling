from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from time import sleep
from chaojiying import Chaojiying_Client


url = ''

driver = webdriver.Edge()
driver.get(url)
driver.maximize_window()
sleep(2)

# 找到账号的框输入账号
driver.find_element(By.XPATH, "//input[@placeholder='请输入账号']").send_keys('')
# 找到输入密码的框输入密码
driver.find_element(By.XPATH, "//input[@placeholder='请输入密码']").send_keys('')
sleep(2)
# 点击登入按钮
driver.find_element(By.XPATH, "//div[@class='btn_primary ']").click()
sleep(4)

# 找到验证码的图片
img = driver.find_element(By.XPATH,"//div[@class='geetest_item geetest_big_item']")
img.screenshot('bilibili.png')
im = open('bilibili.png', 'rb').read()

# 连接超级鹰打码平台识别点触验证码,自己构建代码



# 利用坐标进行定位点击图片
for i in pic_list.split('|'):
    x = float(i.split(',')[0])
    y = float(i.split(',')[1])
    ActionChains(driver).move_to_element_with_offset(img, x, y).click().perform()
sleep(2)

# 点击确认按钮进入B站首页
driver.find_element(By.XPATH, "//div[@class='geetest_commit_tip']").click()
sleep(5)

# 点击热门按钮
driver.find_element(By.XPATH,"//a/div[@class='icon-bg icon-bg__popular']").click()
sleep(5)

content = driver.page_source


# 切换页面
print(driver.window_handles)
for i in driver.window_handles:
    driver.switch_to.window(i)
    if "哔哩哔哩排行榜" in driver.title:
        break

# 点击排行榜
driver.find_element(By.XPATH,"//div[@class='mask-tips-step']").click()
sleep(4)


driver.find_element(By.XPATH, '//*[@id="app"]/div/div[2]/div[1]/ul/li[8]').click()


# 获取当前页面的源码
content = driver.page_source
with open('bilibili.html','w',encoding='utf-8')as fp:
    fp.write(content)

sleep(2)

driver.quit()

