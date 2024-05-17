#! /usr/bin/env -S node --no-warnings

import { server } from '../src';

const PORT: number = Number(process.env.PORT) || 3000;

server.listen(PORT, () => {
    console.log(`🚀 Server is running on port http://localhost:${PORT}/`);
});
