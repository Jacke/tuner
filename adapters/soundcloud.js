import {TEST_MP3,STORAGE_DIR,BOT_TOKEN} from '../constants';

export const soundCloudMp3Get = (query = '', ctx, offset, limit) => {
  console.log('track_url'+query);
  let savePath = query.replace('https://soundcloud.com/','').replace('/','_');
  let command = `scdl --path ${STORAGE_DIR}${savePath} -c -l ${query}`
  console.log('command', command)
  exec('mkdir -p '+STORAGE_DIR+savePath, (stat, ou) => {
    exec(command, function(status, output) {
    console.log('Exit status:', status);
    console.log('Program output:', output);

      if (status == '0'){
        let track_name = output.replace('"','').replace('"\n','');
        //let title = track_name.split(' - ')[1];
        //let artist = track_name.split(' - ')[0];
        exec(`mv ${STORAGE_DIR}${savePath}/* ${STORAGE_DIR}${savePath}/a.mp3`, (stat, pathout) => {

        let filePath = `${STORAGE_DIR}${savePath}/${pathout}a.mp3`
        console.log('pathout', pathout);
        console.log('filePath', filePath);
        console.log('respond with', filePath);
        ctx.replyWithAudio({source: filePath}).then((p) => {
          console.log('promise', p);
        })
          return {status: true, filePath: filePath}
        });

      } else {
        ctx.reply('Error');
      }

    });
  })
}