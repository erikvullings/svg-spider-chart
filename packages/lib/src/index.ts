/**
 * SVG spider chart, adapted from @source: https://github.com/derhuerst/svg-radar-chart.
 *
 * - Converted to Typescript
 * - No hard dependency on VNode library (e.g. you can use [mithril](mithriljs.org), but also [virtual-dom](https://github.com/Matt-Esch/virtual-dom#dom-model))
 * - Not only circular scales, but also spider-like
 */

/** Options you can use to tweak the appearance of the spider chart */
export type SpiderOptions = {
  /**
   * Size of the chart (including captions)
   * @default 100
   */
  size: number;
  /** Show axes */
  axes: boolean;
  /**
   * Show scale circles or lines
   * @default 3
   */
  scales: number;
  /**
   * Scale type is either spider or radar
   * @default spider
   */
  scaleType: 'spider' | 'radar';
  /**
   * Show captions
   * @default true
   */
  captions: boolean;
  /**
   * Where on the axis are the captions?
   * @default 1.2
   */
  captionsPosition: number;
  chartSize: number;
  /** Shape smoothing function, returns an SVG string */
  smoothing: (points: Points) => string;
  /** Properties affecting the radial axis */
  axisProps: (
    col: SpiderDataColumn,
  ) => { className: string; [key: string]: string | number | boolean };
  /** Properties affecting the circular or spider-web-like scale lines */
  scaleProps: (
    value: number,
  ) => {
    className: string;
    fill: string;
    [key: string]: string | number | boolean;
  };
  /** Properties affecting the spider's chart shape */
  shapeProps: (
    data: SpiderData,
  ) => {
    className: string;
    fill?: string;
    [key: string]: string | number | boolean | undefined;
  };
  captionProps: (
    col?: SpiderDataColumn,
  ) => {
    className: string;
    'text-anchor': string;
    'font-size': number;
    'font-family': string;
    [key: string]: string | number;
  };
};

type SpiderConfiguration = SpiderOptions & {
  chartSize: number;
};

export type SpiderColumns = Record<string, string>;

type SpiderDataColumn = {
  caption: string;
  key: string;
  angle: number;
  [key: string]: string | number;
};

export type SpiderData = Record<string, string | number>;

type Points = Array<[x: number, y: number]>;

const MathPI05 = Math.PI / 2;

const polarToX = (angle: number, distance: number) =>
  Math.cos(angle - MathPI05) * distance;

const polarToY = (angle: number, distance: number) =>
  Math.sin(angle - MathPI05) * distance;

const points = (points: Points) => {
  return points
    .map((point) => point[0].toFixed(4) + ',' + point[1].toFixed(4))
    .join(' ');
};

const axis = (m: VNodeFactory, opt: SpiderConfiguration) => (
  col: SpiderDataColumn,
) =>
  m(
    'polyline',
    Object.assign(opt.axisProps(col), {
      points: points([
        [0, 0],
        [
          polarToX(col.angle, opt.chartSize / 2),
          polarToY(col.angle, opt.chartSize / 2),
        ],
      ]),
    }),
  );

const shape = (
  m: VNodeFactory,
  columns: SpiderDataColumn[],
  opt: SpiderConfiguration,
) => (data: SpiderData, i: number) =>
  m(
    'path',
    Object.assign(opt.shapeProps(data), {
      d: opt.smoothing(
        columns.map((col) => {
          const val = data[col.key];
          if ('number' !== typeof val) {
            throw new Error(`Data set ${i} is invalid.`);
          }

          return [
            polarToX(col.angle, (val * opt.chartSize) / 2),
            polarToY(col.angle, (val * opt.chartSize) / 2),
          ];
        }),
      ),
    }),
  );

