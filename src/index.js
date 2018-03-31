const LIST_METHODS = {
  MAP: 'map',
  FILTER: 'filter',
  FOR_EACH: 'forEach',
  REDUCE: 'reduce',
};

export class LazyList {
  constructor(list) {
    this.list = list;
    this.t = [];
  }

  map(fn) {
    this.t.push([LIST_METHODS.MAP, fn]);
    return this;
  }

  filter(fn) {
    this.t.push([LIST_METHODS.FILTER, fn]);
    return this;
  }

  forEach(fn) {
    this.t.push([LIST_METHODS.FOR_EACH, fn]);
    return this;
  }

  reduce(fn, acc) {
    this.t.push([LIST_METHODS.REDUCE, fn, acc]);
    return this.value();
  }

  value() {
    const result = [];
    const hasReduce = this.t[this.t.length - 1][0] === LIST_METHODS.REDUCE;
    let reducerAcc;
    for (let i = 0; i < this.list.length; i += 1) {
      let nextValue = this.list[i];
      for (let k = 0; k < this.t.length; k += 1) {
        if (nextValue) {
          switch (this.t[k][0]) {
            case LIST_METHODS.MAP:
              nextValue = this.t[k][1](nextValue);
              break;

            case LIST_METHODS.FILTER:
              if (!this.t[k][1](nextValue)) {
                nextValue = false;
              }
              break;

            case LIST_METHODS.FOR_EACH:
              this.t[k][1](nextValue);
              break;
            default:
          }
        }


        if (nextValue && hasReduce) {
          [, , reducerAcc] = this.t[this.t.length - 1];
          if (!reducerAcc && result.length === 1) {
            [reducerAcc] = result;
          } else if (!reducerAcc && result.length === 0) {
            reducerAcc = nextValue;
          } else if (reducerAcc && result.length === 0) {
            reducerAcc = this.t[this.t.length - 1][1](reducerAcc, nextValue);
          }
          if (result.length >= 1) {
            reducerAcc = this.t[this.t.length - 1][1](reducerAcc, nextValue);
          }
        }
      }

      if (nextValue) {
        result.push(nextValue);
      }
    }

    if (hasReduce) {
      return reducerAcc;
    }

    return result;
  }
}

export const lazy = function lazy(list) {
  return new LazyList(list);
};
