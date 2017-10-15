const Telegraf = require('telegraf');
const { Markup } = require('telegraf')
const commandParts = require('telegraf-command-parts');
const TelegrafFlow = require('telegraf-flow')
const { Scene, enter, leave } = TelegrafFlow
const TelegrafWit = require('telegraf-wit')

require('shelljs/global');

const BOT_TOKEN = '420540547:AAH4J80B3iGA_BGcGYmj0yOVPCFgWRNQKAA'

var messageIds = [];
var tracks = [];



const app = new Telegraf(BOT_TOKEN);

app.command('start', ({ from, reply }) => {
  console.log('start', from)
  return reply('Привет! Давай вместе избавимся от ВК. напиши help чтобы получить инфу')
})
app.hears('hi', (ctx) => { 
  ctx.reply('Hey there!').then((f) => {
    messageIds.push(f);
  });

});


app.hears('help', (ctx) => { 
  ctx.reply('"all music", "track [название]", "get [soundcloud url]", "give all music" ').then((f) => {
  });

});
app.hears(/track (.+)/ig,(ctx) => {
  console.log('ctx.state.command',ctx.state.command);
  const name = ctx.match[1];
  //console.log('name'+name);
  ctx.replyWithAudio({source: 'mp3/'+name+'.mp3'}, {title: 'rockstar', performer: 'Post malone (feat 21 Savage)'}).then((f) => {
      messageIds.push(f);
      console.log(messageIds);
  });
});



const replyOptions = Markup.inlineKeyboard([
  Markup.urlButton('❤️', 'http://telegraf.js.org'),
  Markup.callbackButton('Delete', 'delete')
]).extra()

app.action('delete', (ctx) => {
  console.log(ctx);
  ctx.deleteMessage()
})

app.hears('all music',(ctx) => {
  console.log(ctx);
  console.log('tracks', tracks);
  exec('ls ./mp3/', function(status, output) {
  console.log('Exit status:', status);
  console.log('Program output:', output);
    ctx.reply(output);
  });
});

app.hears('give all music',(ctx) => {
  console.log(ctx);
  exec('ls ./mp3/', function(status, output) {
  console.log('Exit status:', status);
  console.log('Program output:', output);
    const tracks = output.match(/[^\r\n]+/g);
    tracks.forEach((name) => {
      console.log('track'+name)
      ctx.replyWithAudio({source: 'mp3/'+name}).then((f) => {
        tracks.push(f);
      });      
    })
  });
});


app.hears(/get (.+)/ig,(ctx) => {
  console.log(ctx);
  const track_url = ctx.match[1];
  ctx.reply (mp3Get(track_url) )
});



function mp3Get(query = '', offset, limit) {
  console.log('track_url'+query);
  exec('python download.py --id 82bdf4e0f06c7474515a6cc1bbe39a20 --track '+query, function(status, output) {
  console.log('Exit status:', status);
  console.log('Program output:', output);
    return 'Status: '+ status+' Output:' +output;
  });
}

function musicSearch(query = '', offset = 0, limit = 0) {

}

app.on('inline_query', (ctx) => {
  const offset = parseInt(ctx.inlineQuery.offset) || 0
  const tracks = musicSearch(ctx.inlineQuery.query, offset, 30);
  // CQADAgADLwEAAvILIEse_LpIrMAkbgI
  //ctx.telegram.getFileLink('CQADAgADLwEAAvILIEse_LpIrMAkbgI')
  
  const results = [].map((track) => ({
    type: 'audio',
    id: track.id,
    title: track.name,
    audio_url: track.preview_url
  }))

return ctx.answerInlineQuery([{
        type: 'audio',
        id: 'CQADAgADOwEAAvILIEsIYOVglR4IxwI',
        audio_file_id: 'CQADAgADOwEAAvILIEsIYOVglR4IxwI',
        duration: 1221,
        file_size: 3211,
        title: 'rockstar (feat. 21 Savage) 2',
      }, 
      ]).then((fz)=> console.log(fz))//, {next_offset: offset + 30})

  ctx.telegram.getFile('CQADAgADOwEAAvILIEsIYOVglR4IxwI').then((fileData) => {
    ctx.telegram.getFileLink('CQADAgADOwEAAvILIEsIYOVglR4IxwI').then((fileLink) => {
      console.log('fileData', fileData,fileLink);
      
    });
  });
})


app.hears('getChat', (ctx) => {
  ctx.getChat().then((t) => {
    console.log(t);
    ctx.reply(t.toString());

  });
});
app.hears('r', (ctx) => {
  messageIds.forEach((id) => {
    console.log(id.from.id, id.message_id);
    ctx.telegram.deleteMessage(id.chat.id, id.message_id).then((f,e) => {
      console.log(f,e);
    });
  });
});

app.on('sticker', (ctx) => ctx.reply('👍'))


const greeterScene = new Scene('greeter')
greeterScene.enter((ctx) => ctx.reply('Hi'))
greeterScene.leave((ctx) => ctx.reply('Buy'))
greeterScene.hears(/hi/gi, leave())
greeterScene.on('message', (ctx) => ctx.replyWithMarkdown('Send `hi`'))

// Echo scene
const echoScene = new Scene('echo')
echoScene.enter((ctx) => ctx.reply('echo scene'))
echoScene.leave((ctx) => ctx.reply('exiting echo scene'))
echoScene.command('back', leave())
echoScene.on('text', (ctx) => ctx.reply(ctx.message.text))
echoScene.on('message', (ctx) => ctx.reply('Only text messages please'))

const flow = new TelegrafFlow([greeterScene, echoScene], { ttl: 10 })
app.use(Telegraf.memorySession())
app.use(flow.middleware())
app.command('help', (ctx) => ctx.reply('Help message'))
app.command('greeter', enter('greeter'))
app.command('echo', enter('echo'))


app.use(commandParts());




app.startPolling()
//const Telegraf = require('telegraf')
const { reply } = Telegraf



/*
const bot = new Telegraf(BOT_TOKEN)
bot.command('/oldschool', (ctx) => ctx.reply('Hello'))
bot.command('/modern', ({ reply }) => reply('Yo'))
bot.command('/hipster', reply('λ'))
bot.startPolling()
*/
