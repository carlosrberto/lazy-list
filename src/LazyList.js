export const LIST_OPERATIONS = {
  MAP: 'map',
  FILTER: 'filter',
  REDUCE: 'reduce',
};

export const VALID_OPERATIONS = Object
  .keys(LIST_OPERATIONS)
  .map(v => LIST_OPERATIONS[v]);

export default class LazyList {
  constructor(list, operations = []) {
    if (!Array.isArray(list)) {
      throw Error('Invalid list argument');
    }

    if (!Array.isArray(operations)) {
      throw Error('Invalid operations argument');
    }

    this.operations = operations;
    this.list = list;
  }

  createOperation(type, fn, ...extraArgs) {
    if (!(type in VALID_OPERATIONS)) {
      throw Error('Invalid operation type argument');
    }

    if (typeof fn !== 'function') {
      throw Error('Invalid callback argument');
    }

    return new LazyList(
      this.list,
      [
        ...this.operations,
        ...[{ type, fn, extraArgs }],
      ],
    );
  }

  map(fn) {
    return this.createOperation(LIST_OPERATIONS.MAP, fn);
  }

  filter(fn) {
    return this.createOperation(LIST_OPERATIONS.FILTER, fn);
  }

  reduce(fn, ...extraArgs) {
    return this.createOperation(LIST_OPERATIONS.REDUCE, fn, ...extraArgs).value();
  }

  value() {
    const { list, operations } = this;
    const listLength = list.length;
    const operationsLength = operations.length;
    const { type: lastOperationType } = operations[operationsLength - 1];
    const result = [];
    let reducerAcc;

    for (let i = 0; i < listLength; i += 1) {
      const item = list[i];
      const nextItem = { value: item, valid: true };

      for (let j = 0; j < operationsLength; j += 1) {
        const { type, fn, extraArgs } = operations[j];

        if (nextItem.valid && type === LIST_OPERATIONS.MAP) {
          nextItem.value = fn(item, i);
        } else if (nextItem.valid && type === LIST_OPERATIONS.FILTER) {
          if (fn(item, i)) {
            nextItem.value = item;
          } else {
            nextItem.valid = false;
          }
        }

        if (nextItem.valid && type === LIST_OPERATIONS.REDUCE) {
          const [reducerInitial] = extraArgs;
          if (i === 0) {
            if (reducerInitial !== undefined) {
              reducerAcc = fn(reducerInitial, item);
            } else {
              reducerAcc = item;
            }
          } else {
            reducerAcc = fn(reducerAcc, item);
          }
        }
      }

      if (lastOperationType !== LIST_OPERATIONS.REDUCE && nextItem.valid) {
        result.push(nextItem.value);
      }
    }

    if (lastOperationType === LIST_OPERATIONS.REDUCE) {
      return reducerAcc;
    }

    return result;
  }
}
