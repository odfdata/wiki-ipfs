import React, {useState} from 'react';
import {Box, Button} from "@mui/material";
import PublishCidOnChainProgress from "./PublishCidOnChain_Progress";

/**
 *
 * @param {React.PropsWithChildren<IPublishCidOnChain>} props
 * @return {JSX.Element}
 * @constructor
 */
const PublishCidOnChain: React.FC<IPublishCidOnChain> = (props) => {
  const [publish, setPublish] = useState<boolean>(false);

  return (
    <Box width={150}>
      {
        !publish ?
          <Button variant="outlined"
                  onClick={() => setPublish(true)}
                  sx={{textTransform: "none", width: 150, ml: 6}}>
            Publish CID
          </Button>
          :
          <PublishCidOnChainProgress cid={props.cid}/>
      }

    </Box>
  );
};

export interface IPublishCidOnChain {
  cid: string
}

export default PublishCidOnChain;
