# SVG-Spider-Chart

![SVG spider chart](img/svg-spider-chart.png)

SVG-based spider chart, a.k.a. radar chart, based on [Derhuerst's version](https://github.com/derhuerst/svg-radar-chart). The main differences are:

- The virtual dom library can be injected, for example, you can inject [mithril's](mithriljs.org) `m` function.
- By default, a spider chart is displayed instead of a radar chart, i.e. using linear scale lines instead of circles.
- It provides a Mithril component factory, `SpiderChartFactory`, to create `SpiderCharts` by injecting mithril's `m` function.
- You can specify a CSS style to use in the options (so when you save it, the CSS style is saved too).
- Using Typescript also provides type definitions.

## Playground

To play around with the component using `mithril`, please visit [flems](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcIB08wgDQgDMBLGHVAbVADsBDAWwjU2zxFgHsrEumi6AHdgCd4AAmAAdKqNEBlfkSQQhAYQAWNEQDEaCYQE9cUmfMXKV7KAFc6VMEelyFSoQBEa8Gg5PPlAeX54Ik57KQBfUQIhdjpRAHIwADcAcwBaMF8hVNgNETiAbikpDjsxDmtbMFEAXnFjUX4hIlgIVHiABSaWuO9RK0gCKyg2uIBVAaGqCDAwHvqlMCJkqhHXaaWqOccAIw9EIX0RgCE95X1RFRp+XSJ4fS2ZWHplGhHLhiEaUQBFKxooW73BwRGhVUwuCwVOyFKjFEJiJAeL61cj1SSOGQAekxoiI-DUnAg9UelmEIwAxMhYABOACsAEYHjIGl1WqJ6b0ZLt4PtDqIAAwYADsnNECw2bQ5xL6E2GAow1NFTw+r3livqYV66OZomxomS-xoAA99NLymT4uTYLAAMx2ghMmSNZpswUADlF3N5ktF4uWbUFADZRf0IIM5e6lc9Pj6NVrpXqpkb+mbSUIKfz+TR+dt+Y6WS6AxhaZ7Tgcix7pX6VvKRdLQ+Gi8GzdHVUHepqpABdUSgpxmNxI8hdmFSPUASSoACs4GJ4GoIKJYoMqAhgrDV-D+xDcmJauDzLudHoDgAKOgASlHVD1ACUIFQXKJ54ucpp4FI6BghA+XKf5uwsA2A+8AYNs7BIIY9R0KeB6qLuuB1BiuJICMSh0OwqSeEIyQQPA+blDYdi+kiooAO6KPOIz0pmACk+aJEQEBkUc7BGiMqQ0QK7IAEz8uymb5uwgTrmAbTajqoiLAAXmyNH8qKMhgE8pBtCW0pKSpEAACr6PwbIJJk+ZKRo+mdMJYmiKeiKeBeNQAHxWRJkmiLAUCgmAAByzwjGApkQMZzLEFAco2TQGDmkIvZVGA8BNFQySKaIYQXqKIJVO075EP8AA8cEBEEIT2R2qVSFerCQDAa4hEwAAsbqoPyICatQzxMBFMysCU3DwEw4GQUhMh0JoyREDW-Iwk6NBIEgY3JAGk2RJw8CpAQ9AkHyYA0HY6TKEQBCLQQy2pGREBLGo8BtDamaLZiABUrlpm0ZFqLcED5KId2YvU93wBB7BtGA+ixRAsRbTtkBNAQS1cF99RHVw6RELJkr8rStEwmERRUOS6HsINDTTbNCVtDxP6xPS5OLbssAANbJNEViPtkT2iOSBD8hzHOY9juOg5h2G4WIEkUUgVECfyGPQcaJ2UWoqOSzzON41hI14aIGDGkQVQSbF0S02y5K0sbi16+wBuy2L8vyjxSt8xhqs4erGDKf8i4ScFcqUhA731GbBttOS1LB6bcXmxAlvi4KtvhFI9sC2rYgu-5BOe6kwk3HcRY2qH+sR6LUfFnbKuC3hqAEokyga35Vzu-DJBQOn1ywICRb0sX-OO0L1f+eX7CV0IDjx13ZcV1Xye133A+pw3TeZ3yQYdw7pdJ08ImcKnx0yWytX8Eah0N4HtXH4dx2nedl2iFQwjDVAi2IEaK010g7BkZKe-sh--HswQB2x1QFVoCzlEkwekgZUD0lqs1Ls+AARUFpmQSgIBaAMCYEkNIGQBzZF3KwKwQgoBMAuvAfgYlsRM34PTCKMRMToPSJkbB74AAC0cMD8kxLNWKmIxpKCNBgGwSAMBThwPgO4+k0GwCaIEZquBWqoPQHQW4agmgEPwHggh6AiEkNQGQqgFDkhULoJiBR85lGMJ4qwjAtUjGKOURgBRVBBHCJAKIxg6BlKSN6mELsYQgA).

## Usage

You can either use the `SpiderChartFactory` to create your own `SpiderChart` by injecting the virtual dom function factory (in the example below, mithril is used). Or alternatively, you can import the `render` function, and render the content inside your own SVG (it generates the plain chart, without `svg` element around it).

```ts
import m from 'mithril';
import {
  SpiderChartFactory,
  SpiderColumns,
  SpiderData,
  SpiderOptions,
} from 'svg-spider-chart';


const columns = {
  price: 'Price',
  useful: 'Usefulness',
  design: 'Design',
  battery: 'Battery Capacity',
  camera: 'Camera Quality',
} as SpiderColumns;

const data = [
  {
    // iphone
    color: '#edc951',
    price: 1,
    battery: 0.7,
    design: 1,
    useful: 0.9,
    camera: 0.9,
  },
  {
    // galaxy
    color: '#cc333f',
    price: 0.8,
    battery: 1,
    design: 0.6,
    useful: 0.8,
    camera: 1,
  },
  {
    // nexus
    color: '#00a0b0',
    price: 0.5,
    battery: 0.8,
    design: 0.7,
    useful: 0.6,
    camera: 0.6,
  },
] as SpiderData[];

// Inject the m function
const SpiderChart = SpiderChartFactory(m);

// Render the chart
m.render(
  document.body,
  m(SpiderChart, {
    id: 'demo-target',
    columns,
    data,
    width: '100%',
    viewBox: '-10 0 120 100',
    options: {
      size: 100,
      scales: 5,
      scaleType: 'spider',
      shapeProps: (data) => ({
        className: 'shape',
        fill: data.color as string,
      }),
    } as Partial<SpiderOptions>,
  }),
);
```

```ts
import m from 'mithril';
import { render } from 'svg-spider-chart';

// Use the render function
const renderer = render(m);
const spiderChart = renderer(columns, data, options);
```

## Default options

The following default options are used: tweak them as you see fit.

```ts
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
```
