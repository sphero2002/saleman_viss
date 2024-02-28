import _mock from '../_mock';
import { randomInArray } from '../utils';
import {any} from "prop-types";

// ----------------------------------------------------------------------

export const _subjects = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  code: String,
  name: String,
  description: String,
  createDate: any,
  avatar: _mock.image.avatar(index),
  checkIn: _mock.time(index),
  checkOut: _mock.time(index),
  phoneNumber: _mock.phoneNumber(index),
  status: randomInArray(['pending', 'un_paid', 'paid']),
  roomType: randomInArray(['double', 'king', 'single']),
}));

export const _subjectsOverview = [...Array(3)].map((_, index) => ({
  status: ['Pending', 'Cancel', 'Done'][index],
  quantity: _mock.number.percent(index) * 1000,
  value: _mock.number.percent(index),
}));

export const _subjectReview = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  description: _mock.text.description(index),
  avatar: _mock.image.avatar(index),
  rating: _mock.number.rating(index),
  postedAt: _mock.time(index),
  tags: ['Great Sevice', 'Recommended', 'Best Price'],
}));

export const _subjectNew = [...Array(6)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  avatar: _mock.image.avatar(index),
  bookdAt: _mock.time(index),
  roomNumber: 'A-21',
  roomType: randomInArray(['double', 'king', 'single']),
  person: '3-5',
  cover: _mock.subject(index),
}));
