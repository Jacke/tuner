import {soundCloudMp3Get} from '../adapters/soundcloud';

export default (ctx) => {
  console.log(ctx.state, ctx.state.command);
  soundCloudMp3Get(ctx.state.args, ctx);
}