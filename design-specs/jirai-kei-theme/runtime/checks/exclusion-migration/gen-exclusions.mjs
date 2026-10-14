/* exclusion-migration / gen-exclusions.mjs — turns the analyze.mjs snapshot + decide.mjs adjudications into the two
 * deliverables that describe what happened to every context exclusion:
 *
 *   node gen-exclusions.mjs [--analysis exclusions.before.json] [--out .]
 *
 * writes exclusions.json (machine record: one entry per rule x context) and exclusions.md (per-file review table).
 * It performs no rendering and touches no production CSS: it is a pure projection of the analysis. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {decide} from './decide.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const ANALYSIS = path.resolve(opt('analysis', path.join(here, 'exclusions.before.json')));
const OUT = path.resolve(opt('out', here));

const CTX_LABEL = {'login-page': 'login-page', 'entity-dialog': 'entity-dialog', 'settings-tabs': 'settings rail'};
const KIND_ORDER = ['login-page', 'entity-dialog', 'settings-tabs'];

const analysis = JSON.parse(fs.readFileSync(ANALYSIS, 'utf8'));
const entries = [];
for (const r of analysis.rules) {
  for (const K of KIND_ORDER) {
    const c = r.contexts[K];
    if (!c) continue;
    const d = decide(r, K, c);
    entries.push({
      id: r.id, file: r.file, line: r.line, endLine: r.endLine, context: K, contextLabel: CTX_LABEL[K],
      subject: (r.subject || '').replace(/\s+/g, ' ').trim(),
      otherExclusions: r.otherExclusions || [],
      props: r.props || [],
      class: d.finalClass, machineClass: d.machineClass, action: d.action, stage: d.stage,
      adjudicated: !!d.adjudicated,
      vacuous: !!c.vacuous,
      releasedElements: c.releasedElements,
      reach: c.reach,
      byPrim: c.byPrim,
      alternatives: c.alternatives || [],
      uncoveredProps: c.uncoveredProps || [],
      usedBySites: c.usedBySites || [],
      why: c.why,
      adjudication: d.adjudicated ? d.why : undefined
    });
  }
}

const summary = {
  rulesParsed: analysis.meta.rulesParsed,
  exclusionRules: analysis.meta.exclusionRules,
  ruleContextPairs: entries.length,
  byAction: {}, byClass: {}, byContext: {}
};
for (const e of entries) {
  const a = e.action === 'keep' ? 'keep (clause preserved)' : e.stage === 2 ? 'remove, no visible effect (stage 2)' : 'remove, visible release (stage 3)';
  summary.byAction[a] = (summary.byAction[a] || 0) + 1;
  summary.byClass[e.class] = (summary.byClass[e.class] || 0) + 1;
  const b = summary.byContext[e.context] || (summary.byContext[e.context] = {total: 0, Keep: 0, Drop: 0, Partial: 0, vacuous: 0});
  b.total++; b[e.class]++; if (e.vacuous) b.vacuous++;
}

fs.writeFileSync(path.join(OUT, 'exclusions.json'), JSON.stringify({
  meta: {
    generated: new Date().toISOString(),
    analysis: path.relative(OUT, ANALYSIS) || ANALYSIS,
    analysisTag: analysis.meta.tag,
    theme: analysis.meta.theme,
    runtime: analysis.meta.runtime,
    appSource: analysis.meta.src,
    semantics: {
      Keep: 'a context-specific rule already gives this subtree a deliberately different look; the :not(...) clause is PRESERVED.',
      'Drop/stage3': 'the released surface previously fell back to the shadcn / browser default and now takes the shared pixel rule; the clause is REMOVED (this is the intended gap fix).',
      'Drop/stage2': 'the clause can never fire in the real DOM (vacuous: body-portalled popups are never nested in the dialog popup) or is a dead hook; the clause is KEPT because removing it changes nothing at runtime while the layer fixtures still assert on it.',
      Partial: 'replacement rules cover only part of the released properties / states; treated like Keep unless adjudicated otherwise.'
    }
  },
  summary, entries
}, null, 1) + '\n');

/* ---------------- markdown ---------------- */
const esc = (s) => String(s == null ? '' : s).replace(/\|/g, '\\|');
const L = [];
L.push('# 排除规则迁移清单 / context-exclusion migration ledger', '');
L.push(`生成时间：${new Date().toISOString()}  `);
L.push(`分析快照：\`${path.basename(ANALYSIS)}\`（tag=\`${analysis.meta.tag}\`，解析 ${analysis.meta.rulesParsed} 条规则，其中 ${analysis.meta.exclusionRules} 条带上下文排除）  `);
L.push(`基线主题：\`${analysis.meta.theme}\`  `);
L.push(`应用源码：\`${analysis.meta.src}\``, '');
L.push('本表逐条记录 `规则 × 上下文` 三元组的裁决：**保留（Keep，含人工裁定）**、**释放**（Drop）。', '');
L.push('## 1. 汇总', '');
L.push('| 类别 | 条数 |', '| --- | ---: |');
for (const [k, v] of Object.entries(summary.byClass)) L.push(`| class = ${k} | ${v} |`);
for (const [k, v] of Object.entries(summary.byAction)) L.push(`| ${k} | ${v} |`);
L.push(`| **合计（规则×上下文）** | **${summary.ruleContextPairs}** |`, '');
L.push('| 上下文 | 合计 | Keep | Drop | Partial | 其中 vacuous |', '| --- | ---: | ---: | ---: | ---: | ---: |');
for (const K of KIND_ORDER) { const b = summary.byContext[K]; if (b) L.push(`| ${CTX_LABEL[K]} | ${b.total} | ${b.Keep} | ${b.Drop} | ${b.Partial} | ${b.vacuous} |`); }
L.push('');
L.push('## 2. 逐文件清单', '');
const byFile = {};
for (const e of entries) (byFile[e.file] || (byFile[e.file] = [])).push(e);
for (const [file, list] of Object.entries(byFile).sort((a, b) => a[0].localeCompare(b[0]))) {
  L.push(`### \`${file}\``, '');
  L.push('| 行 | 上下文 | 主体 | 裁决 | 替代规则 / 说明 |', '| ---: | --- | --- | --- | --- |');
  for (const e of list.sort((a, b) => a.line - b.line || KIND_ORDER.indexOf(a.context) - KIND_ORDER.indexOf(b.context))) {
    const verdict = e.action === 'keep'
      ? `**Keep**${e.adjudicated ? '（人工裁定）' : ''}`
      : `Drop → stage ${e.stage}${e.vacuous ? ' / vacuous' : ''}`;
    let note;
    if (e.action === 'keep') note = e.adjudication ? `人工裁定：${e.adjudication}` : `替代规则：${e.alternatives.join('、') || '—'}`;
    else if (e.stage === 2) note = `真实 DOM 不触发（reach real=${e.reach.real} latent=${e.reach.latent}）→ 保留子句，删除无可见变化`;
    else note = `释放 ${e.releasedElements} 个元素，通用规则接管（本条自身 ${e.file}:${e.line} 去掉排除后全局生效）`;
    L.push(`| ${e.line} | ${e.contextLabel} | \`${esc(e.subject).slice(0, 64)}\` | ${verdict} | ${esc(note).slice(0, 220)} |`);
  }
  L.push('');
}
L.push('## 3. 保留（Keep）逐条理由', '');
const keeps = entries.filter(e => e.action === 'keep');
for (const e of keeps) {
  L.push(`- **\`${e.id}\` × ${e.contextLabel}** — class=\`${e.class}\`${e.adjudicated ? '（人工裁定）' : ''}  `);
  L.push(`  主体 \`${esc(e.subject).slice(0, 90)}\`  `);
  L.push(`  替代规则：${e.alternatives.map(a => `\`${a}\``).join('、') || '—'}  `);
  L.push(`  未覆盖属性：${e.uncoveredProps.length ? e.uncoveredProps.map(p => '`' + p + '`').join('、') : '—'}  `);
  L.push(`  使用点：${e.usedBySites.length ? e.usedBySites.map(s => '`' + s + '`').join('、') : '—'}  `);
  L.push(`  理由：${e.why}${e.adjudication ? ' ｜ 人工裁定：' + e.adjudication : ''}`);
}
if (!keeps.length) L.push('（无）');
L.push('');
fs.writeFileSync(path.join(OUT, 'exclusions.md'), L.join('\n'));

console.log(JSON.stringify({out: OUT, pairs: entries.length, ...summary.byAction}, null, 1));
