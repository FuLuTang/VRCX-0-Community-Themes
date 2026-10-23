// Shared by the comparison previews: rebuilds an element captured from the baseline fixtures
// (extract-preview-contexts.mjs) inside its real ancestors, with each ancestor's other children
// present as hidden skeletons, so the theme's container, :has() and sibling rules hit the preview
// exactly as they hit the app. Structure only: every visible word comes from fictional labels.
import React from 'react';
import {icons} from 'lucide-react';

export type Node = {tag: string; attrs: Record<string, string>; children?: Node[]};
export type ChainNode = Node & {before: Node[]; after: Node[]};
export type Context = {id: string; fixture: string; count: number; chain: ChainNode[]; element: Node; inherit: Record<string, string>; size?: [number, number]; revealed?: boolean};

const pascal = (s: string) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
const camel = (s: string) => (s.startsWith('--') ? s : s.replace(/^-webkit-/, 'Webkit-').replace(/-([a-z])/g, (_, c) => c.toUpperCase()));
const parseStyle = (s: string) => Object.fromEntries(s.split(';').map((d) => d.split(/:(.*)/s)).filter((d) => d[0]?.trim() && d[1] !== undefined).map(([k, v]) => [camel(k.trim()), v.trim()]));
const SVG_SKIP = /^(xmlns|width|height|viewBox|fill|stroke|stroke-width|stroke-linecap|stroke-linejoin)$/;
export const props = (attrs: Record<string, string>, svg = false) => {
  const p: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(attrs)) {
    if (svg && SVG_SKIP.test(k)) continue;
    if (k === 'class') p.className = v;
    else if (k === 'style') p.style = parseStyle(v);
    else if (k === 'for') p.htmlFor = v;
    else if (k === 'tabindex') p.tabIndex = Number(v);
    else if (k === 'readonly') p.readOnly = true;
    else if (k === 'disabled' || k === 'hidden' || k === 'checked') p[k] = true;
    else p[k] = v;
  }
  return p;
};
function Icon({attrs}: {attrs: Record<string, string>}) {
  const names = (attrs.class || '').split(/\s+/).filter((c) => c.startsWith('lucide-')).map((c) => pascal(c.slice(7)));
  const Found = names.map((n) => (icons as Record<string, React.ComponentType<Record<string, unknown>>>)[n]).find(Boolean) || icons.Circle;
  return <Found {...props(attrs, true)} />;
}
// Leaf text slots get the next fictional label; status dots and avatar frames stay empty.
const isTextLeaf = (n: Node) => ['span', 'kbd', 'p', 'h2', 'h3', 'label', 'button', 'a'].includes(n.tag) && !n.children?.length && !/(^|\s)(size-|rounded-full|sr-only)/.test(n.attrs.class || '');
const VOID = new Set(['img', 'input', 'br', 'hr']);

function Inner({n, labels}: {n: Node; labels?: string[]}): React.ReactElement {
  if (n.tag === 'svg') return <Icon attrs={n.attrs} />;
  if (VOID.has(n.tag)) return React.createElement(n.tag, {...props(n.attrs), ...(n.tag === 'img' ? {alt: ''} : {}), ...(n.tag === 'input' ? {readOnly: true} : {})});
  const kids = n.children?.length ? n.children.map((c, i) => <Inner key={i} n={c} labels={labels} />) : labels && isTextLeaf(n) ? labels.shift() ?? null : null;
  return React.createElement(n.tag, props(n.attrs), kids);
}
// Off-path siblings: present for selector matching, never shown.
function Skeleton({n}: {n: Node}): React.ReactElement {
  const tag = n.tag;
  const p = {...props(n.attrs, tag === 'svg'), 'data-jk-skeleton': ''};
  if (VOID.has(tag)) return React.createElement(tag, {...p, ...(tag === 'img' ? {alt: ''} : {}), ...(tag === 'input' ? {readOnly: true} : {})});
  return React.createElement(tag, p, ...(n.children || []).map((c, i) => <Skeleton key={i} n={c} />));
}

/** Renders `ctx.chain` with hidden sibling skeletons, then `leaf` (or the captured element) on the path. */
export function Replay({ctx, labels = [], lead, text, disabled, leaf}: {
  ctx: Context; labels?: string[]; lead?: string; text?: string; disabled?: boolean; leaf?: React.ReactNode;
}) {
  const queue = [...labels];
  const e = ctx.element;
  const own = props(e.attrs);
  own['data-jk-target'] = ''; // preview marker for check-preview-fidelity.mjs; no theme rule uses it
  // Same box as in the fixture (the flattened ancestors would otherwise stretch size-full / aspect-square targets).
  if (ctx.size && !e.children?.length) own.style = {...(own.style as object), width: ctx.size[0] + 'px', height: ctx.size[1] + 'px', flex: 'none'};
  if (disabled) Object.assign(own, {disabled: true, 'data-disabled': ''});
  const body = leaf ?? React.createElement(e.tag, own, lead ?? null, ...(e.children || []).map((c, i) => <Inner key={i} n={c} labels={queue} />), text ?? null);
  const tree = ctx.chain.reduceRight<React.ReactNode>((inner, n) => React.createElement(n.tag, props(n.attrs),
    ...n.before.map((s, i) => <Skeleton key={'b' + i} n={s} />), inner, ...n.after.map((s, i) => <Skeleton key={'a' + i} n={s} />)), body);
  // The wrapper stands in for <body>: it carries the fixture body's inherited text styles.
  return <div className="demo-body" {...(ctx.revealed === false ? {'data-jk-reveal': ''} : {})} style={parseStyle(Object.entries(ctx.inherit || {}).map(([k, v]) => `${k}:${v}`).join(';'))}>{tree}</div>;
}

/** Same as Replay, but the captured toggle group is interactive: clicks flip aria-pressed / data-pressed. */
export function ReplayGroup({ctx, labels = [], multiple = false, disabledLast}: {ctx: Context; labels?: string[]; multiple?: boolean; disabledLast?: boolean}) {
  const items = (ctx.element.children || []).filter((c) => c.tag === 'button');
  const [on, setOn] = React.useState<boolean[]>(items.map((b) => b.attrs['aria-pressed'] === 'true'));
  const queue = [...labels];
  let k = -1;
  const kids = (ctx.element.children || []).map((c, i) => {
    if (c.tag !== 'button') return <Inner key={i} n={c} />;
    const idx = ++k;
    const a: Record<string, string> = {...c.attrs, 'aria-pressed': String(on[idx])};
    delete a['data-pressed'];
    if (on[idx]) a['data-pressed'] = '';
    const p = props(a);
    if (disabledLast && idx === items.length - 1) Object.assign(p, {disabled: true, 'data-disabled': ''});
    p.onClick = () => setOn((s) => (multiple ? s.map((v, j) => (j === idx ? !v : v)) : s.map((_, j) => j === idx)));
    const label = queue.shift();
    const inner = (c.children || []).map((g, j) => <Inner key={j} n={g} />);
    return React.createElement('button', {key: i, ...p}, ...inner, inner.length ? null : label ?? null);
  });
  return <Replay ctx={ctx} leaf={React.createElement(ctx.element.tag, {...props(ctx.element.attrs), 'data-jk-target': ''}, ...kids)} />;
}
