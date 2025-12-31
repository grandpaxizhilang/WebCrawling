import hashlib
import base64
import re


def sha1_encrypt(message):
    sha1 = hashlib.sha1()
    sha1.update(message.encode('utf-8'))
    encrypted_msg = sha1.hexdigest()
    return encrypted_msg


def get_sign(data):
    encrypted_message = sha1_encrypt(data).upper()
    arr1 = [23, 14, 6, 36, 16, 40, 7, 19]
    str1 = ''.join(encrypted_message[i] for i in arr1 if i < len(encrypted_message) - 1)
    arr2 = [16, 1, 32, 12, 19, 27, 8, 5]
    str2 = ''.join(encrypted_message[i] for i in arr2 if i < len(encrypted_message) - 1)

    arr3 = [89, 39, 179, 150, 218, 82, 58, 252, 177, 52, 186, 123, 120, 64, 242, 133, 143, 161, 121, 179]
    arr4 = {"0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "A": 10, "B": 11, "C": 12, "D": 13, "E": 14, "F": 15}
    result_arr = []
    for i in range(20):
        p1 = arr4.get(encrypted_message[i * 2]) * 16 + arr4.get(encrypted_message[(i * 2) + 1])
        p2 = arr3[i]
        result_arr.append(p1 ^ p2)
    str3 = base64.b64encode(bytearray(result_arr)).decode('utf-8')
    str3 = re.sub('[/+=]', '', str3)
    return ("zzc" + str1 + str3 + str2).lower()




if __name__ == '__main__':
    data = "123456"
    print(get_sign(data))