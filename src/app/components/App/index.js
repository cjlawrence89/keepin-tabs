import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from '../Header';
import TabsList from '../TabsList';
import TabsListItem from '../TabsListItem';
import { goToTab } from '../../utils.js';
import { createStructuredSelector } from 'reselect';
import { getVisibleTabs, getHighlightedTabId, getMode, getQuery, getListView, getSelectedTabIds } from '../../selectors.js'
import { setMode, setHighlightedTabId, selectTab, deselectTab } from '../../actions.js';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			flushDrop: new Date(),
		};

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleDragEnd = this.handleDragEnd.bind(this);
	}

	componentDidMount() {
		window.addEventListener('keydown', this.handleKeyDown);
	}

	handleDragEnd({ id, newIndex }) {
		chrome.tabs.move(id, { index: parseInt(newIndex) });
		this.setState({ flushDrop: new Date() });
	}

	handleKeyDown(e) {
		const {
			tabs,
			mode,
			highlightedTabId,
			setHighlightedTabId,
			setModeDefault,
			setModeSearch,
			query,
		} = this.props;

		switch (e.code) {
			case 'ArrowUp':
				e.preventDefault();

				if (highlightedTabId === undefined) {
					setHighlightedTabId(tabs[tabs.length - 1].id);
				} else {
					const currentIndex = tabs.findIndex(tab => tab.id === highlightedTabId);
					const nextHighlightedId = (currentIndex - 1) < 0 ? tabs[tabs.length - 1].id : tabs[currentIndex - 1].id;
					setHighlightedTabId(nextHighlightedId);
				}

				break;
			case 'ArrowDown':
				e.preventDefault();

				if (highlightedTabId === undefined) {
					setHighlightedTabId(tabs[0].id);
				} else {
					const currentIndex = tabs.findIndex(tab => tab.id === highlightedTabId);
					const nextHighlightedId = (currentIndex + 1) > (tabs.length - 1) ? tabs[0].id : tabs[currentIndex + 1].id;
					setHighlightedTabId(nextHighlightedId);
				}

				break;
			case 'Enter':
				goToTab(highlightedTabId);
				break;
			case 'Backspace':
				if (mode === 'search' && query.length === 0) setModeDefault();
				break;
			default:
				setModeSearch();
		}
	}

	render() {
		const { tabs, listView, highlightedTabId, selectedTabIds, selectTab, deselectTab } = this.props;

		return (
			<main className="App">
				<Header />

				<div className="App-content">
					{tabs.length ?
					<TabsList view={listView}>
						{tabs.map(tab => {
							return (
								<TabsListItem
									key={tab.id}
									{...tab}
									flushDrop={this.state.flushDrop}
									highlighted={highlightedTabId === tab.id}
									selected={selectedTabIds.includes(tab.id)}
									onDragEnd={this.handleDragEnd}
									selectTab={selectTab}
									deselectTab={deselectTab}
								/>
							);
						})}
					</TabsList>
					: 'Loading...'}
				</div>
			</main>
		)
	}
}

const mapDispatchToProps = (dispatch) => ({
	setModeSearch() {
		dispatch(setMode('search'));
	},
	setModeDefault() {
		dispatch(setMode('default'));
	},
	setHighlightedTabId(id) {
		dispatch(setHighlightedTabId(id));
	},
	selectTab(id) {
		dispatch(selectTab(id));
	},
	deselectTab(id) {
		dispatch(deselectTab(id));
	},
});

const mapStateToProps = (state) => createStructuredSelector({
	tabs: getVisibleTabs,
	highlightedTabId: getHighlightedTabId,
	mode: getMode,
	query: getQuery,
	listView: getListView,
	selectedTabIds: getSelectedTabIds,
});

export default connect(mapStateToProps, mapDispatchToProps)(App);


// IS THIS NEEDED !?
		// if (e.code === 'OSLeft' ||
		// 	e.code === 'ShiftLeft' ||
		// 	e.code === 'ControLeft' ||
		// 	e.code === 'AltLeft' ||
		// 	e.code === 'OSRight' ||
		// 	e.code === 'ControlRight' ||
		// 	e.code === 'ShiftRight') return false;