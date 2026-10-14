/* Decision layer on top of analyze.mjs output: machine class -> final class -> migration action/stage.
 * Manual adjudications are listed explicitly (with the reason) so nothing is hidden in the numbers. */
export const ADJUDICATIONS = {
  'form-controls-r9.css:37|entity-dialog': {to: 'Keep', why: 'analysis says Partial only because user-dialog-r8:32 does not set `margin:0`/`accent-color`. That is deliberate: its comment says "retain the browser\'s input box and hit area" (the UA range keeps its 2px margin). Removing the clause would shift the hit box by 2px in the user dialog -> keep the exclusion.'}
};
/** @returns {{finalClass, action, stage, adjudicated?, note?}}  action: remove | keep ; stage: 2 = no-op cleanup, 3 = visible change */
export function decide(rule, K, c) {
  const adj = ADJUDICATIONS[`${rule.id}|${K}`];
  const finalClass = adj ? adj.to : c.class;
  let action = 'remove', stage = 3;
  if (finalClass === 'Keep') { action = 'keep'; stage = null; }
  else if (K === 'settings-tabs') stage = 2;           // dead clause: matches nothing today
  else if (c.vacuous) stage = 2;                       // clause can never fire in the real DOM (scope / portal)
  return {finalClass, machineClass: c.class, action, stage, adjudicated: adj ? adj.why : undefined};
}
