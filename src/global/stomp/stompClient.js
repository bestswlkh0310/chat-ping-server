import stompit from 'stompit';

const connectOptions = {
    'host': 'localhost',
    'port': 61613,
    'connectHeaders': {
        'host': '/',
        'login': 'username',
        'passcode': 'password',
        'heart-beat': '5000,5000'
    }
};

class StompClient {

    static init() {
        stompit.connect(connectOptions, (error, client) => {
            if (error) {
                console.error('STOMP Connection Error:', error.message);
                return;
            }

            console.log('STOMP Connected');
            //
            // const subscribeHeaders = {
            //     destination: '/queue/test', // 대상 큐
            //     ack: 'auto' // 자동 ACK
            // };
            //
            // // 메시지 수신
            // client.subscribe(subscribeHeaders, (error, message) => {
            //     if (error) {
            //         console.error('STOMP Subscribe Error:', error.message);
            //         return;
            //     }
            //
            //     message.readString('utf-8', (error, body) => {
            //         if (error) {
            //             console.error('STOMP Message Read Error:', error.message);
            //             return;
            //         }
            //
            //         console.log('Received message:', body);
            //     });
            // });
            //
            // // 메시지 발신
            // const sendHeaders = {
            //     destination: '/queue/test', // 발신 대상 큐
            //     'content-type': 'application/json',
            // };
            //
            // const frame = client.send(sendHeaders);
            // frame.write('Hello from STOMP!');
            // frame.end();
        });

        // this.io.on("connection", (stomp) => {
        //
        //     stomp.on('cancel', (id) => {
        //         const room = Repository.getRoomById(id);
        //         if (room) {
        //             const {member1, member2} = room;
        //             Socket.io.emit("cancel", {
        //                 member1,
        //                 member2
        //             });
        //         }
        //         Repository.deleteRoomByUserId(id);
        //     });
        //
        //     stomp.on('message', (data) => {
        //         const {message, id} = data;
        //         const room = Repository.getRoomById(id);
        //         if (room) {
        //             const {member1, member2} = room;
        //             Repository.insertChat(room.id, id, message);
        //             const chatList = Repository.getChatListByRoomId(room.id)
        //             Socket.io.emit("message", {
        //                 member1,
        //                 member2,
        //                 chatList
        //             });
        //         }
        //     });
        // });

    }
}

export default StompClient;
