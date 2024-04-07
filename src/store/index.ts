import { ITimerData } from "../model";
import proxyWithPersist from "../utils/proxyWithPersist";

export let timerListState = proxyWithPersist<ITimerData[]>([], {
  key: "my-timer-data",
});
