import m from 'mithril';
import {
  SpiderChartFactory,
  SpiderColumns,
  SpiderData,
  SpiderOptions,
} from '../../lib/dist';
import './assets/styles.css';

const columns = {
  price: 'Price',
  useful: 'Usefulness',
  design: 'Design',
  battery: 'Battery Capacity',
  camera: 'Camera\nQuality',
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

const options = {
  size: 100,
  scales: 5,
  scaleType: 'spider',
  shapeProps: (data) => ({
    className: 'shape',
    fill: data.color as string,
  }),
} as Partial<SpiderOptions>;

const SpiderChart = SpiderChartFactory(m);
m.render(
  document.body,
  m(SpiderChart, {
    id: 'demo-target',
    columns,
    data,
    width: '100%',
    viewBox: '-10 0 120 100',
    options,
  }),
);
