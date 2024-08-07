import * as React from "react";
import styled from "styled-components";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import axios from "axios";
import { LayoutCenter, LayoutFooter, Layouttop } from "../../styles";

interface Props {}

const Choose: React.FC<Props> = () => {
    const [pagetype, setPagetype] = React.useState("choose_type");
    //choose_color choose_type
    const {
        selectedItem,
        setSelectedItem,
        inventoryDetails,
        setInventoryDetails,
        setUsagetime,
        usagetime,
    } = React.useContext(MyContext);

    React.useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/fetchinventory`, {
                params: {
                    type: selectedItem.type,
                },
            })
            .then((response) => {
                setInventoryDetails(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [selectedItem.type]);
    console.log("inventoryDetails", inventoryDetails);

    return (
        <>
            <Layout>
                <Layouttop>
                    <div className="heading">
                        {pagetype === "choose_type" && "CHOOSE YOUR ITEM"}
                        {pagetype === "choose_color" && "CHOOSE COLOR"}
                    </div>
                </Layouttop>

                <LayoutCenter
                    style={{
                        position: "relative",
                        minHeight: "unset",
                        marginTop: "-40px",
                    }}
                >
                    {pagetype === "choose_type" && (
                        <RowBox>
                            {["30oz", "40oz", "iceflow"].map((item, index) => {
                                index = index + 1;
                                return (
                                    <div className="col" key={index}>
                                        <div
                                            className={`itemOuter item${index} ${
                                                selectedItem.type === item
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setSelectedItem({
                                                    ...selectedItem,
                                                    type: item,
                                                })
                                            }
                                        >
                                            <img
                                                src={`./images/items/${item}.png`}
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </RowBox>
                    )}
                    {pagetype === "choose_color" && (
                        <RowBox className={`type${selectedItem.type}`}>
                            {inventoryDetails?.map((item, index) => {
                                index = index + 1;
                                return (
                                    <div className="col" key={index}>
                                        <div
                                            className={`itemOuter item${index} ${
                                                selectedItem.color ===
                                                item.img_name
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setSelectedItem({
                                                    ...selectedItem,
                                                    color: item.img_name,
                                                })
                                            }
                                        >
                                            <img
                                                src={`./images/items/${item.item_name}/${item.img_name}.png`}
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </RowBox>
                    )}
                </LayoutCenter>
                {pagetype === "choose_type" && (
                    <LayoutFooter>
                        <Link className="nav-link" to="/info">
                            <button
                                className="btnglobal"
                                // style={{ opacity: 0 }}
                            >
                                <img
                                    src="images/common/button_back.png"
                                    alt=""
                                />
                            </button>
                        </Link>
                        <div className="btncenter">
                            <img src="images/common/logo.png" alt="" />
                        </div>
                        <button
                            className="enter_button btnglobal"
                            style={
                                !selectedItem.type
                                    ? { pointerEvents: "none", opacity: 0.8 }
                                    : null
                            }
                            onClick={() => setPagetype("choose_color")}
                        >
                            <img src="images/common/button_next.png" alt="" />
                        </button>
                    </LayoutFooter>
                )}

                {pagetype === "choose_color" && (
                    <LayoutFooter>
                        <button
                            className="btnglobal"
                            onClick={() => setPagetype("choose_type")}
                        >
                            <img src="images/common/button_back.png" alt="" />
                        </button>
                        <div className="btncenter">
                            <img src="images/common/logo.png" alt="" />
                        </div>
                        <button
                            className="enter_button btnglobal"
                            style={
                                !selectedItem
                                    ? { pointerEvents: "none", opacity: 0.8 }
                                    : null
                            }
                        >
                            <Link className="nav-link" to="/customize">
                                <img
                                    src="images/common/button_next.png"
                                    alt=""
                                />
                            </Link>
                        </button>
                    </LayoutFooter>
                )}
            </Layout>
        </>
    );
};
const RowBox = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    // flex-flow: nowrap;
    padding: 0 44px;
    box-sizing: border-box;
    margin-top: -20px;

    .col {
        display: flex;
        align-items: center;
        justify-content: center;
        .itemOuter {
            cursor: pointer;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            &.active {
                background: url(/images/common/highlightchoose.png) !important;
                background-size: contain !important;
                background-repeat: no-repeat !important;
            }
            width: auto;
            height: 510px;
            width: 345px;

            margin: 0px -17px;
            margin-bottom: unset;
            img {
                object-fit: contain;
                height: 92%;
                position: relative;
            }
        }
    }
    &.type30oz {
        margin-top: -61px;
        .col {
            .itemOuter {
                width: 300px !important;
                height: 443px !important;
                margin: 0px -40px;
            }
        }
    }
    &.type40oz {
        margin-top: -61px;
        .col {
            .itemOuter {
                width: 260px !important;
                height: 380px !important;
                margin: 0px -40px;
            }
        }
    }
    &.typeiceflow {
        margin-top: -30px;
        .col {
            .itemOuter {
                width: 367px !important;
                height: 500px !important;
                margin: 0px -14px;
            }
        }
    }
`;
const Layout = styled.div`
    // background: #57c2dc;
    background: url("./images/common/bg.png");
    background-size: calc(100% - 20px) calc(100% - 20px);
    background-position: center center;
    background-repeat: no-repeat;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
    height: 100%;
    .heading {
        font-size: 52px;
        color: #1e1e1e;
        margin: 0;
        margin-bottom: 2.7vh;
        .red {
            color: #d94e3a;
        }
    }
    .limited {
        color: #000;
        position: absolute;
        font-size: 14px;
        right: 36px;
        bottom: 10px;
    }
    .text_choose {
        width: 50%;
        position: relative;
        margin-top: -50px;
    }
`;

export default Choose;
