import { TestBed } from '@angular/core/testing';

import { MyServiceService } from './my-service.service';

describe('MyServiceService', () => {
  let service: MyServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deepClone: clones plain objects and arrays without linking', () => {
    const original = { a: 1, b: [2, 3], c: { d: 4 } };
    const copy = service.deepClone(original);
    expect(copy).not.toBe(original);
    expect(copy).toEqual(original);
    copy.b[0] = 99;
    expect(original.b[0]).toBe(2);
  });

  it('deepClone: clones Date and RegExp correctly', () => {
    const date = new Date(2020, 1, 1);
    const re = /abc/gi;
    const cd = service.deepClone(date);
    const cr = service.deepClone(re);
    expect(cd).not.toBe(date);
    expect(cd.getTime()).toBe(date.getTime());
    expect(cr).not.toBe(re);
    expect(cr.source).toBe(re.source);
    expect(cr.flags).toBe(re.flags);
  });

  it('deepClone: clones Map and Set with nested objects', () => {
    const map = new Map<any, any>();
    map.set('x', { n: 1 });
    const set = new Set<any>();
    set.add({ s: 2 });

    const cmap = service.deepClone(map);
    const cset = service.deepClone(set);

    expect(cmap).not.toBe(map);
    expect(cmap.get('x')).not.toBe(map.get('x'));
    expect(cmap.get('x')).toEqual(map.get('x'));

    const originalItem = Array.from(set)[0];
    const clonedItem = Array.from(cset)[0];
    expect(clonedItem).not.toBe(originalItem);
    expect(clonedItem).toEqual(originalItem);
  });

  it('deepClone: preserves structure for circular references', () => {
    const a: any = { name: 'root' };
    a.self = a;
    const ca: any = service.deepClone(a);
    expect(ca).not.toBe(a);
    expect(ca.name).toBe('root');
    expect(ca.self).toBe(ca);
  });
});
