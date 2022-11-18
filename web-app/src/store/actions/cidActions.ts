import {CaseReducer, PayloadAction} from "@reduxjs/toolkit";
import {CIDReducer} from "../reducers/cid";


/** -- ACTIONS */


/**
 * Sets the Search CID
 * @param {Draft<CIDReducer>} state
 * @param {PayloadAction<string>} action
 */
export const setSearchCIDorHash: CaseReducer<CIDReducer, PayloadAction<string>> =
  (state, action) => {
    state.searchCIDorHash = action.payload;
}
