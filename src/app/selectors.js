import { createSelector } from 'reselect';
import { sortBy } from './utils.js';

export const getTabs = (state) => state.tabs;
export const getMode = (state) => state.mode;
export const getQuery = (state) => state.query.toLowerCase();
export const getHighlightedTabId = (state) => state.highlightedTabId;
export const getListView = (state) => state.listView;

export const getSortedTabs = createSelector(
	getTabs,
	(tabs) => tabs.length ? sortBy(tabs, 'index') : tabs,
);

export const getVisibleTabs = createSelector(
	[getSortedTabs, getQuery],
	(sortedTabs, query) => {
		if (!query.length) return sortedTabs;
		return sortedTabs.length
			? sortedTabs.filter(tab => {
				if (
					tab.title.toLowerCase().includes(query.toLowerCase()) ||
					tab.url.toLowerCase().includes(query.toLowerCase())
				) return true;
			})
			: sortedTabs;
	},
);

export const getNumTabs = createSelector(
	getTabs,
	(tabs) => tabs.length,
);