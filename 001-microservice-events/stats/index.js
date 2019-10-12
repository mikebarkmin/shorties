const amqp = require('amqplib/callback_api');
let amqpConn = null;

let count = 0;

const connect = function() {
  amqp.connect(
    'amqp://rabbitmq',
    function(err, conn) {
      if (err) {
        console.error('[AMQP]', err.message);
        return setTimeout(connect, 1000);
      }
      conn.on('error', function(err) {
        if (err.message !== 'Connection closing') {
          console.error('[AMQP] conn error', err.message);
        }
      });
      conn.on('close', function() {
        console.error('[AMQP] reconnecting');
        return setTimeout(connect, 1000);
      });
      console.log('[AMQP] connected');
      amqpConn = conn;
      whenConnected();
    }
  );
};

const closeOnError = function(err) {
  if (!err) return false;
  console.error('[AMQP] error', err);
  amqpConn.close();
  return true;
};

const whenConnected = function() {
  amqpConn.createChannel(function(err, ch) {
    if (closeOnError(err)) return;

    const q = 'stats';

    ch.assertQueue(q, { durable: false });
    ch.sendToQueue(q, new Buffer(`Stats ${count}`));
    count++;
  });
};

connect();
