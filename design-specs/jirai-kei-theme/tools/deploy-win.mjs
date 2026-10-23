#!/usr/bin/env node
// 部署到 Windows 实机（只在用户要求部署时用）：构建 → 备份远端目录 → 上传四个文件 → 远端核对 SHA256。
// --dry-run 只构建并只读检查远端，不写入任何东西。
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {cli, die, buildTheme, mkTmp, sha256, fmtBytes} from './common.mjs';

const FILES = ['theme.css', 'theme.json', 'README.md', 'preview.webp'];
const {opts} = cli({
  usage: `用法：deploy-win.mjs --to <Windows 目录> [选项]
  例：deploy-win.mjs --to 'C:\\Users\\tangh\\Documents\\GitHub\\theme-preview\\jirai-kei-theme-refactor' --dry-run
远端已有该目录时，先整体复制为 <目录>.bak-<时间>，再覆盖四个文件：${FILES.join('、')}`,
  options: {
    '--to': {arg: '目录', desc: 'Windows 上的目标目录（绝对路径）'},
    '--from': {arg: '目录', desc: '已有的构建目录（含四个文件）；默认先隔离构建当前工作树'},
    '--host': {arg: '主机', desc: 'ssh 主机名', default: 'pc114514'},
    '--dry-run': {desc: '只构建、只读检查远端并列出计划，不写入'},
  },
});
if (!opts.to || !/^[A-Za-z]:[\\/]/.test(opts.to)) die('--to 必须是 Windows 绝对路径，如 C:\\Users\\...');
const to = opts.to.replace(/\//g, '\\').replace(/\\+$/, '');

const ps = (script) => {
  const enc = Buffer.from(`$ErrorActionPreference='Stop';$ProgressPreference='SilentlyContinue';[Console]::OutputEncoding=[Text.Encoding]::UTF8;${script}`, 'utf16le').toString('base64');
  const r = spawnSync('ssh', ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', opts.host, `powershell -NoProfile -NonInteractive -EncodedCommand ${enc}`], {encoding: 'utf8', maxBuffer: 16 << 20});
  if (r.status !== 0) throw new Error(`远端 PowerShell 失败（${r.status}）：${(r.stderr || r.stdout).trim().slice(-800)}`);
  return r.stdout.trim();
};
const q = (s) => `'${s.replace(/'/g, "''")}'`;

// 1. Local files.
const from = opts.from ? path.resolve(opts.from) : buildTheme(mkTmp('jk-deploy-')).dir;
const local = {};
for (const f of FILES) {
  const p = path.join(from, f);
  if (!fs.existsSync(p)) die(`缺少 ${p}`);
  const b = fs.readFileSync(p);
  local[f] = {path: p, bytes: b.length, sha256: sha256(b).toUpperCase()};
}
console.log(`本地（${from}）：`);
for (const f of FILES) console.log(`  ${f.padEnd(13)} ${fmtBytes(local[f].bytes).padStart(13)}  ${local[f].sha256.slice(0, 16)}…`);

// 2. Remote state (read-only).
const state = JSON.parse(ps(`$d=${q(to)};$o=@{exists=(Test-Path -LiteralPath $d -PathType Container);files=@{}};if($o.exists){foreach($f in @(${FILES.map(q).join(',')})){$p=Join-Path $d $f;if(Test-Path -LiteralPath $p){$o.files[$f]=(Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash}}};$o|ConvertTo-Json -Compress`) || '{}');
const backup = `${to}.bak-${new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15)}`;
console.log(`\n远端 ${opts.host}:${to}`);
if (!state.exists) console.log('  目录不存在，将新建（无需备份）');
else for (const f of FILES) console.log(`  ${f.padEnd(13)} ${state.files?.[f] ? (state.files[f] === local[f].sha256 ? '与本地相同' : '将被覆盖') : '不存在，将新增'}`);
console.log(`\n计划：${state.exists ? `复制备份到 ${backup} → ` : '新建目录 → '}上传 ${FILES.length} 个文件 → 远端核对 SHA256`);
if (opts['dry-run']) { console.log('\n（--dry-run：未写入任何东西）'); process.exit(0); }

// 3. Backup, upload, verify.
if (state.exists) { ps(`Copy-Item -LiteralPath ${q(to)} -Destination ${q(backup)} -Recurse`); console.log(`已备份：${backup}`); }
else ps(`New-Item -ItemType Directory -Force -Path ${q(to)} | Out-Null`);
const remoteDir = to.replace(/\\/g, '/');
for (const f of FILES) {
  const r = spawnSync('scp', ['-q', '-o', 'BatchMode=yes', local[f].path, `${opts.host}:${remoteDir}/${f}`], {encoding: 'utf8'});
  if (r.status !== 0) die(`上传 ${f} 失败：${r.stderr.trim()}`, 1);
}
const hashes = JSON.parse(ps(`$d=${q(to)};$h=@{};foreach($f in @(${FILES.map(q).join(',')})){$h[$f]=(Get-FileHash -LiteralPath (Join-Path $d $f) -Algorithm SHA256).Hash};$h|ConvertTo-Json -Compress`));
let ok = true;
for (const f of FILES) { const same = hashes[f] === local[f].sha256; ok &&= same; console.log(`  ${same ? '✓' : '✗'} ${f}`); }
console.log(ok ? `\n部署完成：${to}` : '\n⚠ 远端哈希不一致');
process.exit(ok ? 0 : 1);
