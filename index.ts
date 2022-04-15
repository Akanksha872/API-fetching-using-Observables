import { fromEvent, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { catchError, exhaustMap, mergeMap, retry, tap } from 'rxjs/operators';

import { createElement } from './helper';

const errorStatus = document.getElementById('error');
const fetchButton = document.getElementById('get-dog-facts');
const stopButton = document.getElementById('stop-dog-facts');
const factsSection = document.getElementById('dog-facts');
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

const endpoint =
  'https://rxjs-api.glitch.me/api/facts?delay=2000&chaos=true&flakiness=2';

const fetch$ = fromEvent(fetchButton, 'click').pipe(
  exhaustMap(() => {
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
        clearFacts();
        return of({ error: error.message });
      })
    );
  })
);

fetch$.subscribe(({ facts, error }) => {
  if (error) {
    return setError(error);
  } else {
    clearFacts();
    addFacts({ facts });
  }
});
