import Koa from 'koa';
import ratelimit from 'koa-ratelimit';
import statsRouter from './/statsRouter';

// in-memory DB for rate limiting middleware
const db = new Map();

const server: Koa = new Koa();

// generic error handling middleware (must be the first one defined)
server.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
        await next();
    } catch (error: any) {
        ctx.status = error.statusCode || error.status || 500;
        error.status = ctx.status;
        ctx.body = { error };
        ctx.app.emit('error', error, ctx);
    }
});

server.on('error', console.error);

server.use(
    ratelimit({
        driver: 'memory',
        db: db,
        duration: 60000,
        errorMessage: 'Rate Limit Exceeded',
        id: (ctx: Koa.Context) => ctx.ip,
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total',
        },
        max: 100,
        disableHeader: false,
    }),
);

// all other routes
server.use(statsRouter.routes());
server.use(statsRouter.allowedMethods());

export default server;
