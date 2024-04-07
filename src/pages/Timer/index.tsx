import { useBoolean, useInterval } from "ahooks";
import classNames from "classnames";
import { PropsWithChildren, useMemo, useRef } from "react";
import { useSnapshot } from "valtio";
import { ITimerDataVO } from "@/model";
import { timerListState } from "@/store";
import { CreateOrUpdate } from "./CreateOrUpdate";
import dayjs, { Dayjs } from "dayjs";
import { App, Button, Collapse, CollapseProps, Modal, Space } from "antd";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  RedoOutlined,
  LockOutlined,
  UnlockOutlined,
  BellOutlined,
  SendOutlined,
  ShareAltOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { dayjsGetFormat, dayjsGetNow } from "@/utils/dayjsUtil";
import NiceModal, { antdModalV5, useModal } from "@ebay/nice-modal-react";
import { ShareData } from "./ShareData";
function Index() {
  let timerListSnap = useSnapshot(timerListState);
  let { modal, message } = App.useApp();

  let getIndexById = (id: string) => {
    if (id == undefined) {
      let msg = "参数 id 不能为空";
      alert(msg);
      throw msg;
    }
    let index = timerListState.findIndex((a) => a.id == id);
    return index;
  };

  let handleReset = (v: string) => {
    let index = getIndexById(v);
    timerListState[index].startTime = dayjsGetNow();
  };

  let handleDelete = (v: string) => {
    let index = getIndexById(v);
    timerListState.splice(index, 1);
  };

  let [update, updateFn] = useBoolean(false);
  // 定时刷新
  useInterval(updateFn.toggle, 10000);

  let list = useMemo(() => {
    let ret: ITimerDataVO[] = [];

    timerListSnap.forEach((v) => {
      let endTime = dayjs(v.startTime)
        .add(Number(v.day ?? 0), "days")
        .add(Number(v.hour ?? 0), "hours")
        .add(Number(v.minute ?? 0), "minutes");

      ret.push({
        ...v,
        endTimeDayjs: endTime,
        endTime: dayjsGetFormat(endTime),
        validState: dayjs().isBefore(endTime),
      });
    });

    // 最近到期的排在前面
    ret.sort((a, b) => {
      return a.endTimeDayjs.isSame(b.endTimeDayjs)
        ? 0
        : a.endTimeDayjs.isBefore(b.endTimeDayjs)
        ? -1
        : 1;
    });

    return [
      ...ret.filter((a) => {
        return a.validState == true;
      }),
      ...ret.filter((a) => {
        return a.validState == false;
      }),
    ];
  }, [timerListSnap, update]);

  let handleDeleteAll = () => {
    list.map((a) => {
      // 只删除没有锁定的过期计时器
      if (a.validState == false && a.lockedState != true) {
        handleDelete(a.id);
      }
    });
  };

  let diffTime = (time: Dayjs | string) => {
    let myTime: Dayjs = typeof time == "string" ? dayjs(time) : time;
    let nowTime = dayjs();
    let diff = dayjs.duration(myTime.diff(nowTime));
    let isBefore = myTime.isBefore(nowTime);

    let year = diff.years();
    let month = diff.months();
    let day = diff.days();
    let hour = diff.hours();
    let minute = diff.minutes();
    let second = diff.seconds();

    let ret: string[] = [];

    // 将负数变为正数
    function abs(num: number) {
      if (num < 0) {
        return Math.abs(num);
      }
      return num;
    }

    // 到期后,在时间前面添加 "-" 号
    ret.push(isBefore ? "-" : "");

    if (year != 0) {
      ret.push(`${abs(year)}年`);
    }
    if (month != 0) {
      ret.push(`${abs(month)}月`);
    }
    if (day != 0) {
      ret.push(`${abs(day)}天`);
    }
    if (hour != 0) {
      ret.push(`${abs(hour)}时`);
    }
    if (minute != 0) {
      ret.push(`${abs(minute)}分`);
    }
    if (second != 0) {
      ret.push(`${abs(second)}秒`);
    }
    // 结果:
    //  273年 11月 23天 23时 59分 48秒
    //  1月 29天 23时 58分 28秒
    // 21时 26分 19秒
    // - 1分 2秒
    return ret.join("");
  };

  let handleLocked = (v: string) => {
    let index = getIndexById(v);
    timerListState[index].lockedState = !timerListState[index].lockedState;
  };

  let handleCreate = () => {
    NiceModal.show(CreateOrUpdate).then(() => {
      message.success("添加成功");
    });
  };
  let handleUpdate = (id: string) => {
    NiceModal.show(CreateOrUpdate, { id: id }).then(() => {
      message.success("修改成功");
    });
  };

  let collapseItems = useMemo(() => {
    let ret: CollapseProps["items"] = [];

    for (const v of list) {
      ret.push({
        showArrow: false,
        key: v.id,
        label: (
          <div
            className={classNames(
              "rounded-md border-2 border-solid flex-row justify-between flex p-2 shadow-xl",
              v.lockedState
                ? "border-orange-300 bg-lime-200"
                : v.validState
                ? "border-blue-400"
                : "border-red-500 bg-yellow-300 "
            )}
          >
            <div className="flex flex-col justify-between items-cente">
              <div className="text-lg text-red-500">{v.title}</div>
              <div className="text-lg">{diffTime(v.endTimeDayjs)}</div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <div>
                {v.startTime === v.endTime ? (
                  <>
                    <BellOutlined /> <span>{v.endTime}</span>
                  </>
                ) : (
                  <>
                    <div>
                      <SendOutlined /> <span>{v.startTime}</span>
                    </div>
                    <div>
                      <BellOutlined /> <span>{v.endTime}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="text-orange-600">{v.endTimeDayjs.calendar()}</div>
            </div>
          </div>
        ),
        children: (
          <Space>
            {/* <pre>{JSON.stringify(v, null, 2)}</pre> */}
            <Button
              size="large"
              danger
              onClick={() => {
                NiceModal.show(DataShow, { children: <pre>{JSON.stringify(v, null, 2)}</pre> });
              }}
              icon={<SearchOutlined />}
            />
            <Button
              size="large"
              danger
              onClick={() => {
                modal.confirm({
                  title: "确定删除吗",
                  onOk: () => {
                    handleDelete(v.id);
                  },
                });
              }}
              icon={<DeleteOutlined />}
            />
            <Button
              size="large"
              type={v.lockedState ? "primary" : "default"}
              onClick={() => {
                modal.confirm({
                  title: v.lockedState ? "解锁?" : "锁定? (锁定后只能手动单独删除)",
                  onOk: () => {
                    handleLocked(v.id);
                  },
                });
              }}
              icon={v.lockedState ? <LockOutlined /> : <UnlockOutlined />}
            />
            <Button
              size="large"
              icon={<RedoOutlined />}
              onClick={() => {
                modal.confirm({
                  title: "重新计时?(会将开始时间改为此刻,其他不变)",
                  onOk: () => {
                    handleReset(v.id);
                  },
                });
              }}
            />
            <Button
              size="large"
              className="text-orange-500"
              onClick={() => handleUpdate(v.id)}
              icon={<EditOutlined />}
            />
          </Space>
        ),
      });
    }
    return ret;
  }, [list]);

  let handleShare = () => {
    NiceModal.show(ShareData);
  };
  return (
    <>
      <div className="p-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-lg cursor-pointer" onClick={updateFn.toggle}>
            {dayjs().format("MM.DD A h:mm:ss dddd")}
          </div>
          <div className="space-x-2">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                modal.confirm({
                  title: "确定删除所有过期的定时器吗",
                  onOk: () => {
                    handleDeleteAll();
                  },
                });
              }}
            />
            <Button type="default" onClick={handleShare} icon={<ShareAltOutlined />} />
            <Button type="primary" onClick={handleCreate} icon={<PlusCircleOutlined />} />
          </div>
        </div>
        <Collapse ghost items={collapseItems} accordion />
      </div>
    </>
  );
}
export default Index;

let DataShow = NiceModal.create<PropsWithChildren>((props) => {
  let niceModal = useModal();
  return (
    <Modal {...antdModalV5(niceModal)} footer={null}>
      {props.children}
    </Modal>
  );
});
