import * as React from "react";
import styled from "styled-components";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import axios from "axios";
import { LayoutCenter, LayoutFooter, Layouttop } from "../../styles";
import { Checkbox } from "@mui/material";

interface Props {}

const Info: React.FC<Props> = () => {
    const [checkbox, setCheckbox] = React.useState(false);
    const { userDetails, setUserDetails, usagetime, setUsagetime } =
        React.useContext(MyContext);
    React.useEffect(() => {
        setUsagetime({
            ...usagetime,
            start: new Date(),
        });
    }, []);
    React.useEffect(() => {
        const handleInputBlur = () => {
            // Scroll to the top of the page
            window.scrollTo({
                top: 0,
                behavior: "smooth", // optional smooth scrolling
            });
        };

        // Add event listener for input blur
        document.addEventListener("blur", handleInputBlur, true);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener("blur", handleInputBlur, true);
        };
    }, []);
    React.useEffect(() => {
        const handleInputBlur = () => {
            // Scroll to the top of the page
            window.scrollTo({
                top: 0,
                behavior: "smooth", // optional smooth scrolling
            });
        };

        // Add event listener for input blur
        document.addEventListener("blur", handleInputBlur, true);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener("blur", handleInputBlur, true);
        };
    }, []);
    const formatPhoneNumber = (input) => {
        const cleaned = input.replace(/\D/g, ""); // Remove non-numeric characters
        const maxLength = 10;

        if (cleaned.length <= 3) {
            return cleaned;
        } else if (cleaned.length <= 6) {
            return `${cleaned.slice(0, 3)}-${cleaned.slice(3, maxLength)}`;
        } else {
            return `${cleaned.slice(0, 3)}-${cleaned.slice(
                3,
                6
            )}-${cleaned.slice(6, maxLength)}`;
        }
    };

    const handleNumberChange = (e) => {
        const inputValue = e.target.value;
        const formattedValue = formatPhoneNumber(inputValue);
        console.log(inputValue, formattedValue);
        setUserDetails((prevState) => ({
            ...prevState,
            phonenumber: formattedValue,
        }));
    };
    console.log("userDetails", userDetails);

    return (
        <>
            <Layout>
                <LayoutCenter
                    style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    <RowBox style={{ marginTop: "-90px" }}>
                        <h3>NAME</h3>

                        <input
                            className="name_input"
                            type="text"
                            placeholder="TYPE YOUR NAME"
                            onChange={(e) =>
                                setUserDetails((prevState) => ({
                                    ...prevState,
                                    firstName: e.target.value,
                                }))
                            }
                        />
                    </RowBox>

                    {/* <RowBox>
                        <h3>PHONE NUMBER</h3>

                        <input
                            className="name_input"
                            type="text"
                            value={userDetails.phonenumber}
                            onChange={handleNumberChange}
                            placeholder="XXX-XXX-XXXX"
                        />
                        <div className="warning">
                            WE WILL SEND YOU A ONE TIME ONLY TEXT TO LET YOU
                            KNOW YOUR ORDER IS READY
                        </div>
                    </RowBox> */}
                    {/* <RowBox>
                        <h3>EMAIL</h3>

                        <input
                            className="name_input"
                            type="text"
                            placeholder="TYPE HERE"
                            onChange={(e) =>
                                setUserDetails((prevState) => ({
                                    ...prevState,
                                    email: e.target.value,
                                }))
                            }
                        />
                        <div className="checkboxx">
                            <Checkbox
                                defaultChecked
                                checked={userDetails.smsfeature}
                                onChange={() =>
                                    setUserDetails((prevState) => ({
                                        ...prevState,
                                        smsfeature: !userDetails.smsfeature,
                                    }))
                                }
                                sx={{
                                    color: "transparent",
                                    border: "2px solid #707070",
                                    borderRadius: 0,
                                    width: 20,
                                    height: 20,
                                    "&.Mui-checked": {
                                        color: "#E34026",
                                    },
                                }}
                            />
                            <div className="txt">
                                CHECK HERE TO OPT-IN TO <br /> BE CONTACTED BY A
                                DEALER
                            </div>
                        </div>
                    </RowBox> */}

                    {/* <RowBox>
                        <h1 className="second">YOUR EMAIL</h1>
                        <input
                            type="text"
                            placeholder="TYPE HERE"
                            onChange={(e) =>
                                setUserDetails((prevState) => ({
                                    ...prevState,
                                    email: e.target.value,
                                }))
                            }
                        />

                        <div className="checkboxx">
                            <Checkbox
                                defaultChecked
                                checked={checkbox}
                                onChange={() => setCheckbox(!checkbox)}
                                sx={{
                                    color: "transparent",
                                    border: "2px solid #707070",
                                    borderRadius: 0,
                                    width: 20,
                                    height: 20,
                                    "&.Mui-checked": {
                                        color: "#E34026",
                                    },
                                }}
                            />
                            <div className="txt">
                                BY PROVIDING MY EMAIL, I AGREE TO RECEIVE
                                OFFERS, PROMOTIONS <br />
                                AND MESSAGES FROM STANLEY AND AGREE TO{" "}
                                {`STANLEY’S`} TERMS AND
                                <br />
                                CONDITIONS
                                (WWW.STANLEY1913.COM/PAGES/TERMS-CONDITIONS).
                                <br />
                                SEE OUR PRIVACY POLICY FOR DETAILS
                                (WWW.STANLEY1913.COM/PAGES/PRIVACY-POLICY)
                            </div>
                        </div>
                    </RowBox> */}
                </LayoutCenter>
                <LayoutFooter className="footerl">
                    <button
                        className="enter_button btnglobal"
                        style={{ opacity: 0 }}
                    >
                        <img src="images/common/button_back.png" alt="" />
                    </button>
                    <div className="btncenter">
                        <img src="images/common/logo.png" alt="" />
                    </div>

                    <button
                        className="enter_button btnglobal"
                        // disabled={
                        //     !userDetails.name || !userDetails.email || !checkbox
                        // }
                        style={
                            !userDetails.firstName
                                ? // || !userDetails.email
                                  // || !checkbox
                                  { pointerEvents: "none", opacity: 0.8 }
                                : null
                        }
                    >
                        <Link className="nav-link" to="/choose">
                            <img src="images/common/button_next.png" alt="" />
                        </Link>
                    </button>
                </LayoutFooter>
            </Layout>
        </>
    );
};
const RowBox = styled.div`
    width: 80vw;
    height: 100%;
    margin: auto;
    margin: 0 auto;
    margin-bottom: 45px;
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    // background: #fff;
    // border: 2px solid #707070;
    // border-radius: 12px;
    // padding: 30px 40px;
    &:last-child {
        margin-bottom: 0;
    }
    h3 {
        // color: #005050;
        font-size: 70px;
        font-weight: 400;
        text-transform: capitalize;
        margin: 0;
        margin-bottom: 24px;
    }

    input {
        width: 100%;
        max-width: 57vw;
        margin: 0;
        // border: 1px solid rgba(0, 0, 0, 0.4);
        // background: transparent;
        box-shadow: none;
        border: 0;
        border-radius: 2px;
        font-size: 64px;
        outline: 0;
        padding: 12px 25px;
        box-sizing: border-box;
        text-align: center;
        font-family: Knockout;
        // border: 1px solid #000000;
        box-shadow: 0px 3px 6px #000000;
        &::placeholder {
            font-family: Knockout;
            color: rgba(0, 0, 0, 0.5);

            font-weight: 300;
        }
    }
    .checkboxx {
        display: flex;
        align-items: flex-start;
        // width: calc(100% + 30px);
        position: relative;
        // left: -15px;
        margin-top: 20px;
        .MuiCheckbox-root {
            transform: scale(1.5);
            margin-right: 16px;
            transform-origin: top;
            border-radius: 3px;
            &.Mui-checked {
                background: #fff;
            }
        }
        .txt {
            color: #000000;
            font-size: 14px;
        }
    }
`;
const Layout = styled.div`
    min-height: 100vh;
    height: 100%;
    background: url("./images/common/bg.png");
    background-size: calc(100% - 20px) calc(100% - 20px);
    background-position: center center;
    background-repeat: no-repeat;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    .warning {
        font-size: 14px;
        color: #000000;
        max-width: 380px;
        text-align: center;
        margin-top: 10px;
    }
    overflow: hidden;
    // .footerl {
    //     height: 120px;
    // }
    // .enter_button {
    //     img {
    //         height: 50px;
    //     }
    // }
`;

export default Info;
