import LazyList from './LazyList';

export default function lazy(list) {
  return new LazyList(list);
}
