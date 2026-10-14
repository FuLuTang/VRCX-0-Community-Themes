/* R4 settings-pixel: SSR source-evidence probe. Prints real primitive markup only.
   Not Windows acceptance. Read-only against the app checkout. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const app = '/home/fulutang/Documents/Github/VRCX-0-jirai';
const req = createRequire(app + '/package.json');
const React = req('react');
const {renderToStaticMarkup} = req('react-dom/server');
const {Switch: SwitchPrimitive} = req('@base-ui/react/switch');
const TG = req('@base-ui/react/toggle-group').ToggleGroup;
const TogglePrimitive = req('@base-ui/react/toggle').Toggle;
const {NumberField} = req('@base-ui/react/number-field');
const {Tabs} = req('@base-ui/react/tabs');
const {Collapsible} = req('@base-ui/react/collapsible');
const {MinusIcon, PlusIcon, ChevronDownIcon} = req('lucide-react');

const h = React.createElement;
const show = (name, el) => {
    const html = renderToStaticMarkup(el);
    return `\n===== ${name} =====\n${html.replace(/></g, '>\n<')}\n`;
};

const SW = 'peer group/switch focus-visible:border-ring focus-visible:ring-ring/50 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-[background-color,border-color,box-shadow,opacity] outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]';
const TH = 'bg-background dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground pointer-events-none block rounded-full ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 motion-reduce:transition-none';
const sw = (props, size = 'default') =>
    h(
        SwitchPrimitive.Root,
        {
            'data-slot': 'switch',
            'data-size': size,
            className: SW,
            ...props
        },
        h(SwitchPrimitive.Thumb, {'data-slot': 'switch-thumb', className: TH})
    );

let out = '';
out += show('switch checked default', sw({checked: true, onCheckedChange() {}}));
out += show('switch unchecked default', sw({checked: false, onCheckedChange() {}}));
out += show('switch disabled sm', sw({checked: true, disabled: true, onCheckedChange() {}}, 'sm'));

const TOG =
    "text-foreground hover:bg-accent focus-visible:ring-ring data-pressed:bg-input/64 data-pressed:text-accent-foreground relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border text-base font-medium whitespace-nowrap transition-shadow outline-none select-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)]";
const tgItem = (value, label) =>
    h(
        TogglePrimitive,
        {
            'data-slot': 'toggle',
            'data-variant': 'outline',
            'data-size': 'sm',
            value,
            className: TOG
        },
        label
    );
out += show(
    'toggle-group outline sm (SegmentedPreference)',
    h(
        TG,
        {'data-slot': 'toggle-group', 'data-variant': 'outline', 'data-size': 'sm', value: ['a']},
        [
            h(React.Fragment, {key: 'a'}, tgItem('a', '背景')),
            h('div', {
                key: 's1',
                'data-slot': 'separator',
                className: 'bg-input pointer-events-none relative before:absolute before:inset-0',
                role: 'separator'
            }),
            h(React.Fragment, {key: 'b'}, tgItem('b', '头像框'))
        ]
    )
);

out += show(
    'number-field group',
    h(
        NumberField.Root,
        {'data-slot': 'number-field', 'data-size': 'default', className: 'flex w-full flex-col items-start gap-2', value: 60},
        h(
            NumberField.Group,
            {'data-slot': 'number-field-group', className: 'relative flex w-full justify-between rounded-lg border'},
            h(NumberField.Decrement, {'data-slot': 'number-field-decrement', className: 'relative flex shrink-0'}, h(MinusIcon, null)),
            h(NumberField.Input, {'data-slot': 'number-field-input', className: 'text-foreground w-full text-center tabular-nums'}),
            h(NumberField.Increment, {'data-slot': 'number-field-increment', className: 'relative flex shrink-0'}, h(PlusIcon, null))
        )
    )
);

const TT =
    'hover:text-muted-foreground data-active:text-foreground relative flex shrink-0 grow cursor-pointer items-center justify-center rounded-md border border-transparent text-base font-medium whitespace-nowrap data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start sm:text-sm';
out += show(
    'tabs vertical (settings nav shape)',
    h(
        Tabs.Root,
        {orientation: 'vertical', value: 'interface', 'data-slot': 'tabs', className: 'flex min-h-0 flex-1 gap-4'},
        [
            h(
                Tabs.List,
                {
                    key: 'l',
                    'data-slot': 'tabs-list',
                    className: 'text-muted-foreground relative z-0 flex w-fit items-center justify-center gap-x-0.5 data-[orientation=vertical]:flex-col rounded-lg bg-(--state-pressed-surface) p-0.5 h-fit w-44 shrink-0 gap-0.5 self-start'
                },
                [
                    h(Tabs.Tab, {key: 'a', 'data-slot': 'tabs-tab', value: 'system', className: TT, 'data-size': 'default'}, '系统'),
                    h(Tabs.Tab, {key: 'b', 'data-slot': 'tabs-tab', value: 'interface', className: TT, 'data-size': 'default'}, '界面')
                ]
            ),
            h(
                Tabs.Panel,
                {key: 'p', 'data-slot': 'tabs-content', value: 'interface', className: 'm-0 flex min-h-0 w-full max-w-[820px] min-w-0 flex-1 flex-col gap-7 overflow-y-auto px-px pt-1 pb-4'},
                'panel'
            )
        ]
    )
);

const CT = 'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex w-full items-center justify-between gap-3 rounded-t-xl px-4 py-2.5 text-left';
out += show(
    'card + card-header + collapsible trigger (SettingsCard shape)',
    h(Collapsible.Root, {'data-slot': 'collapsible', render: h('section', null), defaultOpen: true, className: 'shrink-0'}, [
        h('div', {key: 'c', 'data-slot': 'card', className: 'bg-surface-raised text-foreground ring-stroke-subtle gap-0 py-0 shadow-none'}, [
            h('div', {key: 'h', 'data-slot': 'card-header', className: 'flex flex-row items-center gap-2 p-0'}, [
                h('h2', {key: 't', className: 'min-w-0 flex-1'}, [
                    h(
                        Collapsible.Trigger,
                        {key: 'tr', 'data-slot': 'collapsible-trigger', className: CT, 'aria-expanded': true},
                        [
                            h('span', {key: 'sp', className: 'flex min-w-0 flex-col gap-0.5'}, [
                                h('span', {key: 'ti', className: 'font-heading text-sm leading-snug font-semibold'}, '显示设置')
                            ]),
                            h(ChevronDownIcon, {key: 'ch', 'aria-hidden': true, className: 'text-muted-foreground size-4 shrink-0'})
                        ]
                    )
                ])
            ]),
            h(Collapsible.Panel, {key: 'p', 'data-slot': 'collapsible-content', keepMounted: true}, [
                h('div', {key: 'cc', 'data-slot': 'card-content', className: 'bg-surface-panel border-stroke-subtle rounded-t-xl border-t px-4 py-2.5 flex flex-col'}, 'content')
            ])
        ])
    ])
);

await fs.writeFile(path.join(here, 'ssr-probe.txt'), out);
console.log(out);
