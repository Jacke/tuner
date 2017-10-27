const Telegraf = require('telegraf'),
  LocalSession = require('telegraf-session-local')

const { Markup, reply } = require('telegraf')
const commandParts = require('telegraf-command-parts');
const TelegrafFlow = require('telegraf-flow')
const { Scene, enter, leave } = TelegrafFlow
const TelegrafWit = require('telegraf-wit')
const NodeID3 = require('node-id3')
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
app.command('test', (ctx) => ctx.replyWithAudio({source: './a.mp3'}, {title: 'title', performer: 'artist'} ))
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

// TBA //app.command('artists', (ctx) => ctx.reply('👍'));
// TBA //app.command('albums', (ctx) => ctx.reply('👍'));
// TBA //app.command('genres', (ctx) => ctx.reply('👍'));
// TBA //app.command('mood', (ctx) => ctx.reply('👍'));
//////////////////////////////////////////////////////////////////////////////
// TEMP WEB PAGE FOR PREVIEW RESULTS
///////////////////////////////////////////////////////////////////////////////


startupInfo(database);

app.startPolling()
