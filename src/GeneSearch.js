import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  autoComplete as autoCompleteActionCreator,
  autoCompleteClear as autoCompleteClearActionCreator,
  searchGenes as searchGenesActionCreator,
} from './actions/search';
import {
  getGenes,
  getIsAutoCompleteLoading,
  getSearchInProgress,
  getSuggestedGenes,
} from './selectors/search';
import { GeneList, Search } from './components';
import styles from './geneSearch.css';

class GeneSearch extends Component {
  static propTypes = {
    autoComplete: PropTypes.func.isRequired,
    autoCompleteClear: PropTypes.func.isRequired,
    genes: PropTypes.array,
    isAutoCompleteLoading: PropTypes.bool.isRequired,
    isSearchInProgress: PropTypes.bool.isRequired,
    searchGenes: PropTypes.func.isRequired,
    suggestedGenes: PropTypes.array,
  };

  static defaultProps = {
    genes: null,
    suggestedGenes: null,
  };

  state = {
    isSuggestionBoxActive: false,
    searchTerm: '',
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.childInput && !this.childInput.contains(event.target)) {
      this.setState({ isSuggestionBoxActive: false });
    }
  };

  handleSearchClick = () => {
    const { searchGenes } = this.props;
    const { searchTerm } = this.state;
    searchGenes(searchTerm);
  };

  onChange = e => {
    const searchTerm = e.target.value;
    this.setState({ searchTerm });
    const { autoComplete, autoCompleteClear } = this.props;
    autoCompleteClear();
    autoComplete(searchTerm);
    this.setState({ isSuggestionBoxActive: true });
  };

  onSuggestionClick = e => {
    this.setState(
      {
        isSuggestionBoxActive: false,
        searchTerm: e.target.innerText,
      },
      () => this.handleSearchClick(),
    );
  };

  setRef = input => {
    this.childInput = input;
  };

  render() {
    const { isSuggestionBoxActive, searchTerm } = this.state;
    const {
      genes,
      isAutoCompleteLoading,
      isSearchInProgress,
      suggestedGenes,
    } = this.props;

    return (
      <div className={styles.geneSearch}>
        <Search
          onChange={this.onChange}
          onClick={this.handleSearchClick}
          onSuggestionClick={this.onSuggestionClick}
          isAutoCompleteLoading={isAutoCompleteLoading}
          isSuggestionBoxActive={isSuggestionBoxActive}
          setRef={this.setRef}
          suggestedGenes={suggestedGenes}
          searchTerm={searchTerm}
        />
        {isSearchInProgress && <p>search in progress...</p>}
        {!isSearchInProgress && genes && <GeneList genes={genes} />}
      </div>
    );
  }
}

export default connect(
  state => ({
    genes: getGenes(state),
    isAutoCompleteLoading: getIsAutoCompleteLoading(state),
    isSearchInProgress: getSearchInProgress(state),
    suggestedGenes: getSuggestedGenes(state),
  }),
  dispatch => ({
    autoComplete: searchTerm => dispatch(autoCompleteActionCreator(searchTerm)),
    autoCompleteClear: () => dispatch(autoCompleteClearActionCreator()),
    searchGenes: searchTerm => dispatch(searchGenesActionCreator(searchTerm)),
  }),
)(GeneSearch);
