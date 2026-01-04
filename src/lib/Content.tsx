import {styled} from "@mui/material";

export const Content = styled('div')`
    display: flex;
    margin-left: 15%;
    margin-right: 15%;
    flex-direction: column;

    @media screen and (max-width: 1080px) {
        margin: 0 5%;
    }

    @media screen and (max-width: 768px) {
        padding: 1% 3% 3% 3%;
        margin: 0;
    }
`

export const Section = styled('div')`
    display: flex;
    gap: 10px;
`

export const SubSection = styled('div')`
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
`