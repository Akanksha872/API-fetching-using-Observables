import { fromEvent } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { exhaustMap, mergeMap } from 'rxjs/operators';

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

const endpoint = 'https://rxjs-api.glitch.me/api/facts?delay=2000&chaos=true';

const fetch$ = fromEvent(fetchButton, 'click').pipe(
  mergeMap(() => {
    return fromFetch(endpoint).pipe(mergeMap((response) => response.json()));
  })
);

fetch$.subscribe(addFacts);
