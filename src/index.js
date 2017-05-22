require('./index.css');

import {loginClass} from './loginClass.js';
import {dataClass} from './dataClass.js';
import {bootstrapClass} from './bootstrapClass.js';

var bootstrap = bootstrapClass.getInstance(),
    login = new loginClass(),
    data = new dataClass(bootstrap);
console.log(data);
login.instance(bootstrap, data);
