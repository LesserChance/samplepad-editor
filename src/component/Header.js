import React from 'react';

const HeaderComponent = React.memo(function HeaderComponent(props) {
  return (
    <section className="hero is-small is-primary is-bold">
      <div className="hero-body">
        <div className="container">
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <h1 className="title">
                  SamplePad Kit Editor
                </h1>
              </div>
            </div>

            <div className="level-right">
              <p className="level-item">
                <a className="button is-link is-outlined" onClick = {props.loadCard}>Load SD Card</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
})

export default HeaderComponent;
