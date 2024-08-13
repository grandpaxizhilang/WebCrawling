from PIL import Image, ImageDraw


def a(n, e):
    if e in n:
        return True
    for item in n:
        if item == e:
            return True
    return False


def Pn(n):
    r = []
    for o in range(len(n)):
        c = ord(n[o])
        if o == 32:
            break
        while a(r, c % 32):
            c += 1
        r.append(c % 32)
    return r


def pic_re(pic_path, bg_line):
    img = Image.open(pic_path)

    # 还原后图片的高度和宽度
    height = 165
    width = 380

    # 切割图片的高度和宽度
    x_shuffle = 12
    y_shuffle = 200

    # 还原后的背景图
    new_img = Image.new('RGB', (width, height))

    # 处理链接转换成还原图片的数组
    line = bg_line.split("/")[-1].split(".")[0]
    t = Pn(line)

    for e in range(len(t)):
        x = t[e] * x_shuffle
        y = 0
        # 把图片切割出来
        img_cut = img.crop((x, y, x + x_shuffle, y + y_shuffle))

        # 把切割下来的图片贴到画板上
        new_x = e * x_shuffle
        new_y = 0
        new_img.paste(img_cut, (new_x, new_y))
    new_img.save('./img/re_bg.jpg')


if __name__ == "__main__":
    bg_line = ''
    pic_path = './img/bg.png'
    pic_re(pic_path, bg_line)


