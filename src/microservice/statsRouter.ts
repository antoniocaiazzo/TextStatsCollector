import Router from 'koa-router';
import Koa from 'koa';
import { collectStatsFromSource } from '../app';

const routerOpts: Router.IRouterOptions = {
    prefix: '/stats',
};

const statsRouter: Router = new Router(routerOpts);

statsRouter.get('/', async (ctx: Koa.Context) => {
    const uri: any = ctx.query.uri;
    if (!uri || uri instanceof Array) {
        ctx.throw(400, 'Please provide a "uri" query parameter with a single string.');
    }
    try {
        ctx.body = await collectStatsFromSource(uri);
    } catch (error) {
        ctx.throw(404);
    }
});

export default statsRouter;
