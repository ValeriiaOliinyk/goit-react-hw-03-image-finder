import React, { Component } from 'react';
import Container from './components/Container';
import Seacrchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import Button from './components/Button';
import MainLoader from './components/MainLoader';
import Loader from 'react-loader-spinner';
import Modal from './components/Modal';
import Error from './components/Error';
import picturesApi from './services/pictures-api';

class App extends Component {
  state = {
    pictures: [],
    currentPage: 1,
    searchQuery: '',
    isLoading: false,
    error: null,
    largeImgUrl: '',
    alternative: '',
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.fetchPictures();
    }
  }

  formSubmit = data => {
    this.setState({
      searchQuery: data,
      currentPage: 1,
      pictures: [],
      error: null,
    });
  };

  scrollDocument = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  fetchPictures = () => {
    const { currentPage, searchQuery } = this.state;
    const options = {
      currentPage,
      searchQuery,
    };

    this.setState({ isLoading: true });

    picturesApi
      .fetchPictures(options)
      .then(hits => {
        this.setState(prevState => ({
          pictures: [...prevState.pictures, ...hits],
          currentPage: prevState.currentPage + 1,
        }));
        this.scrollDocument();
      })
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ isLoading: false }));
  };

  openModal = e => {
    const { alt } = e.currentTarget;
    this.setState({
      largeImgUrl: e.currentTarget.dataset.source,
      alternative: alt,
    });
  };

  closeModal = () => {
    this.setState({
      largeImgUrl: '',
      alternative: '',
    });
  };

  render() {
    const { pictures, isLoading, largeImgUrl, error, alternative } = this.state;
    const shouldRenderLoadMoreBtn = pictures.length > 0 && !isLoading;
    return (
      <Container>
        <Seacrchbar onSubmit={this.formSubmit} />
        {largeImgUrl && (
          <Modal
            largeImgUrl={largeImgUrl}
            alternative={alternative}
            onClose={this.closeModal}
          />
        )}
        <ImageGallery images={pictures} onClick={this.openModal} />
        {error && <Error text={error} />}
        {isLoading && (
          <MainLoader>
            <Loader
              type="Circles"
              color="#607254"
              height={80}
              width={80}
              timeout={3000}
            />
          </MainLoader>
        )}
        {shouldRenderLoadMoreBtn && <Button onClick={this.fetchPictures} />}
      </Container>
    );
  }
}

export default App;
