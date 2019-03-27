import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faImages, faImage, faAward} from '@fortawesome/free-solid-svg-icons'

export default class Buttons extends React.Component {
  singleImage() {
    return (
      <div className='button'>
        <label htmlFor='single'>
          <FontAwesomeIcon icon={faAward} color='red' size='8x'/>
        </label>
        <input type='file' id='single' name="file" onChange={this.props.onChange}/>
      </div>
    )
  }
  multiImages() {
    return (
      <div className='button'>
        <label htmlFor='multi'>
          <FontAwesomeIcon icon={faImages} color='#6d84b4' size='10x'/>
        </label>
        <input
          type='file'
          id='multi'
          name="file"
          onChange={this.props.onChange}
          multiple/>
      </div>
    )

  }

  render() {
    let button = this.singleImage()
    if (this.props.multi) {
      button = this.multiImages()
    }
    return (
      <div className='buttons fadein'>

        {button}

      </div>
    )

  }

}