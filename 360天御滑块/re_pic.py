from PIL import Image, ImageDraw


def pic_re(pic_path, bg_line):
    img = Image.open(pic_path)

    # 设定新建图片的高度和宽度
    height = 284
    width = 544

    # 切割图片的高度和宽度
    x_shuffle = 17
    y_shuffle = 284

    # 还原后的背景图
    new_img = Image.new('RGB', (width, height))

    # 处理链接转换成还原图片的数组
    t = []
    line = bg_line.split("/")[-1].split(".")[0]
    for i in range(len(line)):
        num = ord(line[i]) % 32
        while num in t:
            num += 1
            if num == 32:
                num = 0
        t.append(num)

    for e in range(len(t)):
        x = e * x_shuffle
        y = 0
        # 把图片切割出来
        img_cut = img.crop((x, y, x + x_shuffle, y + y_shuffle))

        # 缩放切割下来的图片
        # new_width = int(x_shuffle * (height / y_shuffle))
        # img_cut = img_cut.resize((new_width, height))

        # 把切割下来的图片贴到画板上
        new_x = t[e] * x_shuffle
        new_y = 0
        new_img.paste(img_cut, (new_x, new_y))
    new_img.save('./img/re_bg.jpg')




