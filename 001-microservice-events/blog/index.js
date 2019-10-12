const app = require('express')();
const amqp = require('amqplib/callback_api');

let currentStat = '';

app.get('/', (req, res) => {
  res.send(currentStat);
});

const connect = function() {
  amqp.connect(
    'amqp://rabbitmq',
    function(err, conn) {
      if (!err) {
        conn.createChannel(function(err, ch) {
          const q = 'stats';
          ch.assertQueue(q, { durable: false });
          ch.consume(q, function(msg) {
            currentStat = msg.content.toString();
          });
        });
      } else {
        console.log(err);
      }
    }
  );
};
setTimeout(connect, 6000);

app.listen(80, () => console.log('Server running'));
