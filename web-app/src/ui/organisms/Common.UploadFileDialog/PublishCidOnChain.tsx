import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress} from "@mui/material";
import {useStoreHashGivenIpfs} from "../../../hooks/contracts/CIDMatcher/useStoreHashGivenIpfs";

/**
 *
 * @param {React.PropsWithChildren<IPublishCidOnChain>} props
 * @return {JSX.Element}
 * @constructor
 */
const PublishCidOnChain: React.FC<IPublishCidOnChain> = (props) => {
  const [publish, setPublish] = useState<boolean>(false);

  const storeHashGivenIpfs = useStoreHashGivenIpfs({
    CIDList: [props.cid]
  })

  const publishTransaction = () => {
    setPublish(true);
    storeHashGivenIpfs.write();
  }

  useEffect(() => {
    if (storeHashGivenIpfs.completed)
      props.onComplete();
  }, [storeHashGivenIpfs.completed]);

  return (
    <Box width={150} ml={6}>
      {
        !publish ?
          <Button variant="outlined"
                  onClick={publishTransaction}
                  sx={{textTransform: "none"}}>
            Publish CID
          </Button>
          :
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <CircularProgress size={24}/>
          </Box>
      }

    </Box>
  );
};

export interface IPublishCidOnChain {
  cid: string,
  onComplete: () => void
}

export default PublishCidOnChain;
