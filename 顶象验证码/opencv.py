# CV2 识别滑块缺口距离

import cv2
import PIL
import numpy as np
from PIL import Image
from pathlib import Path


def imshow(img, winname='test', delay=0):
    """cv2展示图片"""
    cv2.imshow(winname, img)
    cv2.waitKey(delay)
    cv2.destroyAllWindows()


def pil_to_cv2(img):
    """
    pil转cv2图片
    :param img: pil图像, <type 'PIL.JpegImagePlugin.JpegImageFile'>
    :return: cv2图像, <type 'numpy.ndarray'>
    """
    img = cv2.cvtColor(np.asarray(img), cv2.COLOR_RGB2BGR)
    return img


def bytes_to_cv2(img):
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


def cv2_open(img, flag=None):
    """
    统一输出图片格式为cv2图像, <type 'numpy.ndarray'>
    :param img: <type 'bytes'/'numpy.ndarray'/'str'/'Path'/'PIL.JpegImagePlugin.JpegImageFile'>
    :param flag: 颜色空间转换类型, default: None
        eg: cv2.COLOR_BGR2GRAY（灰度图）
    :return: cv2图像, <numpy.ndarray>
    """
    if isinstance(img, bytes):
        img = bytes_to_cv2(img)
    elif isinstance(img, (str, Path)):
        img = cv2.imread(str(img))
    elif isinstance(img, np.ndarray):
        img = img
    elif isinstance(img, PIL.Image.Image):
        img = pil_to_cv2(img)
    else:
        raise ValueError(f'输入的图片类型无法解析: {type(img)}')
    if flag is not None:
        img = cv2.cvtColor(img, flag)
    return img


def get_distance(bg, tp, im_show=False, save_path=None):
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
    bg_img = cv2_open(bg)
    tp_gray = cv2_open(tp, flag=cv2.COLOR_BGR2GRAY)

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
        bg_img = cv2_open(bg)
        cv2.rectangle(bg_img, (x, y), (_x, _y), (0, 0, 255), 2)
        # 保存缺口识别结果到背景图
        if save_path:
            save_path = Path(save_path).resolve()
            save_path = save_path.parent / f"{save_path.stem}{save_path.suffix}"
            save_path = save_path.__str__()
            cv2.imwrite(save_path, bg_img)
        # 显示缺口识别结果
        if im_show:
            imshow(bg_img)
    return distance

def opencv2():
    with open("./img/re_bg.jpg", "rb") as f:
        bg_img = f.read()
    with open("./img/slide.png", "rb") as f:
        slice_img = f.read()
    distance = get_distance(bg_img, slice_img)
    return distance


if __name__ == '__main__':

    with open("./img/re_bg.jpg", "rb") as f:
        bg_img = f.read()
    with open("./img/slide.png", "rb") as f:
        slice_img = f.read()
    distance = get_distance(bg_img, slice_img)
    print(distance)