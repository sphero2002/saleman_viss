import _mock from '../_mock';
import { randomNumberRange, randomInArray } from '../utils';
import {any} from "prop-types";

// ----------------------------------------------------------------------


export const _role = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  name: String,
  description: String,
  createDate: any,
  rolePermission: any
}));


