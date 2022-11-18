import React, {ChangeEvent, useEffect, useState} from 'react';
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
    if (e && e.key === 'Enter'){
      if (props.onEnterPressed)
        props.onEnterPressed(value);
    }
  }


  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    fileToHash(file).then((hash: string) => {
      onChange("0x" + hash);
      props.onEnterPressed("0x" + hash);
    });
  }

  /**
   * Generates the sha-256 hash of a given File
   *
   * @param {File} file - the file you want the hash
   */
  const fileToHash = async (file: File): Promise<string> => {
    // get byte array of file
    let buffer = await file.arrayBuffer();
    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // convert bytes to hex string
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }


  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 500 }}
    >
      <IconButton sx={{ p: '10px' }} aria-label="menu" onClick={() => onKeyUp({key: "Enter"})}>
        <Search />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search by Sha-256 hash or CID"
        value={value}
        onChange={(e => onChange(e.target.value))}
        onKeyUp={onKeyUp}
        inputProps={{
          onKeyDown: (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          },
        }}
      />

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: '10px' }} component="label">
        <input hidden type="file" onChange={onFileSelected}/>
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
 * @param {[function]} onEnterPressed - called when the user press the Enter button to search - passes the search value
 */
export interface ISearchBar {
  forcedValue: string,
  onChange: (input: string) => void,
  onEnterPressed?: (searchValue: string) => void
}

export default SearchBar;
