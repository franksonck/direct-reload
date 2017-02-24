import React, {Component} from 'react';
import 'whatwg-fetch';

import marked from 'marked';
import sanitizeHtml from 'sanitize-html';
import jsyaml from 'js-yaml';
import classNames from 'classnames';

function Evenement(props) {
  const {time, content, image, img_full_width} = props;
  const id = time.replace(':', '_');
  const processed_content = marked(content);
  const twitter_content = encodeURIComponent(sanitizeHtml(processed_content, {
    allowedTags: [],
    allowedAttributes: {},
  }).slice(0, 115));

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=https%3A//observatoire.jlm2017.fr/%23${id}`;
  const twitterUrl = `https://twitter.com/home?status=${twitter_content}%0A%20https%3A//observatoire.jlm2017.fr/%23${id}`;

  return (
    <div id={time.replace(':', '_')}>
      <div className="col-xs-2 col-sm-1 text-important">
        {time}
      </div>
      <div className="col-xs-10 col-sm-11">
        {image ?
          <div className="row">
            <div className={classNames({'col-xs-12': true, 'col-sm-6': !img_full_width})}>
              <div dangerouslySetInnerHTML={{__html: processed_content}}/>
            </div>
            <div className={classNames({'col-xs-12': true, 'col-sm-6': !img_full_width})}>
              <p>
                <img src={image} alt="illustration" className="img-responsive"/>
              </p>
            </div>
          </div>
          :
          <div dangerouslySetInnerHTML={{__html: processed_content}}/>
        }
        <p>
          <a target="_blank"
             href={facebookUrl}>Partager
            sur Facebook</a> -
          <a target="_blank"
             href={twitterUrl}>Partager
            sur Twitter</a>
        </p>
      </div>
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {elems: []};

    this.update = this.update.bind(this);
  }

  update() {
    const self = this;
    fetch('data/lemissionpolitique.yml')
      .then(function (res) {
        if (res.status === 200) {
          return res.text();
        }
      })
      .then(function (text) {
        self.setState({elems: jsyaml.load(text)});
      });
  }

  componentDidMount() {
    this.update();
    window.setInterval(this.update, 60 * 1000);
  }

  componentDidUpdate() {
    window.twttr && window.twttr.widgets && window.twttr.widgets.load && window.twttr.widgets.load();
    window.iframeResize && window.iframeResize();
  }

  render() {
    const elems = this.state.elems;

    return (
      <div>
        {elems.map((elem) => (
          <Evenement key={elem.time} {...elem} />
        ))}
      </div>
    );
  }
}

export default App;
