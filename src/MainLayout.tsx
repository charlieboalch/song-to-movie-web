import {Outlet, useNavigate} from "react-router";
import {Button, styled, Typography} from "@mui/material";
import {Content} from "./lib/Content.tsx";

const Navbar = styled('div')`
    display: flex;
    justify-content: space-between;
    height: 5vh;
    padding: 10px 5%;
    margin-bottom: 10px;
    align-items: center;
`

const Flex = styled('div')`
    display: flex;
    gap: 20px;
`

export const MainLayout = () => {
    const navigate = useNavigate()

    return <>
        <Navbar>
            <Typography variant={'h6'}>My Website</Typography>
            <Flex>
                <Button onClick={() => navigate('/')}>
                    <Typography variant={'body1'}>Home</Typography>
                </Button>
                <Button onClick={() => navigate('/about')}>
                    <Typography variant={'body1'}>About</Typography>
                </Button>
            </Flex>
        </Navbar>
        <Content>
            <Outlet />
        </Content>
    </>
}