const scale = (
  m: VNodeFactory,
  opt: SpiderConfiguration,
  value: number,
  columns: SpiderDataColumn[],
) =>
  opt.scaleType === 'radar'
    ? m(
        'circle',
        Object.assign(opt.scaleProps(value), {
          cx: 0,
          cy: 0,
          r: (value * opt.chartSize) / 2,
        }),
      )
    : m(
        'path',
        Object.assign(opt.scaleProps(value), {
          d: noSmoothing(
            columns.map((col) => {
              const val = (value * opt.chartSize) / 2;
              return [polarToX(col.angle, val), polarToY(col.angle, val)];
            }),
          ),
        }),
      );

const caption = (m: VNodeFactory, opt: SpiderConfiguration) => (
  col: SpiderDataColumn,
) =>
  m(
    'text',
    Object.assign(opt.captionProps(col), {
      x: polarToX(col.angle, (opt.size / 2) * 0.95).toFixed(4),
      y: polarToY(col.angle, (opt.size / 2) * 0.95).toFixed(4),
      dy: (opt.captionProps(col)['font-size'] || 2) / 2,
    }),
    col.caption,
  );

const noSmoothing = (points: Points) =>
  points
    .map(
      (p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(4)},${p[1].toFixed(4)}`,
    )
    .join('') + 'z';

const defaults = {
  size: 100, // size of the chart (including captions)
  axes: true, // show axes?
  scales: 3, // show scale circles?
  scaleType: 'spider',
  captions: true, // show captions?
  captionsPosition: 1.2, // where on the axes are the captions?
  smoothing: noSmoothing, // shape smoothing function
  axisProps: () => ({ className: 'axis' }),
  scaleProps: () => ({ className: 'scale', fill: 'none' }),
  shapeProps: () => ({ className: 'shape' }),
  captionProps: () => ({
    className: 'caption',
    'text-anchor': 'middle',
    'font-size': 3,
    'font-family': 'sans-serif',
  }),
} as Partial<SpiderOptions>;

export type VNodeFactory = (...attrs: any[]) => any;

export const render = (m: VNodeFactory) => (
  columns: SpiderColumns,
  data: SpiderData[],
  options = {} as Partial<SpiderOptions>,
) => {
  if ('object' !== typeof columns || Array.isArray(columns)) {
    throw new Error('columns must be an object');
  }
  if (!Array.isArray(data)) {
    throw new Error('data must be an array');
  }
  const opt = Object.assign({}, defaults, options) as SpiderOptions;
  opt.chartSize = opt.size / opt.captionsPosition;

  const dataColumns = Object.keys(columns).map((key, i, all) => ({
    key,
    caption: columns[key],
    angle: (Math.PI * 2 * i) / all.length,
  })) as SpiderDataColumn[];

  const groups = [m('g', data.map(shape(m, dataColumns, opt)))];
  if (opt.captions) groups.push(m('g', dataColumns.map(caption(m, opt))));
  if (opt.axes) groups.unshift(m('g', dataColumns.map(axis(m, opt))));
  if (opt.scales > 0) {
    const scales = [];
    for (let i = opt.scales; i > 0; i--) {
      scales.push(scale(m, opt, i / opt.scales, dataColumns));
    }
    groups.unshift(m('g', scales));
  }

  const delta = (opt.size / 2).toFixed(4);
  return m('g', { transform: `translate(${delta},${delta})` }, groups);
};

/** Initialize the factory with the virtual dom library to create spider charts (for mithril) */
export const SpiderChartFactory = (m: VNodeFactory) => {
  const r = render(m);
  return <
    T extends {
      id?: string;
      viewBox?: string;
      columns: SpiderColumns;
      data: SpiderData[];
      options?: Partial<SpiderOptions>;
      width?: string;
      height?: string;
      [key: string]: any;
    }
  >(): { view: ({}: { attrs: T }) => any } => ({
    view: ({
      attrs: { id, viewBox = '-10 0 120 100', columns, data, options, ...a },
    }) =>
      m(
        'svg',
        {
          xlmns: 'http://www.w3.org/2000/svg',
          version: 1,
          id,
          viewBox,
          ...a,
        },
        r(columns, data, options),
      ),
  });
};
