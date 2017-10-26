export default (ctx) => {
  console.log(ctx);
  exec('ls '+STORAGE_DIR, function(status, output) {
  console.log('Exit status:', status);
  console.log('Program output:', output);
    const tracks = output.match(/[^\r\n]+/g);
    tracks.forEach((name) => {
      console.log('track'+name)
      ctx.replyWithAudio({source: 'storage/mp3/'+name}).then((f) => {
        tracks.push(f);
      });      
    })
  });
}