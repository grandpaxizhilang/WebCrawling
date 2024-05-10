import json
import time
import requests
import re
import hashlib
import urllib.parse
from loguru import logger
import math
import pymysql
from datetime import datetime

session = requests.session()

headers = {
    'Origin':'',
    'Referer':'',
    'User-Agent':''
}

cookie = {
}

# 储存子评论区的root
roots = []
# 储存父评论区的数据
father_data = []
# 储存子评论区的数据
child_data = []


def db_connect():
    conn = pymysql.connect(
    )
    return conn


def md5_encode(s):
    m = hashlib.md5()
    m.update(s.encode('utf-8'))
    return m.hexdigest()


def encode_uri_component(s):
    return urllib.parse.quote(s, safe='~()*!.\'')


def get_rid(data):
    H = 'ea1db124af3c7062474693fa704f4ff8'
    q = sorted(data.keys())
    ne = []
    te = re.compile(r"[!'()*]")
    for oe in range(len(q)):
        le = q[oe]
        de = data[le]
        if de and type(de) == 'str':
            de = te.sub("", de)
        if le == 'pagination_str':
            ne.append(f"pagination_str={encode_uri_component(de)}")
        else:
            ne.append(f'{le}={de}')
    ee = '&'.join(ne)
    w_rid = md5_encode(ee + H)
    return w_rid


# 获取评论的json数据——后续可以进行数据库存入操作或者保存为csv文件
def get_comments(response):
    comments = json.loads(response.text)

    # 判断是不是父评论区
    if 'root' not in comments['data']:
        # 获取子评论区
        for i in range(len(comments['data']['replies'])):
            uid = comments['data']['replies'][i]['mid_str']
            content = comments['data']['replies'][i]['content']['message']
            date = datetime.fromtimestamp(comments['data']['replies'][i]['ctime']).strftime('%Y-%m-%d')
            # 这里判断有没有回复，如果不是空数组就存入root，并且把数据存到父评论区的列表中
            if comments['data']['replies'][i]['replies']:
                root = comments['data']['replies'][i]['rpid_str']
                roots.append(root)
                father_data.append((uid, content, date, '', root))
            else:
                father_data.append((uid, content, date, '', ''))

        # 判断是否爬到最后一页    判断的标准是返回的replies是否是空数组
        if not comments['data']['replies'] or comments == None:
            return 0
        return 1

    # 子评论区的操作
    else:
        for i in range(len(comments['data']['replies'])):
            uid = comments['data']['replies'][i]['mid_str']
            content = comments['data']['replies'][i]['content']['message']
            date = datetime.fromtimestamp(comments['data']['replies'][i]['ctime']).strftime('%Y-%m-%d')
            root = comments['data']['root']['rpid_str']
            child_data.append((uid, content, date, root, ''))

        # 找到总共的回复评论,计算需要的页数
        count = comments['data']['page']['count']
        pages = math.ceil(count / 10)
        return pages


# 存储数据到数据库
def db_save(conn):
    cursor = conn.cursor()
    sql = 'insert into '

    # 这里每插入50条数据再提交一次事务
    for i in range(0, len(father_data), 50):
        cursor.executemany(sql, father_data[i:i+50])
        conn.commit()
    for i in range(0, len(child_data), 50):
        cursor.executemany(sql, child_data[i:i+50])
        conn.commit()



# 请求该视频页面，返回oid
def request_html(bv):
    url = '' + bv
    params_html = {
        "vd_source": "875ffffc1eb110a7185c9b9c9897ba90"
    }
    response = session.get(url=url, headers=headers, params=params_html, cookies=cookie)
    oid = response.text.split('"aid":')[1].split(',')[0]
    logger.info('生成的oid:' + oid)
    return oid


# 请求父评论区返回数据
def request_main(oid):
    url = ''
    params = {
        "oid": oid,
        "type": '1',
        "mode": '3',
        "pagination_str": "{\"offset\":\"\"}",
        "plat": '1',
        "seek_rpid": "",
        "web_location": "1315875",
        "wts": int(time.time())
    }
    # 生成加密参数
    w_rid = get_rid(params)
    params['w_rid'] = w_rid

    # 发送请求
    response = session.get(url=url, headers=headers, params=params, cookies=cookie)
    # 获取评论
    get_comments(response)

    # 程序睡眠，防风控
    time.sleep(0.5)

    # 下一页的请求参数，爬取每下一页的请求参数都一样，就时间戳和加密参数发生了变化
    params_next = {
        "oid": oid,
        "type": "1",
        "mode": "3",
        "pagination_str": "{\"offset\":\"{\\\"type\\\":1,\\\"direction\\\":1,\\\"session_id\\\":\\\"1756344138195927\\\",\\\"data\\\":{}}\"}",
        "plat": "1",
        "web_location": "1315875",
    }

    # 判断是否爬完的标记
    flag = 1
    # 这里保持一个会话一直请求就可以实现翻页的操作(这里可以直接使用while死循环)
    while flag:
        # 这里重新赋值请求参数并把时间戳和加密参数放进去
        params = params_next.copy()
        params["wts"] = int(time.time())
        w_rid = get_rid(params)
        params['w_rid'] = w_rid

        # 发送请求
        response_next = session.get(url=url, headers=headers, params=params, cookies=cookie)
        # 获取评论,返回标识
        flag = get_comments(response_next)
        # 防风控
        time.sleep(1)
        break

    logger.success('=================父评论区爬取结束=================')


# 爬取子评论区
def request_child(oid):
    url = ''
    params_chlid = {
        "oid": oid,
        "type": "1",
        "ps": "10",
        "gaia_source": "main_web",
        "web_location": "333.788",
    }

    while True:
        root = roots.pop(0)

        params = params_chlid.copy()
        params["wts"] = int(time.time())
        params["root"] = root
        params["pn"] = 1
        w_rid = get_rid(params)
        params['w_rid'] = w_rid

        response_child = session.get(url=url, headers=headers, params=params, cookies=cookie)
        time.sleep(0.5)
        # 获取总共的页数
        page = get_comments(response_child)
        logger.info('页数:' + str(page))

        for i in range(2, page + 1):
            params_ = params_chlid.copy()
            params_["wts"] = int(time.time())
            params["root"] = root
            params_["pn"] = i
            w_rid = get_rid(params)
            params['w_rid'] = w_rid

            response_child = session.get(url=url, headers=headers, params=params, cookies=cookie)
            get_comments(response_child)
            time.sleep(0.5)

        # 如果roots里面没有数据了就退出
        if not roots:
            break
    logger.success('=================子评论区爬取成功=================')


if __name__ == '__main__':
    # 连接数据库
    conn = db_connect()


    bv = 'BV1pZ421E7Er'
    oid = request_html(bv)
    request_main(oid)
    logger.info(roots)
    request_child(oid)

    db_save(conn)

    # 关闭数据库连接
    conn.close()
    logger.success('数据库关闭，全部评论爬取完毕')
