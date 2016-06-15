/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/node/index.d.ts" />
import {Observable, Observer} from '@reactivex/rxjs';
import xs from '../../src/index';
import * as assert from 'assert';

describe('xs.fromObservable', () => {
  it('should convert an observable to a stream', (done) => {
    const observable = new Observable<string>((observer: Observer<string>) => {
      // Emit a single value after 1 second
      const timer = setTimeout(() => {
        observer.next('yes');
        observer.complete();
      }, 1000);

      // On unsubscription, cancel the timer
      return () => clearTimeout(timer);
    });

    const stream = xs.fromObservable(observable);
    let nextSent = false;

    stream.addListener({
      next: (x: string) => {
        assert.strictEqual(x, 'yes');
        nextSent = true;
      },
      error: (err: any) => done(err),
      complete: () => {
        assert.strictEqual(nextSent, true);
        done();
      },
    });
  });
});
