import _mock from '../_mock';
import { randomNumberRange, randomInArray } from '../utils';
import {any} from "prop-types";

// ----------------------------------------------------------------------


export const _typeDocumentList = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  name: String,
  createDate: any,
}));


