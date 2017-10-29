const Telegraf = require('telegraf'),
  LocalSession = require('telegraf-session-local')

const { Markup, reply } = require('telegraf')
const commandParts = require('telegraf-command-parts');
const TelegrafFlow = require('telegraf-flow')
const { Scene, enter, leave } = TelegrafFlow
const TelegrafWit = require('telegraf-wit')
require('shelljs/global');
import database from './database';
import {TEST_MP3,STORAGE_DIR,BOT_TOKEN} from './constants';


import helpCommand from './commands/help';
import tracksCommand from './commands/tracks';
import giveAllCommand from './commands/give_all';
import startCommand from './commands/start';
import trackCommand from './commands/track';
import getCommand from './commands/get';
import inlineSearch from './inline_search';
//import {sessionProperty, localSession} from './localSession';
import startupInfo from './utils/startup_info';
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


const app = new Telegraf(BOT_TOKEN);
app.use(Telegraf.memorySession());
app.use(flow.middleware())
app.use(commandParts());
app.use(Telegraf.log())


////////////////////////////////////////////////////////////////////////////////////////////////////////////////// For testing purposes
app.hears('hi', (ctx) => { 
  ctx.reply('Hey there!').then((f) => {
    messageIds.push(f);
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
function musicSearch(query = '', offset = 0, limit = 0) {}
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////



app.command('help', helpCommand)
app.command('greeter', enter('greeter'))
app.command('echo', enter('echo'))
app.command('start', startCommand)
app.command('track', trackCommand)

app.command('test', (ctx) => {
  ctx.replyWithAudio({source: './a.mp3'});
});

app.command('tracks', tracksCommand);
app.command('give_all', giveAllCommand);
app.command('get', getCommand);
app.on('inline_query', inlineSearch);
app.on('sticker', (ctx) => ctx.reply('👍'))


// Name of session property object in Telegraf Context (default: 'session')
export const sessionProperty = 'data'
export const localSession = new LocalSession({
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
app.use(localSession.middleware(sessionProperty));


console.log('sessionProperty',sessionProperty);
app.command('/stats', (ctx) => {
  console.log('ctx.data', ctx.data);
  let msg = `Using session object from [Telegraf Context](http://telegraf.js.org/context.html) (\`ctx\`), named \`${sessionProperty}\`\n`
     msg += `Database has \`${ctx[sessionProperty].counter}\` messages from @${ctx.from.username}`
  ctx.replyWithMarkdown(msg)
});
app.command('/remove', (ctx) => {
  ctx.replyWithMarkdown(`Removing session from database: \`${JSON.stringify(ctx[property])}\``)
  // Setting session to null, undefined or empty object/array will trigger removing it from database
  ctx[sessionProperty] = null
});
app.on('text', (ctx, next) => {
  ctx[sessionProperty].counter = ctx[sessionProperty].counter || 0
  ctx[sessionProperty].counter++
  // Writing message to Array `messages` into database which already has sessions Array
  ctx[sessionProperty + 'DB'].get('messages').push([ctx.message]).write()
  // `property`+'DB' is a name of property which contains lowdb instance (`dataDB`)
  return next()
})


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// TODO
const testMenu = Telegraf.Extra
  .markdown()
  .markup((m) => m.inlineKeyboard([
    m.callbackButton('Test button', 'test')
  ]))

const aboutMenu = Telegraf.Extra
  .markdown()
  .markup((m) => m.keyboard([
    m.callbackButton('⬅️ Back')
  ]).resize())


app.command('search', (ctx) => ctx.reply('👍'));
app.command('sync', (ctx) => ctx.reply('Sync profile'));
app.command('top', (ctx) => ctx.reply('👍'));
app.command('listen', (ctx) => ctx.reply('Gives you random music', Telegraf.Extra.markup(Markup.removeKeyboard()) ));
app.command('playlist', (ctx) => ctx.reply('Gives you random music', aboutMenu));
///////////////////////

app.command('onetime', ({ reply }) =>
  reply('One time keyboard', Markup
    .keyboard(['/simple', '/inline', '/pyramid'])
    .oneTime()
    .resize()
    .extra()
  )
)

app.command('custom', ({ reply }) => {
  return reply('Custom buttons keyboard', Markup
    .keyboard([
      ['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
      ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
      ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
    ])
    .oneTime()
    .resize()
    .extra()
  )
})

app.hears('🔍 Search', ctx => ctx.reply('Yay!'))
app.hears('📢 Ads', ctx => ctx.reply('Free hugs. Call now!'))

app.command('special', (ctx) => {
  return ctx.reply('Special buttons keyboard', Extra.markup((markup) => {
    return markup.resize()
      .keyboard([
        markup.contactRequestButton('Send contact'),
        markup.locationRequestButton('Send location')
      ])
  }))
})

app.command('pyramid', (ctx) => {
  return ctx.reply('Keyboard wrap', Extra.markup(
    Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
      wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2
    })
  ))
})

app.command('simple', (ctx) => {
  return ctx.replyWithHTML('<b>Coke</b> or <i>Pepsi?</i>', Extra.markup(
    Markup.keyboard(['Coke', 'Pepsi'])
  ))
})

app.command('inline', (ctx) => {
  return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', Extra.HTML().markup((m) =>
    m.inlineKeyboard([
      m.callbackButton('Coke', 'Coke'),
      m.callbackButton('Pepsi', 'Pepsi')
    ])))
})

app.command('random', (ctx) => {
  return ctx.reply('random example',
    Markup.inlineKeyboard([
      Markup.callbackButton('Coke', 'Coke'),
      Markup.callbackButton('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
      Markup.callbackButton('Pepsi', 'Pepsi')
    ]).extra()
  )
})

app.hears(/\/wrap (\d+)/, (ctx) => {
  return ctx.reply('Keyboard wrap', Extra.markup(
    Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
      columns: parseInt(ctx.match[1])
    })
  ))
})

app.action('Dr Pepper', (ctx, next) => {
  return ctx.reply('👍').then(next)
})

app.action(/.+/, (ctx) => {
  return ctx.answerCallbackQuery(`Oh, ${ctx.match[0]}! Great choise`)
})



// TBA //app.command('artists', (ctx) => ctx.reply('👍'));
// TBA //app.command('albums', (ctx) => ctx.reply('👍'));
// TBA //app.command('genres', (ctx) => ctx.reply('👍'));
// TBA //app.command('mood', (ctx) => ctx.reply('👍'));
//////////////////////////////////////////////////////////////////////////////
// TEMP WEB PAGE FOR PREVIEW RESULTS
///////////////////////////////////////////////////////////////////////////////


startupInfo(database);

app.startPolling()
