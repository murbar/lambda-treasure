import { useState } from 'react';

const useQueue = () => {
  const [items, setItems] = useState([]);
  const lastItem = items[items.length - 1];

  const enqueue = item => {
    setItems(prev => [item, ...prev]);
  };
  const dequeue = () => {
    const next = lastItem;
    setItems(prev => prev.slice(0, prev.length - 1));
    return next;
  };

  const peek = () => {
    return lastItem;
  };

  const flush = () => {
    setItems([]);
  };

  return {
    items,
    enqueue,
    dequeue,
    peek,
    flush,
    count: items.length
  };
};

export default useQueue;
