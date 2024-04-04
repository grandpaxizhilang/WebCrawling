
import json
import PIL
import requests
import time
from PIL import Image
import cv2
from pathlib import Path
import numpy as np
import execjs
import re
import random

session = requests.session()
class Sample:
    gt = ''
    challenge = ''
    w1 = ''
    w2 = ''
    w3 = ''
    new_challenge = ''
    bg = ''
    slice = ''
    c = []
    s = ''
    distance = ''
    trace = ''
    passtime = ''
    gct = ''

    # 获取滑块移动的轨迹
    class get_track:
        def __ease_out_expo(self,sep):
            """
            缓动函数 easeOutExpo
            参考：https://easings.net/zh-cn#easeOutExpo
            """
            if sep == 1:
                return 1
            else:
                return 1 - pow(2, -10 * sep)

        def get_slide_track(self,distance):
            """
            根据滑动距离生成滑动轨迹
            :param distance: 需要滑动的距离
            :return: 滑动轨迹<type 'list'>: [[x,y,t], ...]
                x: 已滑动的横向距离
                y: 已滑动的纵向距离, 除起点外, 均为0
                t: 滑动过程消耗的时间, 单位: 毫秒
            """

            if not isinstance(distance, int) or distance < 0:
                raise ValueError(f"distance类型必须是大于等于0的整数: distance: {distance}, type: {type(distance)}")
            # 初始化轨迹列表
            slide_track = [
                [random.randint(-50, -10), random.randint(-50, -10), 0],
                [0, 0, 0],
            ]
            # 共记录count次滑块位置信息
            count = 30 + int(distance / 2)
            # 初始化滑动时间
            t = random.randint(50, 100)
            # 记录上一次滑动的距离
            _x = 0
            _y = 0
            for i in range(count):
                # 已滑动的横向距离
                x = round(self.__ease_out_expo(i / count) * distance)
                # 滑动过程消耗的时间
                t += random.randint(10, 20)
                if x == _x:
                    continue
                slide_track.append([x, _y, t])
                _x = x
            slide_track.append(slide_track[-1])
            return slide_track

    # CV2 识别滑块缺口距离
    class CV2:
        def imshow(self,img, winname='test', delay=0):
            """cv2展示图片"""
            cv2.imshow(winname, img)
            cv2.waitKey(delay)
            cv2.destroyAllWindows()

        def pil_to_cv2(self,img):
            """
            pil转cv2图片
            :param img: pil图像, <type 'PIL.JpegImagePlugin.JpegImageFile'>
            :return: cv2图像, <type 'numpy.ndarray'>
            """
            img = cv2.cvtColor(np.asarray(img), cv2.COLOR_RGB2BGR)
            return img

        def bytes_to_cv2(self,img):
            """
            二进制图片转cv2
            :param img: 二进制图片数据, <type 'bytes'>
            :return: cv2图像, <type 'numpy.ndarray'>
            """
            # 将图片字节码bytes, 转换成一维的numpy数组到缓存中
            img_buffer_np = np.frombuffer(img, dtype=np.uint8)
            # 从指定的内存缓存中读取一维numpy数据, 并把数据转换(解码)成图像矩阵格式
            img_np = cv2.imdecode(img_buffer_np, 1)
            return img_np

        def cv2_open(self,img, flag=None):
            """
            统一输出图片格式为cv2图像, <type 'numpy.ndarray'>
            :param img: <type 'bytes'/'numpy.ndarray'/'str'/'Path'/'PIL.JpegImagePlugin.JpegImageFile'>
            :param flag: 颜色空间转换类型, default: None
                eg: cv2.COLOR_BGR2GRAY（灰度图）
            :return: cv2图像, <numpy.ndarray>
            """
            if isinstance(img, bytes):
                img = self.bytes_to_cv2(img)
            elif isinstance(img, (str, Path)):
                img = cv2.imread(str(img))
            elif isinstance(img, np.ndarray):
                img = img
            elif isinstance(img, PIL.Image.Image):
                img = self.pil_to_cv2(img)
            else:
                raise ValueError(f'输入的图片类型无法解析: {type(img)}')
            if flag is not None:
                img = cv2.cvtColor(img, flag)
            return img

        def get_distance(self,bg, tp, im_show=False, save_path=None):
            """
            :param bg: 背景图路径或 Path 对象或图片二进制
                       eg: 'assets/bg.jpg'、Path('assets/bg.jpg')
            :param tp: 缺口图路径或 Path 对象或图片二进制
                       eg: 'assets/tp.jpg'、Path('assets/tp.jpg')
            :param im_show: 是否显示结果, <type 'bool'>; default: False
            :param save_path: 保存路径, <type 'str'/'Path'>; default: None
            :return: 缺口位置
            """
            # 读取图片
            bg_img = self.cv2_open(bg)
            tp_gray = self.cv2_open(tp, flag=cv2.COLOR_BGR2GRAY)

            # 金字塔均值漂移
            bg_shift = cv2.pyrMeanShiftFiltering(bg_img, 5, 50)

            # 边缘检测
            tp_gray = cv2.Canny(tp_gray, 255, 255)
            bg_gray = cv2.Canny(bg_shift, 255, 255)

            # 目标匹配
            result = cv2.matchTemplate(bg_gray, tp_gray, cv2.TM_CCOEFF_NORMED)
            # 解析匹配结果
            min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)

            distance = max_loc[0]
            if save_path or im_show:
                # 需要绘制的方框高度和宽度
                tp_height, tp_width = tp_gray.shape[:2]
                # 矩形左上角点位置
                x, y = max_loc
                # 矩形右下角点位置
                _x, _y = x + tp_width, y + tp_height
                # 绘制矩形
                bg_img = self.cv2_open(bg)
                cv2.rectangle(bg_img, (x, y), (_x, _y), (0, 0, 255), 2)
                # 保存缺口识别结果到背景图
                if save_path:
                    save_path = Path(save_path).resolve()
                    save_path = save_path.parent / f"{save_path.stem}{save_path.suffix}"
                    save_path = save_path.__str__()
                    cv2.imwrite(save_path, bg_img)
                # 显示缺口识别结果
                if im_show:
                    self.imshow(bg_img)
            return distance

    # 获取动态的键值对（w3的o里面需要这个参数)
    def get_gct(self):
        headers = {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0",
        }

        # gct js 路径
        gct_path = "https://static.geetest.com/static/js/gct.b71a9027509bc6bcfef9fc6a196424f5.js"
        gct_js = requests.get(gct_path, headers=headers).text
        # 正则匹配需要调用的方法名称
        function_name = re.findall(r"\)\)\{return (.*?)\(", gct_js)[0]
        # 查找需要插入全局导出代码的位置
        break_position = gct_js.find("return function(t){")
        # window.gct 全局导出方法
        gct_js_new = gct_js[:break_position] + "window.gct=" + function_name + ";" + gct_js[break_position:]
        # 添加自定义方法调用 window.gct 获取键值对
        gct_js_new = "window = global;" + gct_js_new + """
        function getGct(){
            var e = {"lang": "zh", "ep": "test data"};
            window.gct(e);
            delete e["lang"];
            delete e["ep"];
            return e;
        }"""
        gct = execjs.compile(gct_js_new).call("getGct")
        # print(gct)
        Sample.gct = gct

    # 还原图片
    def restore_pic(self):
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
            'Referer': 'https://www.geetest.com/'
        }
        pic = requests.get(url=Sample.bg, headers=headers).content
        with open(r'D:/Pycharm/code/JS/bg.jpg', 'wb') as fp:
            fp.write(pic)

        pic = requests.get(url=Sample.slice, headers=headers).content
        with open(r'D:/Pycharm/code/JS/slice.jpg', 'wb') as fp:
            fp.write(pic)

        # 打开图片
        img = Image.open('D:/Pycharm/code/JS/bg.jpg')
        # 图片还原顺序
        Ut = [39, 38, 48, 49, 41, 40, 46, 47, 35, 34, 50, 51, 33, 32, 28, 29, 27, 26, 36, 37, 31, 30, 44, 45, 43, 42,
              12, 13, 23, 22, 14, 15, 21, 20, 8, 9, 25, 24, 6, 7, 3, 2, 0, 1, 11, 10, 4, 5, 19, 18, 16, 17]

        # 还原后图片的高度和宽度
        height = 160
        width = 260

        # 切割图片的高度和宽度
        x_shuffle = 10
        y_shuffle = 80

        # 还原后的背景图
        new_img = Image.new('RGB', (width, height))

        # 对图片进行切割还原，根据js代码进行逻辑还原
        for i in range(len(Ut)):
            x = Ut[i] % 26 * 12 + 1
            y = y_shuffle if Ut[i] > 25 else 0

            # 把图片切割出来
            img_cut = img.crop((x, y, x + x_shuffle, y + y_shuffle))

            new_x = i % 26 * 10
            new_y = y_shuffle if i > 25 else 0
            # 把切割下来的图片贴到画板上
            new_img.paste(img_cut, (new_x, new_y))

        # 保存还原好的图片
        new_img.save('D:/Pycharm/code/JS/bg.jpg')

    # 获取三个包加密的w
    def get_w123(self,count):
        if count == 1:
            # 打开js文件运行里面的函数
            js = open('node_8_w12.js', 'r', encoding='utf-8').read()
            ctx = execjs.compile(js)
            # 调用js里面的函数（第一个是函数名，参数）
            w12 = ctx.call('get_w12', Sample.gt, Sample.challenge)
            Sample.w1 = w12[0]
            Sample.w2 = w12[1]
        else:
            js = open('node_8_w3.js', 'r', encoding='utf-8').read()
            ctx = execjs.compile(js)
            # 调用js里面的函数（第一个是函数名，参数）
            w3 = ctx.call('get_w3', Sample.distance, Sample.new_challenge, Sample.passtime, Sample.c, Sample.s,
                          Sample.trace, Sample.gct, Sample.gt, Sample.challenge)
            Sample.w3 = w3


    # 请求第一个包register-slide  返回gt和challenge
    def request_register(self,t):
        url = ""
        headers = {
            "user-agent": "",
            "Referer": "",
        }
        params = {
            t: t
        }
        response = session.get(url=url, headers=headers, params=params).json()
        Sample.gt = response['gt']
        Sample.challenge = response['challenge']

    # 请求第三和第五个包get.php，
    def request_get(self,count):
        if count == 1:
            url = ''
            headers = {
                "user-agent": "",
                "Referer": "",
            }
            params = {
                'gt': Sample.gt,
                'challenge': Sample.challenge,
                'lang': 'zh-cn',
                'pt': '0',
                'client_type': 'web',
                'w': Sample.w1,
                'callback': 'geetest_' + str(int(time.time())) + str(random.randint(100, 999)),
            }
            response = session.get(url=url, headers=headers, params=params).text

        else:
            url = ''
            headers = {
                "user-agent": "",
                "Referer": "",
            }
            params = {
                'is_next': 'true',
                'type': 'slide3',
                'gt': Sample.gt,
                'challenge': Sample.challenge,
                'lang': 'zh-cn',
                'https': 'true',
                'protocol': 'https://',
                'offline': 'false',
                'product': 'embed',
                'api_server': 'api.geetest.com',
                'isPC': 'true',
                'autoReset': 'true',
                'width': '100%',
                'callback': 'geetest_' + str(int(time.time())) + str(random.randint(100, 999)),
            }
            response = session.get(url=url, headers=headers, params=params).text
            context = json.loads(response.split('(')[1].split(')')[0])
            Sample.new_challenge = context["challenge"]
            Sample.bg = '' + context['bg']
            Sample.slice = '' + context['slice']
            Sample.c = context['c']
            Sample.s = context['s']


    # 请求第四和第六个包ajax.php
    def request_ajax(self,count):
        if count == 1:
            url = ''
            headers = {
                "user-agent": "",
                "Referer": "",
            }
            params = {
                'gt': Sample.gt,
                'challenge': Sample.challenge,
                'lang': 'zh-cn',
                'pt': '0',
                'client_type': 'web',
                'w': Sample.w2,
                'callback': 'geetest_' + str(int(time.time())) + str(random.randint(100, 999)),
            }
            response = session.get(url=url, headers=headers, params=params).text

        else:
            url = ''
            headers = {
                "user-agent": "",
                "Referer": "",
            }
            params = {
                'gt': Sample.gt,
                'challenge': Sample.new_challenge,
                'lang': 'zh-cn',
                '$_BCN': '0',
                'client_type': 'web',
                'w': Sample.w3,
                'callback': 'geetest_' + str(int(time.time())) + str(random.randint(100, 999)),
            }
            response = session.get(url=url, headers=headers, params=params).text
            return response





if __name__ == '__main__':

    for i in range(1,11):
        t = int(time.time())
        text = Sample()
        # 获取加密的前两个个w
        text.get_w123(1)
        text.request_register(t)
        text.request_get(1)
        text.request_ajax(1)
        text.request_get(2)
        text.restore_pic()
        bg_path = ''
        slice_path = ''
        Sample.distance = Sample.CV2().get_distance(bg_path, slice_path)
        Sample.trace = Sample.get_track().get_slide_track(Sample.distance)
        Sample.passtime = Sample.trace[len(Sample.trace) - 1][2]
        text.get_gct()
        text.get_w123(2)
        result = text.request_ajax(2)
        print('第'+ str(i)+'次：' + result)
        time.sleep(3)



