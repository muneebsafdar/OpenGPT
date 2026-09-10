import proxy from 'express-http-proxy';

export const handleProxyWithUserId = (target) => {

    console.log("hellp")
    return proxy(target, {
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.user) {
                proxyReqOpts.headers['x-user-id'] = srcReq.user.userId
            }
            return proxyReqOpts;
        }
    })
}