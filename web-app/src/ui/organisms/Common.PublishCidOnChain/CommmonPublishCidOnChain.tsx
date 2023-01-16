import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, Typography} from "@mui/material";
import {useRequestCid2Hash} from "../../../hooks/contracts/CID2HashOracleLogic/useRequestCid2Hash";
import {theme} from "../../../GlobalStyles";

/**
 *
 * @param {React.PropsWithChildren<ICommonPublishCidOnChain>} props
 * @return {JSX.Element}
 * @constructor
 */
const CommmonPublishCidOnChain: React.FC<ICommonPublishCidOnChain> = (props) => {
  const [publish, setPublish] = useState<boolean>(false);

  const storeHashGivenIpfs = useRequestCid2Hash({
    CIDList: [props.cid]
  })

  const publishTransaction = () => {
    setPublish(true);
    storeHashGivenIpfs.write();
  }

  useEffect(() => {
    if (storeHashGivenIpfs.completed) {
      setPublish(false);
      props.onComplete();
    }
  }, [storeHashGivenIpfs.completed]);

  useEffect(() => {
    if (storeHashGivenIpfs.error) {
      setPublish(false);
    }
  }, [storeHashGivenIpfs.error]);

  return (
    <Box width={150} ml={6}>
      {
        !publish ?
          <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
            <Button variant="outlined"
                    onClick={publishTransaction}
                    sx={{textTransform: "none"}}>
              Publish CID
            </Button>
            {
              storeHashGivenIpfs.error ?
                <Typography color={theme.palette.error.main} variant="body2" sx={{mt: 1}}>
                  {storeHashGivenIpfs.error.startsWith("user rejected transaction") ? "Transaction refused" : ""}
                </Typography>
                :
                ""
            }
          </Box>
          :
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <CircularProgress size={24}/>
          </Box>
      }

    </Box>
  );
};

export interface ICommonPublishCidOnChain {
  cid: string,
  onComplete: () => void
}

export default CommmonPublishCidOnChain;
