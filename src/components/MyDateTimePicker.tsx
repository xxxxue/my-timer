import { DatePicker } from "antd";
import dayjs from "dayjs";
import { FC, useRef } from "react";

/**
 * 日期 与 时间 分开选择
 *
 * 版本号: "antd": "^5.17.4"
 * @param props
 * @returns
 */
export let MyDateTimePicker: FC<{
  "aria-required"?: boolean;
  id?: string; // antd文档中说是用来定位的, 滚动到指定 dom, (scrollToField / scrollToFirstError)
  value?: dayjs.Dayjs;
  onChange?: ((date: dayjs.Dayjs | null, dateString: string | string[]) => void) | undefined;
}> = (inProps) => {
  // console.log(inProps);
  let { onChange, id, ...props } = inProps;
  const dateRef = useRef(props.value);

  /**
   * 包一层 onChange,
   * 将 2 个组件的数据合并到一起
   * (因为 antd DatePicker["date"] 会把 时分秒 全部设置为 0 )
   * @param v 当前选择的值 (dayjs对象)
   * @param type 组件的类型
   */
  let handleDateTimeChange = (v: dayjs.Dayjs, type: "date" | "time") => {
    // console.log(type, v);
    if (v == undefined) {
      // 清空表单, 由于两个组件都绑定的 props.value , 所以会一起清空
      dateRef.current = undefined;
    } else {
      // 如果表单是空的,就获取当前的日期时间, 去操作
      if (dateRef.current == undefined) {
        dateRef.current = dayjs();
      }
      if (type == "date") {
        dateRef.current = dateRef.current
          ?.set("year", v.year()) // 年
          .set("month", v.month()) // 月
          .set("date", v.date()); // 日
      } else if (type == "time") {
        dateRef.current = dateRef.current
          ?.set("hour", v.hour()) // 时
          .set("minute", v.minute()) // 分
          .set("second", v.second()); // 秒
      }
    }
    // 模仿原生 antd DatePicker 的值
    onChange?.(dateRef.current ?? null, dateRef.current?.toDate().toLocaleString() ?? "");
  };

  return (
    <div className="space-x-2" id={id}>
      <DatePicker
        {...props}
        picker="date"
        onChange={(v) => {
          handleDateTimeChange(v, "date");
        }}
      />
      <DatePicker
        {...props}
        picker="time"
        onChange={(v) => {
          handleDateTimeChange(v, "time");
        }}
      />
    </div>
  );
};
