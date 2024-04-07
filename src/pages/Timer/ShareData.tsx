import { ITimerData } from "@/model";
import { timerListState } from "@/store";
import { createId } from "@/utils/myUtils";
import NiceModal, { antdDrawerV5, useModal } from "@ebay/nice-modal-react";
import { App, Button, Checkbox, ConfigProvider, Drawer, Input, InputRef, Switch } from "antd";
import { TextAreaRef } from "antd/es/input/TextArea";
import copyToClipboard from "copy-to-clipboard";
import { useRef, useState } from "react";
import { useSnapshot } from "valtio";
export let ShareData = NiceModal.create(() => {
  let niceModal = useModal();
  let { modal, message } = App.useApp();

  let timerListSnap = useSnapshot(timerListState);
  const dataInputRef = useRef<TextAreaRef>(null);

  let handleReplace = () => {
    // 操作前备份现有数据, 用于异常后的恢复
    let tmpData = JSON.stringify(timerListSnap);
    try {
      let data = dataInputRef.current?.resizableTextArea?.textArea.value ?? "";
      if (data == "") {
        message.error("数据为空");
        return;
      }
      let dataJson: ITimerData[] = JSON.parse(data);

      if (dataJson.length == 0) {
        message.error("数据为空");
        return;
      }

      if (isReplace) {
        timerListState.length = 0;
      }
      for (const item of dataJson) {
        item.id = createId();
        timerListState.push(item);
      }
      handleSuccess();
    } catch (e) {
      let error = e as Error;
      message.error(JSON.stringify(error, null, 2));

      //出现任何异常都恢复数据
      timerListState.length = 0;
      for (const item of JSON.parse(tmpData)) {
        item.id = createId();
        timerListState.push(item);
      }
    }
  };

  let handleSuccess = () => {
    niceModal.resolve();
    niceModal.hide();
  };
  
  let handleCopy = () => {
    if (copyToClipboard(JSON.stringify(timerListSnap, null, 2))) {
      message.success("复制成功");
    } else {
      message.error("复制失败");
    }
  };

  const [isReplace, setIsReplace] = useState<boolean>(false);
  return (
    <>
      <Drawer
        {...antdDrawerV5(niceModal)}
        placement="top"
        height="fit-content"
        maskClosable
        extra={
          <Button
            onClick={() => {
              modal.confirm({
                title: "确定将本地数据导出到剪贴板吗?",
                onOk: () => {
                  handleCopy();
                },
              });
            }}
          >
            导出到剪贴板
          </Button>
        }
      >
        <div className="space-y-2">
          <Input.TextArea className="h-52" ref={dataInputRef} />

          <div className="flex justify-end space-x-2 items-center">
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "red",
                  colorTextQuaternary: "blue",
                },
              }}
            >
              <Switch
                checkedChildren="覆盖模式"
                unCheckedChildren="追加模式"
                value={isReplace}
                onClick={(v) => {
                  setIsReplace(v);
                }}
              />
            </ConfigProvider>
            <Button
              type="primary"
              danger
              onClick={() => {
                modal.confirm({
                  title: isReplace ? "确定覆盖吗? 本地数据会消失哦" : "确定追加数据吗",
                  onOk: () => {
                    handleReplace();
                  },
                });
              }}
            >
              确定导入
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
});
