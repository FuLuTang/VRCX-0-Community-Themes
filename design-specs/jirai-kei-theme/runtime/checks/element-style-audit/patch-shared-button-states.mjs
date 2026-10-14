import fs from 'node:fs/promises';
const p='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css';
let s=await fs.readFile(p,'utf8');
const i=s.indexOf('/* SECTION portal-button-roles-b073-b100 */');
let tail=s.slice(i).replaceAll(':not([aria-disabled="true"])',':not([aria-disabled="true"]):not([data-disabled])');
tail=tail.replace('& button[data-variant]:is(.h-auto.justify-start,','& button[data-variant]:not(.entity-dialog *,.owner-dialog *):is(.h-auto.justify-start,').replace('& button[data-ui-role="text-link"]{','& button[data-ui-role="text-link"]:not(.entity-dialog *,.owner-dialog *){').replace('& button:is([data-ui-role="disclosure"],','& button:not(.entity-dialog *,.owner-dialog *):is([data-ui-role="disclosure"],');
s=s.slice(0,i)+tail+`\n/* SECTION auth-button-feedback: retain login-r8 / privacy-lock-r96 paint. */
:where([data-vrcx-0-surface="login-page"],[data-vrcx-0-surface="privacy-lock"]) button[data-variant]{
  &:focus-visible{outline:2px solid #ff7fcf;outline-offset:2px}
  &:active:not(:disabled):not([aria-disabled="true"]):not([data-variant="link"]){translate:none;transform:translate(1px,1px);box-shadow:1px 1px #100b1e}
  &:is(:disabled,[aria-disabled="true"],[data-disabled]){transform:none;translate:none}
}
[data-vrcx-0-surface="login-page"] form>button[type="submit"][data-variant="default"]:active:not(:disabled){translate:none}
[data-vrcx-0-surface="privacy-lock"] button[data-variant="link"]{color:#d6b8ef;text-decoration:underline dotted #8f7fe0;text-underline-offset:4px;
  &:hover:not(:disabled){color:#ffb8e6;text-decoration-color:currentColor}
  &:active:not(:disabled){color:#fdf4ff;transform:none;translate:none}
}
`;
await fs.writeFile(p,s);console.log({bytes:Buffer.byteLength(s),headroom:1048576-Buffer.byteLength(s)});
