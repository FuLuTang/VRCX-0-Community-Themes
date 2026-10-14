import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1240,height:640}});
await p.goto('file://'+new URL('./concepts.html',import.meta.url).pathname);await p.evaluate(()=>document.fonts.ready);
await p.screenshot({path:new URL('./concepts.png',import.meta.url).pathname,fullPage:true});await b.close();
