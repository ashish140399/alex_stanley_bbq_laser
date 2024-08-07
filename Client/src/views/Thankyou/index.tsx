import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

interface Props {}

const Thankyou: React.FC<Props> = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
        setTimeout(() => {
            console.log("called");
            navigate("/");
            window.location.reload();
        }, 7000);
    }, []);
    return (
        <>
            <Layout>
                {/* <div className="overlay1"></div>
                <div className="overlay2"></div> */}
                {/* <h1>WE LIKE YOUR STYLE!</h1>
                <h2>YOUR STANLEY CREATE PRODUCT WILL BE DONE SOON.</h2>
                <div className="tagsection">
                    <div className="rw">
                        SHARE IT ON INSTAGRAM + TAG US!
                        <br /> @STANLEY_BRAND
                    </div>
                    <div className="rw">
                        SHARE IT ON TIKTOK + TAG US!
                        <br /> @STANLEYBRAND
                    </div>
                </div> */}
                {/* <div className="overlay1">
                    <img
                        src="images/common/text_thank.png"
                        className="text_thank"
                        alt=""
                    />
                </div> */}

                {/* <img
                    src="images/common/text_thankyou.png"
                    className="thank_you"
                    alt=""
                /> */}
                {/* <img
                    src="images/common/logo_front.png"
                    className="logo"
                    alt=""
                /> */}
            </Layout>
        </>
    );
};
const Layout = styled.div`
    background: url("./images/common/thankyou.png");
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    // align-items: center;
    flex-direction: column;
    justify-content: center;
    align-items: Center;
    min-height: 100vh;
    height: 100%;
    text-align: center;
    position: Relative;
    z-index: 10;
    .thank_you {
        width: 80vw;
        position: Relative;
        z-index: 12;
    }
    .text_thank {
        width: 60vw;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -60%);
        z-index: 12;
    }

    .logo {
        width: 300px;
        position: Relative;
        z-index: 12;
        margin-bottom: -90px;
    }
    h1 {
        position: Relative;
        z-index: 10;
        margin: 0;
        font-family: Knockout;
        text-shadow: 0px 3px 6px #00000080;
        font-weight: 500;
        font-size: 90px;
    }
    h2 {
        position: Relative;
        z-index: 10;
        margin: 0;
        font-family: Knockout;
        font-weight: 500;
        font-size: 30px;
        text-shadow: 0px 3px 6px #00000080;
    }
    .tagsection {
        color: #4099af;
        position: Relative;
        z-index: 10;
        font-family: Knockout;
        font-weight: 500;
        margin-top: 30px;
        .rw {
            margin-bottom: 30px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
    .overlay1 {
        position: absolute;
        top: 50%;
        width: 100%;
        left: 0;
        transform: translateY(-50%);
        box-shadow: 0px 3px 6px #00000064;
        height: 50vh;
        background: rgba(255, 255, 255, 0.78);
        z-index: 1;
    }
    .overlay2 {
        position: absolute;
        opacity: 0;
        top: 50%;
        width: 100%;
        left: 0;
        transform: translateY(-50%);
        box-shadow: 0px 3px 6px #00000064;
        height: 403px;
        background: rgba(229, 229, 229, 0.6);
        z-index: 2;
    }
`;

export default Thankyou;
