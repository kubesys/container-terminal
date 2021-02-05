process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// defined k8x configuration
const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImVDUzZnUkJ2OHI0VVA2VWpkdU1SLWNXTlF4aEhLQjNyamU2ZHhsd014cWMifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrdWJlcm5ldGVzLWNsaWVudC10b2tlbi16ZGxyZiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJrdWJlcm5ldGVzLWNsaWVudCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6ImJlZGJjMGUzLWJjNDAtNGQ2Zi1iMTAxLTk3ODkzOGZjYTZhNyIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlLXN5c3RlbTprdWJlcm5ldGVzLWNsaWVudCJ9.Qmfmf4QwubartSyLJqIW2gXHdlyKlqQsNknIVtRNjfaydw6qCa8XuGS6egqPwiN-Al8GaoGuVflyJy-bolj-aVWY-a-9fWUB0itV4SdYTNeQV5hYv6sbhnuvSo3nHp2jyZjlRyvEQNxKyQaJF6eodJPjgzCVoj8BhsSqTu7vbzCTEMEnIz8AMGJLF9G6JuffBTpO83Ch_hVbquQnKQJjK60911D-5S6SD3SilQyk_WdYblorxbRXsSm8VNkHz6BWrfa7uCDcw46XnfVVuCyRKOGmIAeIWIDq2uaI6nECkcujWCCwYzEePq-SsXU4MRwFAYd-Rdt9Q8JUw9njR0I-5A";
const host = "wss://" + process.env.host + "6443";
//const namespace = 'kube-system';
//const pod = 'kube-api-mapper-578b4644cd-q4lgw';
const container = '';
const command = 'sh';

const WebSocketServer = require('websocket').server;
const WebSocket = require('ws');
const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const documentRoot = 'public';
var ws;
//const url = `${host}/api/v1/namespaces/${namespace}/pods/${pod}/exec?container=${container}&stdin=true&stdout=true&stderr=true&tty=true&command=${command}&pretty=true&follow=true`;

var app = express();
var server = require('http').Server(app);

app.use(express.static('public'));

server.listen(31052, function() {
    console.log((new Date()) + ' Server is listening on port 31052');
    //console.log(process.env.host)
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

var connection;
wsServer.on('request', function(request) {

    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    connection = request.accept('echo-protocol', request.origin);
    
    console.log((new Date()) + ' Connection accepted.');

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

    //console.log(pod)


    // 處理由 web socket client 收到的訊息轉發 k8s exec api
    connection.on('message', function(message) {
        console.log(message.utf8Data);
        if(message.utf8Data.substring(0, 1) == "6") {
            console.log(message.utf8Data.substring(1))
            var query = message.utf8Data.substring(1)
            var vars = query.split("&");
            var pod = vars[0].split("=")[1];
            var namespace = vars[1].split("=")[1];
            var url = host + "/api/v1/namespaces/" + namespace + "/pods/" + pod +"/exec?container=" + container + "&stdin=true&stdout=true&stderr=true&tty=true&command=" + command + "&pretty=true&follow=true";
console.log(url)
            ws = new WebSocket(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        
            ws.on('open', () => {
                console.log('connected to K8S container');
            });
        
            // 轉發 k8s exec 收到的資料到 client
            ws.on('message', (data) => {
                var type = data.slice(0, 1).toString('hex')[1];
                var string = data.toString('utf8');
                var paddingMessage = type + data.slice(1).toString('base64');
                console.log('Reply: ' + paddingMessage);
                connection.send(paddingMessage);
            });
        }
        

        if (ws && ws.readyState === 1 && message.utf8Data[0] === '0') {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);

                // stdin must add 0 padding at first
                var buffer = Buffer.from(message.utf8Data.slice(1), 'base64');
                if (buffer.length > 0) {
                    var panddingBuffer = Buffer.concat([Buffer.from('00', 'hex'), buffer]);
                    ws.send(panddingBuffer);
                }
            } else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');

                // TODO padding??
                ws.send(message.binaryData);
            }
        }
        
    });

});
