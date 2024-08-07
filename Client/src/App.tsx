import React, { createContext } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Admin from "./views/Admin";
import Customize from "./views/Customize";
import Info from "./views/Info";
import Thankyou from "./views/Thankyou";
import Welcome from "./views/Welcome";
import styled from "styled-components";
import Choose from "./views/Choose";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// @ts-ignore
export const MyContext = createContext({
    userDetails: {
        firstName: "",
        lastName: "",
        phonenumber: "",
    },
    setUserDetails: (design) => {},
    customizeInfo: {
        selected: "",
        text: {
            value: "",
            font: 1,
        },
        monogram: {
            value: "",
            font: 1,
        },
        graphic: {
            value: null,
        },
    },
    setCustomizeInfo: (design) => {},
    selectedItem: {
        type: "",
        color: "",
    },
    setSelectedItem: (design) => {},
    inventoryDetails: [],
    setInventoryDetails: (design) => {},
    usagetime: { start: new Date(), end: new Date() },
    setUsagetime: (design) => {},
});
function LocationProvider({ children }) {
    return <AnimatePresence>{children}</AnimatePresence>;
}

function RoutesWithAnimation() {
    const location = useLocation();
    console.log(location);

    return (
        <Routes location={location} key={location.key}>
            <Route
                path="/"
                element={
                    // <motion.div
                    //     key="info"
                    //     // initial={{ y: "100vh" }}
                    //     animate={{ y: 0 }}
                    //     exit={{ y: "-100vh" }}
                    // >
                    <Welcome />
                    // </motion.div>
                }
            />
            <Route
                path="/info"
                element={
                    // <motion.div
                    //     key="info"
                    //     initial={{ y: "100vh" }}
                    //     animate={{ y: 0 }}
                    //     exit={{ y: "-100vh" }}
                    //     transition={{ duration: 0.4 }}
                    // >
                    <Info />
                    // </motion.div>
                }
            />
            <Route
                path="/choose"
                element={
                    // <motion.div
                    //     key="info"
                    //     initial={{ y: "100vh" }}
                    //     animate={{ y: 0 }}
                    //     exit={{ y: "-100vh" }}
                    //     transition={{ duration: 0.4 }}
                    // >
                    <Choose />
                    // </motion.div>
                }
            />
            <Route
                path="/customize"
                element={
                    // <motion.div
                    //     key="info"
                    //     initial={{ y: "100vh" }}
                    //     animate={{ y: 0 }}
                    //     exit={{ y: "-100vh" }}
                    //     transition={{ duration: 0.4 }}
                    // >
                    <Customize />
                    // </motion.div>
                }
            />
            <Route
                path="/thankyou"
                element={
                    // <motion.div
                    //     key="info"
                    //     initial={{ y: "100vh" }}
                    //     animate={{ y: 0 }}
                    //     // exit={{ y: "-100vh" }}
                    //     transition={{ duration: 0.4 }}
                    // >
                    <Thankyou />
                    // </motion.div>
                }
            />
            <Route path="/admin" element={<Admin />} />
        </Routes>
    );
}
function App() {
    const [inventoryDetails, setInventoryDetails] = React.useState([]);
    const [selectedItem, setSelectedItem] = React.useState({
        type: "40oz",
        color: "VividViolet",
    });

    const [usagetime, setUsagetime] = React.useState({
        start: new Date(),
        end: new Date(),
    });
    const [customizeInfo, setCustomizeInfo] = React.useState({
        selected: "text",
        text: {
            value: "",
            font: 1,
        },
        monogram: {
            value: "",
            font: 2,
        },
        graphic: {
            value: null,
        },
    });

    const [userDetails, setUserDetails] = React.useState({
        firstName: "",
        lastName: "",
        phonenumber: "",
    });

    // const location = useLocation();
    console.log(window.location.pathname);

    return (
        <MyContext.Provider
            value={{
                userDetails,
                setUserDetails,
                selectedItem,
                setSelectedItem,
                customizeInfo,
                setCustomizeInfo,
                inventoryDetails,
                setInventoryDetails,
                usagetime,
                setUsagetime,
            }}
        >
            {/* {
        window.location.pathname != "/admin" ? <BG className="mybglayout"> <img src="images/pg_bg2.png" className="pg_bg2" alt="" />
          <img src="images/pg_bg1.png" className="pg_bg1" alt="" />
        </BG> : null
      } */}
            {/* <BG className="mybglayout">
                {" "}
                <img src="images/pg_bg2.png" className="pg_bg2" alt="" />
                <img src="images/pg_bg1.png" className="pg_bg1" alt="" />
            </BG> */}
            <ToastContainer />
            <BrowserRouter>
                <LocationProvider>
                    <RoutesWithAnimation />
                </LocationProvider>
            </BrowserRouter>
        </MyContext.Provider>
    );
}

const BG = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vh;
    height: 100vh;
    z-index: -12333;
    .pg_bg1 {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
    }
    .pg_bg2 {
        position: absolute;
        height: calc(100% - 10px);
        left: 50%;
        top: 50%;
        transform: Translate(-50%, -50%);
        object-fit: cover;
        z-index: 4;
    }
`;
export default App;
