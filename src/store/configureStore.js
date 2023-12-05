import { combineReducers, applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import thunk from 'redux-thunk';
import loginReducer from "../reducers/loginReducer";
import resetReducer from "../reducers/resetSlice";
import clubListReducer from '../reducers/clubListSlice';
import conversationsReducer from '../reducers/conversationSlice';
import chatMessagesReducer from '../reducers/chatMessagesSlice';
import contactListReducer from '../reducers/contactListSlice';
import groupListReducer from '../reducers/groupListSlice';
import tabsReducer from '../reducers/tabsSlice';

const rootReducer = combineReducers({
  auth: loginReducer,
  clubList: clubListReducer,
  conversations: conversationsReducer,
  userMessages: chatMessagesReducer,
  contactList: contactListReducer,
  groupList: groupListReducer,
  tabs: tabsReducer,
});

const store = configureStore({
  reducer: rootReducer,
  // Other store configurations...
  reset: resetReducer,
  middleware: [thunk],
});

export default store;
