import styled from "styled-components";

export const Layouttop = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    position: absolute;
    top: 0px;
    // background: #fff;
    padding: 20px 24px;
    box-sizing: border-box;
    font-size: 65px;
    // height: 80px;
    // box-shadow: 0px 6px 6px #0000007e;
    z-index: 1;
    transform: translateY(30px);
    .logo {
        height: 40px;
        width: auto;
    }
    .text_heading {
        // color: #005050;
        position: relative;
        top: 10px;
        width: auto;
        font-size: 65px;
        font-weight: 400;
        // margin-bottom: -30px;
        text-transform: uppercase;
    }
`;
export const LayoutFooter = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: -webkit-fill-available;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0 34px 29px 34px;
    box-sizing: border-box;
    .logo_btm {
        height: 42px;
        width: auto;
        position: absolute;
        left: 50%;
        transform: translateX(-50%) translateY(-8px);
    }
    button {
        margin-bottom: 0px;
    }
    .center_button {
        position: relative;
        top: 5px;
        margin-bottom: unset;
        height: 120px;
        img {
            height: 120px;
            width: auto;
        }
    }
    .btncenter {
        height: 60px;
        position: relative;
        img {
            height: 160px;
            position: absolute;
            bottom: 0;
            transform: translateX(-50%);
            left: 50%;
        }
    }
`;

export const LayoutCenter = styled.div`
    // background: rgba(225, 225, 225, 0.78);
    // box-shadow: 0px 3px 6px #00000064;
    // min-height: 53vh;
    width: 100%;
    padding: 0px 0;
`;
