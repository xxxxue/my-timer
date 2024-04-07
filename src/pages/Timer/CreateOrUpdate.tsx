import { useEffect } from "react";
import { ITimerDataForm } from "@/model";
import { timerListState } from "@/store";
import dayjs from "dayjs";
import { Button, Drawer, Form, Input, InputNumber, Space, Switch } from "antd";
import { dayjsGetFormat, dayjsGetNow } from "@/utils/dayjsUtil";
import { createId } from "@/utils/myUtils";
import NiceModal, { antdDrawerV5, useModal } from "@ebay/nice-modal-react";
import { MyDateTimePicker } from "@/components/MyDateTimePicker";
export interface IAddOrEditRef {
  open: (v?: string) => void;
}

export let CreateOrUpdate = NiceModal.create<{ id?: string }>((props) => {
  const niceModal = useModal();

  useEffect(() => {
    formRef.resetFields();
    let v = props.id;
    if (v != undefined) {
      let item = timerListState.find((a) => a.id === v)!;

      formRef.setFieldsValue({
        ...item,
        startTime: dayjs(item.startTime),
      });
    }
  }, []);

  let handleSuccess = () => {
    niceModal.resolve();
    niceModal.hide();
  };
  // 提交表单
  let handleSubmit = () => {
    formRef.validateFields().then((v) => {
      // 创建一个 ID
      if (v.id == undefined) {
        v.id = createId();
      }
      // console.log(v);

      let startTime = dayjsGetFormat(v.startTime ?? dayjsGetNow());
      let index = timerListState.findIndex((a) => a.id === v.id);
      if (index == -1) {
        // 不存在则添加
        timerListState.push({ ...v, startTime: startTime });
      } else {
        // 存在则修改
        timerListState[index] = { ...v, startTime: startTime };
      }
      handleSuccess();
    });
  };

  let [formRef] = Form.useForm<ITimerDataForm>();

  // 归0
  let handleSetZero = () => {
    formRef.setFieldsValue({
      day: 0,
      hour: 0,
      minute: 0,
    });
  };

  // 快速设置标题
  let handleSetTitle = (name: string) => {
    formRef.setFieldsValue({
      title: name,
    });
  };

  return (
    <Drawer
      {...antdDrawerV5(niceModal)}
      placement="top"
      height="fit-content"
      maskClosable
      extra={
        <div className="space-x-2">
          <Button danger onClick={handleSetZero}>
            归0
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            确定
          </Button>
        </div>
      }
    >
      <Form form={formRef} name="modalForm" layout="horizontal">
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="lockedState" hidden initialValue={false}>
          <Switch />
        </Form.Item>
        <Form.Item
          name="title"
          required
          label="标题"
          rules={[{ required: true, message: "请输入标题" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          {["🚀官服海岛", "🚀国际海岛", "🚀小米海岛"].map((v) => {
            return (
              <Button key={v} onClick={() => handleSetTitle(v)}>
                {v}
              </Button>
            );
          })}
        </Form.Item>
        <Space>
          <Form.Item name="day" initialValue={0} label="天">
            <InputNumber type="tel" autoComplete="off" />
          </Form.Item>
          <Form.Item name="hour" initialValue={0} label="小时">
            <InputNumber type="tel" autoComplete="off" />
          </Form.Item>
          <Form.Item name="minute" initialValue={0} label="分钟">
            <InputNumber type="tel" autoComplete="off" />
          </Form.Item>
        </Space>
        <Form.Item
          name="startTime"
          label="开始时间 (默认是此刻)"
          initialValue={dayjs()}
          rules={[{ required: true, message: "请输入时间" }]}
        >
          <MyDateTimePicker />
        </Form.Item>
      </Form>
    </Drawer>
  );
});
