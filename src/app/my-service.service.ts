import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MyServiceService {
  constructor() {}

  /**
   * Deeply clones a value handling common built-ins and circular refs.
   * Falls back to `structuredClone` when available.
   */
  deepClone<T>(value: T): T {
    const sc = (globalThis as any).structuredClone;
    if (typeof sc === 'function') return sc(value);

    const seen = new WeakMap<object, any>();

    const _clone = (v: any): any => {
      if (v === null || typeof v !== 'object') return v;
      if (v instanceof Date) return new Date(v.getTime());
      if (v instanceof RegExp) return new RegExp(v.source, v.flags);
      if (v instanceof Map) {
        if (seen.has(v)) return seen.get(v);
        const m = new Map();
        seen.set(v, m);
        v.forEach((val, key) => m.set(_clone(key), _clone(val)));
        return m;
      }
      if (v instanceof Set) {
        if (seen.has(v)) return seen.get(v);
        const s = new Set();
        seen.set(v, s);
        v.forEach((val) => s.add(_clone(val)));
        return s;
      }
      if (Array.isArray(v)) {
        if (seen.has(v)) return seen.get(v);
        const a: any[] = [];
        seen.set(v, a);
        v.forEach((item, i) => (a[i] = _clone(item)));
        return a;
      }

      // plain object (preserve prototype)
      if (seen.has(v)) return seen.get(v);
      const proto = Object.getPrototypeOf(v);
      const out: any = Object.create(proto);
      seen.set(v, out);

      // clone own property keys (including symbols)
      Reflect.ownKeys(v).forEach((key) => {
        const desc = Object.getOwnPropertyDescriptor(v, key as string | symbol);
        if (!desc) return;
        if ('value' in desc) {
          desc.value = _clone((v as any)[key as any]);
        }
        Object.defineProperty(out, key, desc);
      });

      return out;
    };

    return _clone(value);
  }
}
