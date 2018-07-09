
import { Wavcoder } from './functions/index';

const pipe = (...func) => (value) => func.reduce((previous, current) => current(previous), value);

window['Wavcoder'] = { ...Wavcoder, pipe };



