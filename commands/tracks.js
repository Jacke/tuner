export default (ctx) => {
  console.log(ctx);
  console.log('tracks', tracks);
  exec('ls '+STORAGE_DIR, function(status, output) {
  console.log('Exit status:', status);
  console.log('Program output:', output);
    ctx.reply(output);
  });
};