import React, { Component } from 'react';
import { Card } from './Card'

class Cards extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <div className="row">
          <div className="col-sm-6 col-md-4">

            <Card headerTitle={"Card title"}>this is test</Card>

          </div>
          <div className="col-sm-6 col-md-4">

            <Card footerTitle="Card title">this is test</Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card showHeader={true} check={true} headerTitle="Card title">this is check card</Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="card" headerExtender={
              <label className="switch switch-sm switch-text switch-info float-right mb-0">
                <input type="checkbox" className="switch-input" />
                <span className="switch-label" data-on="On" data-off="Off"></span>
                <span className="switch-handle"></span>
              </label>
            }>
              this is extend card
            </Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card with label" headerExtender={<span className="badge badge-success float-right">Success</span>}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
            </Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card with label" headerExtender={<span className="badge badge-pill badge-danger float-right">42</span>}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
            </Card>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card outline" className="card-outline-primary">
              this is test
            </Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card outline" className="card-outline-secondary">
              this is test
            </Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card outline" className="card-outline-success">
              this is test
            </Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card outline" className="card-outline-info">
              this is test
            </Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card outline" className="card-outline-warning">
              this is test
            </Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card outline" className="card-outline-danger">
              this is test
            </Card>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card outline" className="card-accent-primary">
              this is test
            </Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card outline" className="card-accent-secondary">
              this is test
            </Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card outline" className="card-accent-success">
              this is test
            </Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card outline" className="card-accent-info">
              this is test
            </Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card outline" className="card-accent-warning">
              this is test
            </Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card outline" className="card-accent-danger">
              this is test
            </Card>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-md-4">
            <div className="card card-inverse card-primary text-center">
              <div className="card-block">
                <blockquote className="card-blockquote">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                  <footer>Someone famous in
                    <cite title="Source Title">Source Title</cite>
                  </footer>
                </blockquote>
              </div>
            </div>

          </div>
          <div className="col-sm-6 col-md-4">
            <div className="card card-inverse card-success text-center">
              <div className="card-block">
                <blockquote className="card-blockquote">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                  <footer>Someone famous in
                    <cite title="Source Title">Source Title</cite>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-4">
            <div className="card card-inverse card-info text-center">
              <div className="card-block">
                <blockquote className="card-blockquote">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                  <footer>Someone famous in
                    <cite title="Source Title">Source Title</cite>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-4">
            <div className="card card-inverse card-warning text-center">
              <div className="card-block">
                <blockquote className="card-blockquote">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                  <footer>Someone famous in
                    <cite title="Source Title">Source Title</cite>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-4">
            <div className="card card-inverse card-danger text-center">
              <div className="card-block">
                <blockquote className="card-blockquote">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                  <footer>Someone famous in
                    <cite title="Source Title">Source Title</cite>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-4">
            <div className="card card-inverse card-primary text-center">
              <div className="card-block">
                <blockquote className="card-blockquote">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                  <footer>Someone famous in
                    <cite title="Source Title">Source Title</cite>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card title" className="card-inverse card-primary">
              this is test
          </Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card title" className="card-inverse card-success">
              this is test
          </Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card title" className="card-inverse card-info">
              this is test
          </Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card title" className="card-inverse card-warning">
              this is test
            </Card>
          </div>
          <div className="col-sm-6 col-md-4">

            <Card headerTitle="Card title" className="card-inverse card-danger">
              this is test
          </Card>
          </div>
        </div>
      </div>

    )
  }
}

export default Cards;
