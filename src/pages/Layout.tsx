import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { FC, PropsWithChildren, Suspense } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

let MenuItem: FC<
  PropsWithChildren<{
    onClick: () => void;
  }>
> = (props) => {
  return (
    <div
      onClick={props.onClick}
      className=" w-1/2 h-full flex justify-center items-center  cursor-pointer hover:bg-slate-200"
    >
      {props.children}
    </div>
  );
};

export default function Layout() {
  let nav = useNavigate();
  let loc = useLocation();
  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="w-full flex-1 overflow-y-auto">
          <Suspense fallback={<p>Loading...</p>}>
            <Outlet />
          </Suspense>
        </div>
        <div className="w-full h-8 "></div>
      </div>
      <div className="bg-white w-full h-8 fixed bottom-0 left-0 flex justify-between text-lg">
        <MenuItem
          onClick={() => {
            nav("/");
          }}
        >
          <HomeOutlined />
        </MenuItem>
        <MenuItem
          onClick={() => {
            nav("/settings");
          }}
        >
          <SettingOutlined />
        </MenuItem>
      </div>
    </>
  );
}
