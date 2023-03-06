import React from 'react';
import {Button, SxProps, Theme} from "@mui/material";
import {useWeb3Modal, Web3Button} from "@web3modal/react";

/**
 * This component gets any onClick event on children components and shows the modal to connect to a provider
 *
 * @param {React.PropsWithChildren<IWeb3ModalWrapper>} props
 * @return {JSX.Element}
 * @constructor
 */
const Web3ModalWrapper: React.FC<IWeb3ModalWrapper> = (props) => {

  const { isOpen, open, close, setDefaultChain } = useWeb3Modal();

  const triggerClick = () => {
    open().then(() => {});
  }

  return (
    // <Button onClick={triggerClick}
    //         variant={"outlined"}
    //         sx={{ ...props.sx, boxShadow: 3 }}>
    //   {props.children}
    // </Button>
    <Web3Button/>
      // <ConnectKitButton.Custom>
      //   {({ isConnected, isConnecting, show, hide, address, ensName }) => {
      //     return (
      //       // <div onClick={props.disabled ? ()=>{} : () => {connect({connector: connectors[0]})}}>
      //       <div onClick={props.disabled ? ()=>{} : show }>
      //         {props.children}
      //       </div>
      //     );
      //   }}
      // </ConnectKitButton.Custom>
  );
};


export interface IWeb3ModalWrapper {
  disabled?: boolean,
  children?: React.ReactNode,
  sx?:  SxProps<Theme> | undefined
}

export default Web3ModalWrapper;


