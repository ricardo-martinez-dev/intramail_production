import "./style.css";
import React from "react";
import axios from "axios";

class UserInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: null,
      isLoading: true,
      intervalId: null,
    };
  }

  fetchArticles = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/news`;
    const articles = await axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    this.setState({ articles });
  };

  async componentDidMount() {
    await this.fetchArticles();

    const intervalId = setInterval(() => {
      this.fetchArticles();
    }, 1000 * 60 * 5);

    this.setState({ isLoading: false, intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
    this.setState({ intervalId: null });
  }

  render() {
    const { isLoading } = this.state;

    return (
      <div id="news">
        <div id="info">
          <h2>News Headlines</h2>

          {!isLoading && (
            <ul>
              {this.state.articles.map((article, i) => (
                <li key={i}>
                  <a href={article.url} target="_blank">
                    <div id="thumbnail">
                      <img src={article.img} alt="" />
                    </div>

                    <div id="header">
                      <p>{article.header}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

export default UserInfo;
