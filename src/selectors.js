import { createSelector } from "reselect";

const selectJsonData = (state) => {
  try {
    return JSON.parse(state);
  } catch (error) {
    return null;
  }
};

const selectUserData = (state) => selectJsonData(state.auth.userData) || [];
const SelectclubList = (state) => selectJsonData(state.clubList.clubs) || [];
const SelectConversations = (state) =>
  selectJsonData(state.conversations.conversations) || [];
const SelectuserMessages = (state) => state.userMessages.messages || [];
const SelectcontactList = (state) => state.contactList.contacts || [];
const SelectgroupList = (state) => state.groupList.groups || [];

export const memoizedSelectUserData = createSelector(
  [selectUserData],
  (userData) => userData
);

export const memoizedSelectclubList = createSelector(
  [SelectclubList],
  (clubs) => clubs
);

export const memoizedConversations = createSelector(
  [SelectConversations],
  (conversations) => conversations
);

export const memoizeduserMessages = createSelector(
  [SelectuserMessages],
  (userMessages) => userMessages
);

export const memoizedcontactList = createSelector(
  [SelectcontactList],
  (contactList) => contactList
);

export const memoizedgroupList = createSelector(
  [SelectgroupList],
  (groupList) => groupList
);
