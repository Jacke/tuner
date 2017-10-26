import {TEST_MP3,STORAGE_DIR,BOT_TOKEN} from '../constants';
var messageIds = [];
var tracks = [];

export default (ctx) => {
  console.log(ctx);
  console.log('tracks', tracks);
  exec('ls '+STORAGE_DIR, function(status, output) {
  console.log('Exit status:', status);
  console.log('Program output:', output);
    ctx.reply('Tracks:'+output);
  });
};