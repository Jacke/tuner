export default (ctx) => {
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
}