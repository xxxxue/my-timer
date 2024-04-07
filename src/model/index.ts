import { Dayjs } from "dayjs";

export interface ITimerData {
  id: string,
  // 开始时间
  startTime: string;
  // 标题
  title: string;
  //天
  day: number;
  // 小时
  hour: number;
  // 分钟
  minute: number;

  lockedState: boolean;
}

export interface ITimerDataForm extends Omit<ITimerData, 'startTime'> {
  startTime: Dayjs;
}

export interface ITimerDataVO extends ITimerData {
  // 倒计时结束的时间
  endTime: string;
  // moment 对象
  endTimeDayjs: Dayjs;
  // 是否有效 (倒计时还没结束)
  validState: boolean;
}
