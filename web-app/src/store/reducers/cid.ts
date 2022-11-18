import {BaseReducer} from "./index";
import {createSlice} from "@reduxjs/toolkit";
import {clearError} from "../actions/basicActions";
import {setSearchCIDorHash} from "../actions/cidActions";

/** -- DEFINITIONS */

/**
 * Define the shape of the reducer, by specifying the type of element accepted in each reducer elements
 *
 * @param {string} searchCIDorHash - CID or hash user is searching
 *
 */
export interface CIDReducer extends BaseReducer {
  searchCIDorHash: string
}


/** -- INITIAL STATE */

const initialState: CIDReducer = {
  searchCIDorHash: ""
};



/** --- CREATE THE REDUCER */

export const cidReducerSlice = createSlice({
  name: 'cid',
  initialState,
  reducers: {
    clearError,
    setSearchCIDorHash
  }
})

export const cidReducerActions = {
  clearError: cidReducerSlice.actions.clearError,
  setSearchCIDorHash: cidReducerSlice.actions.setSearchCIDorHash
}

export default cidReducerSlice.reducer
