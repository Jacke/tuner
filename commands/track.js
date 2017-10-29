import {TEST_MP3,STORAGE_DIR,BOT_TOKEN} from '../constants';
const NodeID3 = require('node-id3')

export default (ctx) => {
  console.log('ctx.state.command', ctx.state.command);
  const name = ctx.state.args;
  let filePath = STORAGE_DIR+name+'.mp3'
  let file = filePath 
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
}