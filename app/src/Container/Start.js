import React, { Component } from "react";
import { Button } from "react-bootstrap";
import image1 from '../../public/images/1.png'
import image2 from '../../public/images/2.png'
import image3 from '../../public/images/3.png'
import image4 from '../../public/images/4.png'
import image5 from '../../public/images/5.png'
import image6 from '../../public/images/6.png'

export default class Start extends Component {
  constructor(props) {
    super(props);
   
  }

  render() {
    
    var imageRoot = require('path').resolve() +'/app'
    console.log('imageurl', imageRoot)
    return (
      <div className="container">
        <div className="row">
          <div className="card">
            <div className="card-body">
              <div className="page-header">
                <h2>如何使用?</h2>
              </div>

              <p className="lead">
                1. 安装并启动软件<br />
                2. 如下图添加需要优化的关键字
                <img
                  src={image1}
                  className="img-rounded img-responsive"
                />
                <br />
                3. 点击“新建”
                <img
                  src={image2}
                  className="img-rounded img-responsive"
                />
                <br />
                4. 输入需要优化的关键字和匹配链接
                <img
                  src={image3}
                  className="img-rounded img-responsive"
                />
                <br />
                5.关键字和链接在百度搜索里面要对应
                <img
                  src={image4}
                  className="img-rounded img-responsive"
                />
                <br />
                6. 点击“更新”
                <img
                  src={image5}
                  className="img-rounded img-responsive"
                />
                <br />
                7. 添加成功，可以继续添加多个关键字进行优化
                <img
                  src={image6}
                  className="img-rounded img-responsive"
                />
              </p>
              <div className="page-header">
                <h2>怎样提高效果</h2>
              </div>
              <p className="lead">
                使用软件的人越多则效果越好，想取得网站关键字好的优化效果，保持软件运行就可以做到。
              </p>
              <div className="page-header">
                <h2>常见问题</h2>
              </div>
              <div className="lead">
                <dl>
                  <dt>有的关键字无法优化是怎么回事？</dt>
                  <dd>
                    如果有关键字排名显示"100+"，则说明关键字的排名太靠后,在15页的后面,太靠后的关键字将无法优化的,可以考虑一些SEO技巧做处理
                  </dd>
                </dl>
              </div>
            </div>
            <div className="card-footer" />
          </div>
        </div>
      </div>
    );
  }
}
