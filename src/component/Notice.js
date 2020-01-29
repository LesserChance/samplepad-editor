/* Global imports */
import React from 'react';
import { connect } from 'react-redux'
import update from 'immutability-helper';

/* Component imports */
import "css/Notice.css"

class NoticeComponent extends React.Component {
  /*
   * @constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      hiddenNotices: [],
      hidingNotices: []
    };

    this.hideNotice = this.hideNotice.bind(this);
  }

  hideNotice(noticeId) {
    this.setState(update(this.state, {
      hiddenNotices: {$push: [noticeId]},
      hidingNotices: {$push: [noticeId]}
    }));
  }

  componentDidUpdate() {
    // start timeouts for any new notices that were added
    this.props.notices.forEach((notice) => {
      if (this.state.hidingNotices.indexOf(notice.id) === -1) {
        this.startTimeout(notice.id)
      }
    })
  }

  startTimeout(noticeId) {
    if (this.state.hidingNotices.indexOf(noticeId) === -1) {
      setTimeout(() => {
        this.setState(update(this.state, {
          hiddenNotices: {$push: [noticeId]}
        }));
      }, 2000);

      this.setState(update(this.state, {
        hidingNotices: {$push: [noticeId]}
      }));
    }
  }

  render() {
    return (
      <div className="Notices">
        {
          this.props.notices.map((notice) => {
            return (
              <article key={notice.id}
                className={"message Notice " + ((this.state.hiddenNotices.indexOf(notice.id) > -1) ? 'hidden ' : '') + notice.style}>
                <div className="message-header">
                  {notice.text}

                  <a href="#" onClick={() => {this.hideNotice(notice.id)}}>
                    <i
                      className="glyphicon glyphicon-remove is-pulled-right"
                      aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })
        }
      </div>
    );
  }
}

export default NoticeComponent;