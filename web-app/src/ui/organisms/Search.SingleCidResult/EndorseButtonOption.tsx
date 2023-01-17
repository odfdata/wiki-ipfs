import React, {useEffect} from 'react';
import {Box, Button, CircularProgress, Typography} from "@mui/material";
import {theme} from "../../../GlobalStyles";
import {useEndorseCIDList} from "../../../hooks/contracts/EndorseCIDRegistry/useEndorseCIDList";
import {FoundCid} from "../../pages/Search/Search";
import {useOpposeCIDList} from "../../../hooks/contracts/EndorseCIDRegistry/useOpposeCIDList";
import {CheckCircleOutline} from "@mui/icons-material";
import {useGetEndorseStatus} from "../../../hooks/contracts/EndorseCIDRegistry/useEndorseStatus";
import {useAccount} from "wagmi";

/**
 *
 * @param {React.PropsWithChildren<IEndorseButtonOption>} props
 * @return {JSX.Element}
 * @constructor
 */
const EndorseButtonOption: React.FC<IEndorseButtonOption> = (props) => {

  const account = useAccount();
  const isEndorsing = useGetEndorseStatus({
    CID: props.cid.cid,
    endorser: account.address
  })
  const endorseCidList = useEndorseCIDList({CIDList: [props.cid.cid]});
  const opposeCidList = useOpposeCIDList({CIDList: [props.cid.cid]});

  useEffect(() => {
    if (endorseCidList.completed || opposeCidList.completed) {
      isEndorsing.refetch();
      props.refetchNumberOfEndorser();
    }
  }, [endorseCidList.completed, opposeCidList.completed])

  return (
    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
      {
        isEndorsing.completed && isEndorsing.result ?
          <React.Fragment>
            <Box display={"flex"}>
              <CheckCircleOutline sx={{color: theme.palette.success.dark, fontSize: 16}}/>
              <Typography variant={"body2"} sx={{marginLeft: 0.5}} color={theme.palette.success.dark}>
                You're endorsing this CID
              </Typography>
            </Box>
            <Button variant={"outlined"}
                    size={"small"}
                    color={"warning"}
                    sx={{fontSize: 10, marginLeft: 2, paddingX: 1}}
                    onClick={() => opposeCidList?.write()}>
              Oppose
            </Button>
          </React.Fragment>
          :
          ""
      }

      {
        isEndorsing.completed && !isEndorsing.result ?
          <Button variant={"outlined"}
                  size={"small"}
                  sx={{fontSize: 10, paddingX: 1}}
                  onClick={() => endorseCidList?.write()}>
            Endorse
          </Button>
          :
          ""
      }

      {
        !isEndorsing.completed ?
          <CircularProgress/>
          :
          ""
      }

    </Box>
  );
};

/**
 * @param {FoundCid} cid - the cid of the box
 * @param {() => void} refetchNumberOfEndorser - call to force a refetch of th enumber of endorser
 */
export interface IEndorseButtonOption {
  cid: FoundCid,
  refetchNumberOfEndorser: () => void
}

export default EndorseButtonOption;
