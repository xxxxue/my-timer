import { proxy, snapshot, subscribe } from "valtio";

// 持久化
export default function proxyWithPersist<T extends Object>(
  value: T,
  options: {
    key: string;
  }
) {
  const local = localStorage.getItem(options.key);
  const state = proxy<T>(local ? JSON.parse(local) : value);
  subscribe(state, () => {
    localStorage.setItem(options.key, JSON.stringify(snapshot(state)));
  });
  return state;
}
