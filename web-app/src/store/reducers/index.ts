import {combineReducers} from "redux";
import {ErrorsEnum} from "../../utils/ProjectTypes/Errors.enum";
import {CIDReducer, cidReducerSlice} from "./cid";

interface RootReducer {
  cid: CIDReducer,
}

const rootReducer = combineReducers<RootReducer>({
  cid: cidReducerSlice.reducer,
});

export default rootReducer;




/** -- DEFINE THE BASE REDUCER -- */

/**
 * Basic reducer interface, with members common to all reducers
 */
export interface BaseReducer {
  dispatchError?: DispatchError | undefined
}

/**
 * Single error element, in response to a specific dispatch action
 *
 * @property {string} code - custom internal code
 * @property {string} message - customer error message
 * @property {string} action - the action that caused this error
 */
export interface DispatchError {
  code?: ErrorsEnum | string,
  message: string,
  action: string
}


