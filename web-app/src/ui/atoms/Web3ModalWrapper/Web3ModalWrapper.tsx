import React from 'react';
import {ConnectKitButton} from "connectkit";
import {useConnect} from "wagmi";

/**
 * This component gets any onClick event on children components and shows the modal to connect to a provider
 *
 * @param {React.PropsWithChildren<IWeb3ModalWrapper>} props
 * @return {JSX.Element}
 * @constructor
 */
const Web3ModalWrapper: React.FC<IWeb3ModalWrapper> = (props) => {

  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();


  return (
      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, hide, address, ensName }) => {
          return (
            // <div onClick={props.disabled ? ()=>{} : () => {connect({connector: connectors[0]})}}>
            <div onClick={props.disabled ? ()=>{} : show }>
              {props.children}
            </div>
          );
        }}
      </ConnectKitButton.Custom>
  );
};


export interface IWeb3ModalWrapper {
  disabled?: boolean,
  children?: React.ReactNode
}

export default Web3ModalWrapper;


