import asyncio
import zlib
import json
import brotli
import requests
import websockets
import struct
import time


headers_ws = {

}

header = {

}


# 获取token
def get_token():
    url = ''
    params = {
        "id": roomid,
        "type": "0"
    }

    response = requests.get(url=url, headers=header, params=params)
    return json.loads(response.text)['data']['token']


def get_array_buffer(code):
    r_a_WS_PACKAGE_HEADER_TOTAL_LENGTH = 16
    r_a_WS_PACKAGE_OFFSET = 0

    def a_a_mergeArrayBuffer(buffer1, buffer2):
        # 创建一个新的bytearray，长度为两个输入缓冲区的总长度
        merged_buffer = bytearray(len(buffer1) + len(buffer2))
        # 将第一个缓冲区的内容复制到新的bytearray
        merged_buffer[:len(buffer1)] = buffer1
        # 将第二个缓冲区的内容复制到新的bytearray，紧接着第一个缓冲区的内容
        merged_buffer[len(buffer1):] = buffer2
        # 返回合并后的bytearray
        return merged_buffer

    class Encoder:
        def encode(self, data):
            # 将字符串数据编码为UTF-8字节序列
            if isinstance(data, str):
                return data.encode('utf-8')
            else:
                raise TypeError("Data must be a string.")

    # 示例实现
    class Example:
        def __init__(self):
            self.encoder = Encoder()
            self.wsBinaryHeaderList = [
                {
                    "name": "Header Length",
                    "key": "headerLen",
                    "bytes": 2,
                    "offset": 4,
                    "value": 16
                },
                {
                    "name": "Protocol Version",
                    "key": "ver",
                    "bytes": 2,
                    "offset": 6,
                    "value": 1
                },
                {
                    "name": "Operation",
                    "key": "op",
                    "bytes": 4,
                    "offset": 8,
                    "value": 1
                },
                {
                    "name": "Sequence Id",
                    "key": "seq",
                    "bytes": 4,
                    "offset": 12,
                    "value": 1
                }
            ]

        def convertToArrayBuffer(self, e, t):

            buffer = bytearray(r_a_WS_PACKAGE_HEADER_TOTAL_LENGTH)
            encoded_data = self.encoder.encode(e)

            # 设置WebSocket包头的总长度加上编码后数据的长度
            struct.pack_into('>I', buffer, r_a_WS_PACKAGE_OFFSET,
                             r_a_WS_PACKAGE_HEADER_TOTAL_LENGTH + len(encoded_data))

            # 更新二进制头部列表中的值
            self.wsBinaryHeaderList[2]['value'] = t

            # 遍历头部列表并设置相应的值
            for header in self.wsBinaryHeaderList:
                if header['bytes'] == 4:
                    struct.pack_into('>I', buffer, header['offset'], header['value'])
                elif header['bytes'] == 2:
                    struct.pack_into('>H', buffer, header['offset'], header['value'])

            # 合并头部和编码后的数据
            return a_a_mergeArrayBuffer(buffer, encoded_data)

    # 使用示例
    data = {
        "uid": ,
        "roomid": roomid,
        "protover": 3,
        "buvid": "c",
        "platform": "web",
        "type": 2,
        "key": get_token()
    }
    
    e = json.dumps(data)
    example = Example()

    if code == 1:
        array_buffer = example.convertToArrayBuffer(e, 7)
        return array_buffer
    elif code == 2:
        array_buffer = example.convertToArrayBuffer('{}', 2)
        return array_buffer


