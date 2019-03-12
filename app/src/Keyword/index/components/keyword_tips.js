import React from "react";

export default class KeywordTips extends React.Component {
  render() {
    return (
      <div>
        <p>
          注：正常情况下，提交关键字后，约2分钟会出现初始排名数据.
          <br />
          1.初始排名数据在1~120之间，则表明系统正常运行，将软件最小化即可.{" "}
          <br />
          2.
          若较长时间后，初始排名数据仍为0，表明系统未正常启动检测功能。请查看“帮助"
          及时处理.
          <br />
          3.
          若初始排名数据显示为120+，则表明目标网页排名在12页以后，页面质量较弱，系统停止检测，请查看
          "帮助" 进行针对性解决.
        </p>
      </div>
    );
  }
}
