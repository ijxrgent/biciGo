//src/server.ts
import { App } from './config/index.js';

function main() {
    const app = new App();
    app.listen();
}

main();
