import React, {useEffect, useState} from 'react';
import {Divider, IconButton, InputBase, Paper, Tooltip} from "@mui/material";
import {Description, Search} from "@mui/icons-material";

/**
 *
 * @param {React.PropsWithChildren<ISearchBar>} props
 * @return {JSX.Element}
 * @constructor
 */
const SearchBar: React.FC<ISearchBar> = (props) => {

  const [value, setValue] = useState<string>("");

  useEffect(() => {
    onChange(props.forcedValue);
  }, [props.forcedValue])

  const onChange = (newValue: string) => {
    setValue(newValue);
    props.onChange(newValue);
  }

  /**
   * Calls the function once the enter button is pressed
   * @param e
   */
  const onKeyUp = (e) => {
    console.log(e.key);
    if (e && e.key === 'Enter'){
      e.preventDefault();
      if (props.onEnterPressed)
        props.onEnterPressed();
    }
  }

  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 500 }}
    >
      <IconButton sx={{ p: '10px' }} aria-label="menu">
        <Search />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search by Sha-256 hash or CID"
        value={value}
        onChange={(e => onChange(e.target.value))}
        onKeyUp={onKeyUp}
        inputProps={{
          onSubmit: (e) =>  {e.preventDefault();},
          onSubmitCapture: (e) =>  {e.preventDefault();},
        }}
      />

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: '10px' }} >
        <Tooltip title={"Select file to search"}>
          <Description />
        </Tooltip>
      </IconButton>
    </Paper>
  );
};

/**
 * @param {string} forcedValue - when passed, this is the value that's overwritten in the state handling the content of the search Input
 * @param {function} onChange - triggered everytime the input changes
 * @param {[function]} onEnterPressed - called when the user press the Enter button to search
 */
export interface ISearchBar {
  forcedValue: string,
  onChange: (input: string) => void,
  onEnterPressed?: () => void
}

export default SearchBar;
