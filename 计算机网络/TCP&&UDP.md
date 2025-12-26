<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-11-25 18:04:31
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-12-26 14:31:18
 * @FilePath: /cjmLearn/计算机网络/TCP&&UDP.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# TCP（可靠）

TCP（Transmission Control Protocol，传输控制协议）是面向连接的协议，也就是说，在收发数据前，必须和对方建立可靠的连接。 一个 TCP 连接必须要经过三次“对话”才能建立起来

## 三次握手

- 客户端发送 SYN 报文（同步请求）。
- 服务器收到 SYN 后，返回 SYN-ACK 报文（同步确认）。
- 客户端收到 SYN-ACK 后，发送 ACK 报文（确认连接）。

## 四次挥手

- 客户端发送 FIN 报文，表示数据发送完毕。
- 服务器收到 FIN 后，回复 ACK 报文，表示准备断开连接。
- 服务器发送 FIN 报文，表示关闭连接。
- 客户端收到 FIN 后，回复 ACK 报文，连接关闭。
  可靠性

# UDP（不可靠）

UDP（User Datagram Protocol），用户数据包协议，是一个简单的面向数据报的通信协议，即对应用层交下来的报文，不合并，不拆分，只是在其上面加上首部后就交给了下面的网络层
也就是说无论应用层交给 UDP 多长的报文，它统统发送，一次发送一个报文，而对接收方，接到后直接去除首部，交给上面的应用层就完成任务。

- UDP 报头包括 4 个字段，每个字段占用 2 个字节（即 16 个二进制位），标题短，开销小

## 无连接

- 不需要建立连接，减少了连接建立和断开的开销。
- 无连接状态，每个报文都是独立的，没有状态信息。

## 不可靠

- 不保证数据的可靠传输，可能会丢失或重复。
- 没有确认机制，无法保证数据的顺序和完整性。
