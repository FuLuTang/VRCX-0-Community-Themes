import fs from 'node:fs/promises';
const p='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css';
let s=await fs.readFile(p,'utf8');

// ═══════════════════════════════════════════════════════════════════════════
// RETIRED — Step 1 of the CSS refactor, do not run.
//
// This script used to be the only home of three sections. It works by slicing the
// artifact from the `portal-button-roles-b073-b100` marker to EOF, rewriting that
// tail in place, and re-appending an `auth-button-feedback` block. Net effect: the
// artifact contained sections that NO source file and NO build step produced, so
// `node build-runtime.mjs` silently emitted a theme.css 8345 bytes short (42 rules
// missing) while reporting success.
//
// Those three sections now live in runtime/*.css and are wired into the `parts`
// array of build-runtime.mjs, which reproduces the artifact byte-for-byte
// (sha256 6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260).
//
// RUNNING THIS NOW WOULD CORRUPT THE ARTIFACT: the guard below fires because the
// sections are present; without it, the script would append a SECOND
// auth-button-feedback block and push the file against the 1 MiB cap.
//
// Kept only for provenance — the selector rewrites it documents (dropping
// `:not([aria-disabled="true"])` in favour of `:not([data-disabled])`, partitioning
// entity/owner dialogs out of portal button states) are why those sections read the
// way they do. To recover them onto a fresh artifact use tools/extract-shadow-sections.mjs.
// ═══════════════════════════════════════════════════════════════════════════
if(s.includes('/* SECTION auth-button-feedback')){
  console.error('REFUSING TO RUN: the artifact already contains the shadow sections.');
  console.error('This patch script is retired (Step 1). The sections now live in runtime/*.css');
  console.error('and are emitted by build-runtime.mjs; re-running this here would duplicate');
  console.error('auth-button-feedback and corrupt the artifact.');
  process.exit(1);
}

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
