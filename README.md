# 声明:

    **以下所有内容仅供学习交流，严禁用于商业用途和非法用途，否则由此产生的一切后果均与作者无关，若有侵权，请联系我立即删除！**

# 日志更新

### 2024-04-01

- 对某易云的params和encSecKey两个参数进行逆向

### 2024-04-02

- 加速乐的逆向分析

### 2024-04-04

- 极验三代滑块逆向分析

- 现在的滑块需要把三个加密参数全部逆向并且放入请求头中，不然最后会返回失败

- 在逆向过程中有一个滑块时间参数，需要和模拟轨迹后所需的时间一致

- 在逆向过程中有一个随机生成的key值，如果存在后面使用的时候这个key就是第一次生成的参数，所以要注意保持一致

### 2024-04-05

- 拼多多的anti_content逆向分析

- 需要补环境，环境检测比较简单

- 考察异步调试和webpack的扣取

### 2024-04-06

- 同花顺的cookie中的加密参数v

- 需要补环境