def get_result(data):
    wsBinaryHeaderList = [
                {
                    "name": "Header Length",
                    "key": "headerLen",
                    "bytes": 2,
                    "offset": 4,
                    "value": 16
                },
                {
                    "name": "Protocol Version",
                    "key": "ver",
                    "bytes": 2,
                    "offset": 6,
                    "value": 1
                },
                {
                    "name": "Operation",
                    "key": "op",
                    "bytes": 4,
                    "offset": 8,
                    "value": 2
                },
                {
                    "name": "Sequence Id",
                    "key": "seq",
                    "bytes": 4,
                    "offset": 12,
                    "value": 1
                }
            ]
    WS_OP_MESSAGE = 5
    WS_OP_CONNECT_SUCCESS = 8
    WS_OP_HEARTBEAT_REPLY = 3
    WS_PACKAGE_HEADER_TOTAL_LENGTH = 16
    WS_PACKAGE_OFFSET = 0
    WS_HEADER_OFFSET = 4
    WS_BODY_PROTOCOL_VERSION_NORMAL = 0
    WS_BODY_PROTOCOL_VERSION_BROTLI = 3

    def convertToObject(data):
        result = {
            "body": []
        }
        result['packetLen'] = struct.unpack('>I', data[0:4])[0]
        for header in wsBinaryHeaderList:
            if header['bytes'] == 4:
                result[header['key']] = struct.unpack('>I', data[header['offset']:header['offset'] + 4])[0]
            elif header['bytes'] == 2:
                result[header['key']] = struct.unpack('>H', data[header['offset']:header['offset'] + 2])[0]

        if result['packetLen'] < len(data):
            convertToObject(data[:result['packetLen']])

        if not result['op'] or result['op'] != WS_OP_MESSAGE and result['op'] != WS_OP_CONNECT_SUCCESS:
            if result['op'] and result['op'] == WS_OP_HEARTBEAT_REPLY:
                result['body'] = {
                    "count":
                        struct.unpack('>I', data[WS_PACKAGE_HEADER_TOTAL_LENGTH:WS_PACKAGE_HEADER_TOTAL_LENGTH + 4])[0]
                }
        else:
            i = WS_PACKAGE_OFFSET
            while i < len(data):
                o = struct.unpack('>I', data[i:i + 4])[0]
                s = struct.unpack('>H', data[i + WS_HEADER_OFFSET:i + WS_HEADER_OFFSET + 2])[0]
                try:
                    if result['ver'] == WS_BODY_PROTOCOL_VERSION_NORMAL:
                        c = data[i + s:i + o].decode('utf-8')  # 使用 bytes.decode() 方法来解码数据
                        l = json.loads(c) if len(c) != 0 else None
                    elif result['ver'] == WS_BODY_PROTOCOL_VERSION_BROTLI:
                        u = data[i + s:i + o]
                        d = brotli.decompress(u)
                        l = convertToObject(d)['body']
                    if l:
                        result['body'].append(l)
                except Exception as e:
                    print("decode body error:", data, result, e)
                i += o
        return result

    return convertToObject(data)



# 接受信息
async def recv_msg(websocket):
    while 1:
        resv_text = await websocket.recv()
        # print('1:',resv_text)
        get_DM(resv_text)



def get_DM(data):
    text = get_result(data)
    # print(text)
    if text['ver'] == 3:
        if text['op'] == 5:
            try:
                if 'DANMU_MSG' in str(text):
                    print(text['body'][0][0]['info'][1])
            except:
                pass


#心跳包
async def heartbeat(websocket):
    while True:
        await asyncio.sleep(30)
        await websocket.send(get_array_buffer(2))
        print('[Notice] Sent HeartBeat.')


async def main_connect():
    async with websockets.connect('',extra_headers=headers_ws) as websocket:
        await websocket.send(get_array_buffer(1))
        recv_text = await websocket.recv()
        print('连接成功')
        await asyncio.gather(recv_msg(websocket), heartbeat(websocket))



if __name__ == '__main__':
    roomid = ''

    # try:
    #     start = time.time()
    #     asyncio.get_event_loop().run_until_complete(main_logic())
    #     asyncio.get_event_loop().run_forever()
    # except Exception as e:
    #     print(e)
    #     end = time.time()
    #     print(str(end-start))
    #     # print('退出连接')

    asyncio.get_event_loop().run_until_complete(main_connect())
    asyncio.get_event_loop().run_forever()
