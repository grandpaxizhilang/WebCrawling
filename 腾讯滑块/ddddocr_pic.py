import ddddocr

def ddddocr_pic():

    det = ddddocr.DdddOcr(det=False, ocr=False, show_ad=False)

    with open('./img/slide.png', 'rb') as f:
        target_bytes = f.read()

    with open('./img/bg.png', 'rb') as f:
        background_bytes = f.read()

    res = det.slide_match(target_bytes, background_bytes, simple_target=True)
    return res['target'][0]