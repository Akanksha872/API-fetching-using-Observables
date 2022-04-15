import { fromEvent, merge, NEVER, of, timer } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  catchError,
  exhaustMap,
  mapTo,
  mergeMap,
  retry,
  switchMap,
  tap,
} from 'rxjs/operators';

import { createElement } from './helper';

const errorStatus = document.getElementById('error');
const fetchButton = document.getElementById('get-dog-facts');
const stopButton = document.getElementById('stop-dog-facts');
const factsSection = document.getElementById('dog-facts');

const fetch$ = fromEvent(fetchButton, 'click').pipe(mapTo(true));
const stop$ = fromEvent(stopButton, 'click').pipe(mapTo(false));
const clearFacts = () => {
  factsSection.innerText = '';
};
const setError = (error) => {
  errorStatus.innerText = error;
};
const clearError = () => {
  errorStatus.innerText = '';
};

const addFact = ({ fact }) => {
  factsSection.appendChild(createElement(fact, { classList: ['dog-fact'] }));
};
const addFacts = (data) => data.facts.forEach(addFact);

const endpoint = 'https://rxjs-api.glitch.me/api/facts';

const fetchData = () => {
  return fromFetch(endpoint).pipe(
    tap(clearError),
    mergeMap((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Oops!!!Something went wrong');
      }
    }),
    retry(4),
    catchError((error) => {
      console.error(error);
      clearFacts();
      return of({ error: error.message });
    })
  );
};

const factStream$ = merge(fetch$, stop$).pipe(
  switchMap((shouldFetch) => {
    if (shouldFetch) {
      return timer(0, 500).pipe(
        tap(() => clearError()),
        tap(() => clearFacts()),
        exhaustMap(fetchData)
      );
    } else {
      return NEVER;
    }
  })
);

factStream$.subscribe(addFacts);
