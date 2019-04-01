import React, {Component} from 'react'
import Notifications, {notify} from 'react-notify-toast'
import Spinner from './Spinner'
import Images from './Images'
import Buttons from './Buttons'
import WakeUp from './WakeUp'
import './index.css'
import axios from 'axios'
const toastColor = {
  background: '#505050',
  text: '#fff'
}

export default class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      uploading: false,
      images: props.images
    }
  }



  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.images != prevState.images){
      return{

        images:nextProps.images
      }
    }
    return null;
  }

  toast = notify.createShowQueue()

  onChange = e => {
    const errs = []
    const files = Array.from(e.target.files)

    if (files.length > 3) {
      const msg = '一次只能上传3个文件'
      return this.toast(msg, 'custom', 2000, toastColor)
    }

    const formData = new FormData()
    const types = ['image/png', 'image/jpeg', 'image/gif']

    files.forEach((file, i) => {

      if (types.every(type => file.type !== type)) {
        errs.push(`'${file.type}' 格式不支持`)
      }

      if (file.size > 1024*200) {
        errs.push(`'${file.name}' 文件大小不能超过200k`)
      }

      formData.append('file', file, file.name)
    })

    if (errs.length) {
      return errs.forEach(err => this.toast(err, 'custom', 2000, toastColor))
    }
    console.log('formdata', formData)
    this.setState({uploading: true})
    var headers = require("~/src/lib/check-auth").authHeader();
    var self = this;
    axios(`${process.env.REACT_APP_API_URL}/fileUpload`, {
      method: 'POST',
      data: formData,
      headers
    }).then((response) => {
      var url = response.data.url;
      var images = [];
      images.push(url)
      self.setState({uploading: false, images})
      if (self.props.onFinished) {
        self
          .props
          .onFinished(url);
      }
    }).catch(e => {
      console.error(e)
      self.toast(e.message, 'custom', 2000, toastColor)
      self.setState({uploading: false})
    })
  }

  filter = id => {
    return this
      .state
      .images
      .filter(image => image !== id)
  }

  removeImage = id => {
    this.setState({
      images: this.filter(id)
    })
    var headers = require("~/src/lib/check-auth").authHeader();
    var file = id.substring(id.lastIndexOf('/')+1)
    axios(`${process.env.REACT_APP_API_URL}/fileUpload/${file}`, {
      method: 'delete',
      headers
    }).then((response) => {
      console.log('image removed')
    });
    if (this.props.onRemove) {
      this
        .props
        .onRemove(id)
    }
  }

  onError = id => {
    this.toast('Oops, something went wrong', 'custom', 2000, toastColor)
    this.setState({
      images: this.filter(id)
    })
  }

  render() {
    const {loading, uploading, images} = this.state
    console.log('fileuploader images', images)
    const content = () => {
      switch (true) {
        case loading:
          return <WakeUp/>
        case uploading:
          return <Spinner/>
        case images.length > 0:
          return <Images images={images} removeImage={this.removeImage} onError={this.onError}/>
        default:
          return <Buttons
            onChange={this
            .onChange
            .bind(this)}
            multi={false}/>
      }
    }

    return (
      <div className='container'>
        <Notifications/>
        <div className='buttons'>
          {content()}
        </div>
      </div>
    )
  }
}