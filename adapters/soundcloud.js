export const soundCloudMp3Get = (query = '', ctx, offset, limit) => {
  console.log('track_url'+query);
  let savePath = query.replace('https://soundcloud.com/','').replace('/','_');
  console.log('savePath', savePath);
  exec('mkdir -p '+STORAGE_DIR+savePath, (stat, ou) => {
    exec('scdl --path '+STORAGE_DIR+savePath+' -c -l '+query, function(status, output) {
    console.log('Exit status:', status);
    console.log('Program output:', output);

      //if (status == '0'){
        let track_name = output.replace('"','').replace('"\n','');
        //let title = track_name.split(' - ')[1];
        //let artist = track_name.split(' - ')[0];
        exec('ls '+STORAGE_DIR+savePath, (stat, pathout) => {
        let filePath = `${STORAGE_DIR}${savePath}/${pathout}`.replace(' ','');
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