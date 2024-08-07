import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface Props {}

const Welcome: React.FC<Props> = () => {
    const [showlog, setShowlog] = React.useState(false);
    return (
        <>
            <Link className="nav-link" to="/info">
                <Layout>
                    {/* <img
                        src="./images/common/bg_cups.png"
                        className="bg_cups"
                        alt=""
                    /> */}

                    {/* <div className="tapbutton">TAP THE SCREEN TO BEGIN</div> */}
                    {/* <div className="centerbox">
                        <img
                            src="./images/common/home_logo.png"
                            className="logo"
                            alt=""
                        />
                        <img
                            src="./images/common/home_text.png"
                            className="welc"
                            alt=""
                        />
                    </div> */}
                </Layout>
            </Link>
        </>
    );
};
const Layout = styled.div`
    background: url("./images/common/home.png");
    background-size: cover;
    background-repeat: no-repeat;
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
    position: relative;
    color: #fff;
    .bg_cups {
        height: 597px;
        position: absolute;
        // top: 312px;
        // left: 50%;
        // transform: translateX(-50%);
    }
    .centerbox {
        // background: rgba(129, 194, 187, 0.6);
        // box-shadow: 0px 3px 6px #00000064;
        position: relative;
        // padding-top: 20px;
        // padding-bottom: 5px;
        z-index: 99;
        width: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        div {
            text-decoration: none !important;
        }
        .logo {
            width: auto;
            height: 70vh;
            display: block;
            margin: auto;
        }
        .welc {
            width: auto;
            height: 10vh;
            display: block;
            margin: 0 auto;
        }
    }

    .tapbutton {
        position: absolute;
        bottom: 38px;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        text-align: center;
    }
`;

export default Welcome;
