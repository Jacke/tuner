const Telegraf = require('telegraf'),
  LocalSession = require('telegraf-session-local')

const { Markup, reply } = require('telegraf')
const commandParts = require('telegraf-command-parts');
const TelegrafFlow = require('telegraf-flow')
const { Scene, enter, leave } = TelegrafFlow
const TelegrafWit = require('telegraf-wit')
const NodeID3 = require('node-id3')
const TEST_MP3 = 'CQADAgAD8QADVZ9RS8gSYXVWe1PfAg';

require('shelljs/global');

const BOT_TOKEN = '420540547:AAH4J80B3iGA_BGcGYmj0yOVPCFgWRNQKAA'

var messageIds = [];
var tracks = [];



const app = new Telegraf(BOT_TOKEN);
app.use(Telegraf.memorySession());

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
app.command('help', (ctx) => ctx.reply('Help message'))
app.command('greeter', enter('greeter'))
app.command('echo', enter('echo'))





app.use(flow.middleware())
app.use(commandParts());

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
  ctx.reply('/tracks, /track [название], get [soundcloud url], /give_all ').then((f) => {
  });

});
app.hears(/track (.+)/ig,(ctx) => {
  console.log('ctx.state.command', ctx.state.command);
  const name = ctx.match[1];
  let filePath = 'mp3/'+name+'.mp3'
  let file = filePath //|| new Buffer("Some Buffer of a (mp3) file")

  //console.log('name'+name);
  try {
    let tags = NodeID3.read(file)
    console.log('tags', tags)
    console.log('tags', tags);
    let title = tags.title
    let artist = tags.artist
    ctx.replyWithAudio({source: filePath}, {title: title, performer: artist}).then((f) => {
        messageIds.push(f);
        console.log(messageIds);
    });
  } catch(e) {
    console.log(e)
  } finally {
    ctx.reply(`Track ${name} Not found`);
  }
});



const replyOptions = Markup.inlineKeyboard([
  Markup.urlButton('❤️', 'http://telegraf.js.org'),
  Markup.callbackButton('Delete', 'delete')
]).extra()

app.action('delete', (ctx) => {
  console.log(ctx);
  ctx.deleteMessage()
})

app.command('/tracks', (ctx) => {
  console.log(ctx);
  console.log('tracks', tracks);
  exec('ls ./mp3/', function(status, output) {
  console.log('Exit status:', status);
  console.log('Program output:', output);
    ctx.reply(output);
  });
});

app.command('/give_all',(ctx) => {
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


app.command('/get',(ctx) => {
  console.log(ctx.state, ctx.state.command);
  
  //const track_url = ctx.match[1];
  //mp3Get(track_url, ctx);
});



function mp3Get(query = '', ctx, offset, limit) {
  console.log('track_url'+query);
  let savePath = query.replace('https://soundcloud.com/','').replace('/','_');
  console.log('savePath', savePath);
  exec('mkdir -p ./mp3/'+savePath, (stat, ou) => {
    exec('scdl --path ./mp3/'+savePath+' -c -l '+query, function(status, output) {
    console.log('Exit status:', status);
    console.log('Program output:', output);

      //if (status == '0'){
        let track_name = output.replace('"','').replace('"\n','');
        //let title = track_name.split(' - ')[1];
        //let artist = track_name.split(' - ')[0];
        exec('ls ./mp3/'+savePath, (stat, pathout) => {
        let filePath = `./mp3/${savePath}/${pathout}`.replace(' ','');
          console.log('pathout', pathout);
          console.log('filePath', filePath);
        //  Create a ID3-Frame buffer from passed tags
        //  Synchronous
        //let ID3FrameBuffer = NodeID3.create(tags)   //  Returns ID3-Frame buffer
        //  Write ID3-Frame into (.mp3) file
        //let success = NodeID3.write(tags, filePath) //  Returns true/false
  //      console.log('tag', success);
  //      NodeID3.write(tags, filePath, function(err) { 
  //        ctx.replyWithAudio({source: filePath})
  //        console.log('tags err', err) });
          ctx.replyWithAudio({source: filePath})
          return {status: true, filePath: filePath}
        })
    });
  })
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
        id: TEST_MP3,
        audio_file_id: TEST_MP3,
        duration: 1221,
        file_size: 3211,
        title: 'rockstar (feat. 21 Savage) 2',
      }, 
      ]).then((fz)=> console.log(fz))//, {next_offset: offset + 30})

  ctx.telegram.getFile(TEST_MP3).then((fileData) => {
    ctx.telegram.getFileLink(TEST_MP3).then((fileLink) => {
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











// Name of session property object in Telegraf Context (default: 'session')
const property = 'data'

const localSession = new LocalSession({
  // Database name/path, where sessions will be located (default: 'sessions.json')
  database: 'example_db.json',
  // Name of session property object in Telegraf Context (default: 'session')
  property: 'session',
  // Type of lowdb storage (default: 'storagefileAsync')
  storage: LocalSession.storagefileAsync,
  // Format of storage/database (default: JSON.stringify / JSON.parse)
  format: {
    serialize: (obj) => JSON.stringify(obj, null, 2), // null & 2 for pretty-formatted JSON
    deserialize: (str) => JSON.parse(str),
  },
  // We will use `messages` array in our database to store user messages using exported lowdb instance from LocalSession via Telegraf Context
  state: { messages: [] }
})

// Telegraf will use `telegraf-session-local` configured above middleware with overrided `property` name
app.use(localSession.middleware(property))

app.on('text', (ctx, next) => {
  ctx[property].counter = ctx[property].counter || 0
  ctx[property].counter++
  // Writing message to Array `messages` into database which already has sessions Array
  ctx[property + 'DB'].get('messages').push([ctx.message]).write()
  // `property`+'DB' is a name of property which contains lowdb instance (`dataDB`)

  return next()
})

app.command('/stats', (ctx) => {
  let msg = `Using session object from [Telegraf Context](http://telegraf.js.org/context.html) (\`ctx\`), named \`${property}\`\n`
     msg += `Database has \`${ctx[property].counter}\` messages from @${ctx.from.username}`
  ctx.replyWithMarkdown(msg)
})
app.command('/remove', (ctx) => {
  ctx.replyWithMarkdown(`Removing session from database: \`${JSON.stringify(ctx[property])}\``)
  // Setting session to null, undefined or empty object/array will trigger removing it from database
  ctx[property] = null
})

















app.startPolling()
//const Telegraf = require('telegraf')



/*
const bot = new Telegraf(BOT_TOKEN)
bot.command('/oldschool', (ctx) => ctx.reply('Hello'))
bot.command('/modern', ({ reply }) => reply('Yo'))
bot.command('/hipster', reply('λ'))
bot.startPolling()
*/
