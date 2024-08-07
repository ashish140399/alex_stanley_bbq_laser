import React, { useEffect, useRef, useState, useContext } from "react";
import styled from "styled-components";
import { fabric } from "fabric";
import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import LoaderAnimation from "../components/LoaderAnimation";
import axios from "axios";
import { LayoutCenter, LayoutFooter, Layouttop } from "../../styles";
import { text } from "stream/consumers";
import opentype from "opentype.js";
import {
    fontlist,
    fontlistmonogram,
    fontlistmonogramlcr,
    productname,
} from "../../const/font";
interface Props {}

const Customize: React.FC<Props> = () => {
    const [showloader, setShowloader] = useState(false);
    const [canvas, setCanvas] = useState(null);
    const navigate = useNavigate();
    const [designfinalised, setDesignfinalised] = useState(false);
    const [objectadding, setObjectadding] = useState(true);
    const [showhowitwork, setShowhowitwork] = useState(false);
    const [canvaspreview, setCanvaspreview] = useState("");

    const {
        userDetails,
        setUserDetails,
        selectedItem,
        inventoryDetails,
        setSelectedItem,
        customizeInfo,
        setUsagetime,
        usagetime,
        setCustomizeInfo,
    } = useContext(MyContext);

    async function fetchFontAndConvertToBase64(fontUrl) {
        const response = await fetch(fontUrl);
        const fontBlob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(fontBlob);
        });
    }

    const [loadedFonts, setLoadedFonts] = useState({});
    const [canvastextfont1, setCanvastextfont1] = useState({
        font1: 58,
        font2: 50,
    });
    // const [canvastextfont1, setCanvastextfont1] = useState({
    //     font1: 30,
    //     font2: 18,
    // });

    const [graphicImageURL, setGraphicImageURL] = useState("");
    const fontNames = [
        "HelveticaNeue.ttf",
        "DancingScript.ttf",
        "DMSerifDisplay.ttf",
        "Graduate.ttf",
        "OswaldM.ttf",
        "RobotoSlab.ttf",
        "MONOGRAMOS left.otf",
        "MONOGRAMOS center.otf",
        "MONOGRAMOS right.otf",
        "Knockout.otf",
        "DUMB.otf",
        "Rodge-Regular.ttf",
        "Themadi.otf",
        "Free-monogram.otf",
    ];
    const fontFamilies = [
        "HelveticaNeue",
        "DancingScript",
        "DMSerifDisplay",
        "Graduate",
        "OswaldM",
        "RobotoSlab",
        "MONOGRAMOS_left",
        "MONOGRAMOS_center",
        "MONOGRAMOS_right",
        "Knockout",
        "DUMB",
        "Rodge-Regular",
        "Themadi",
        "Free-monogram",
    ];
    useEffect(() => {
        // const fontURL = "path_to_your_fonts_directory";  // Please replace with your actual fonts directory path
        var fontURL = "https://familyindustriesapps.com/Servers/Sleigh/fonts";
        const promises = fontNames.map((fontName, index) => {
            // console.log(fontName, index);
            return new Promise((resolve) => {
                opentype.load(`${fontURL}/${fontName}`, (err, font) => {
                    if (err) {
                        console.error(`Error loading font ${fontName}:`, err);
                        resolve(null);
                    } else {
                        resolve({ [fontFamilies[index]]: font });
                    }
                });
            });
        });

        Promise.all(promises).then((fonts) => {
            const fontsObject = fonts.reduce(
                // @ts-ignore
                (acc, font) => ({ ...acc, ...font }),
                {}
            );
            setLoadedFonts(fontsObject);
        });
    }, []);
    console.log("loadedFonts", loadedFonts);

    // async function embedAllFonts(fontURL) {
    //     let fontFaceCSS = "";

    //     for (let i = 0; i < fontNames.length; i++) {
    //         const base64String = await fetchFontAndConvertToBase64(
    //             `${fontURL}/fonts/${fontNames[i]}`
    //         );
    //         fontFaceCSS += `
    //           @font-face {
    //               font-family: ${fontFamilies[i]};
    //               src: url('${base64String}');
    //           }
    //       `;
    //     }

    //     return fontFaceCSS;
    // }

    // const includeFonts = async () => {
    //     var fontURL = "https://familyindustriesapps.com/stanley_serve";

    //     const css = await embedAllFonts(fontURL);
    //     const fontFace = `
    //     <defs>
    //         <style type="text/css">
    //             ${css}
    //         </style>
    //     </defs>`;
    //     return fontFace;
    // };

    async function getImageAsBase64(url) {
        const response = await fetch(url);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    async function replaceImageURLWithBase64(svgString) {
        // Extract the URL from the SVG string
        const imageUrlRegex = /xlink:href="([^"]+)"/;
        const match = svgString.match(imageUrlRegex);
        if (match && match[1]) {
            const imageUrl = match[1];

            // Get the Base64 encoded image
            const base64Image = await getImageAsBase64(imageUrl);

            // Replace the URL with the Base64 encoded image in the SVG string
            svgString = svgString.replace(imageUrl, base64Image);
        }
        return svgString;
    }

    // function base64ToSVG(base64, width, height) {
    //     return `
    //     <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    //       <image href="${base64}" width="${width}" height="${height}"/>
    //     </svg>
    //   `;
    // }

    useEffect(() => {
        if (canvas) {
            var canvaspng = canvas.toDataURL({ format: "png", multiplier: 5 });
            setCanvaspreview(canvaspng);
        }
    }, [designfinalised]);
    const downloadimage = async () => {
        const objectarray = canvas.getObjects();
        if (customizeInfo.selected === "text") {
            await trimCanvasToText();
        }
        // if (
        //     customizeInfo.selected === "text" ||
        //     customizeInfo.selected === "monogram"
        // ) {
        //     objectarray.forEach((object) => {
        //         object.set("fill", "#000");
        //     });
        //     // canvas.renderAll();
        // } else {
        //     objectarray.forEach((object) => {
        //         object.set("fill", "#000");
        //     });
        // }
        objectarray.forEach((object) => {
            object.set("fill", "#000");
        });
        if (customizeInfo.selected === "graphic") {
            // canvas.getObjects("graphic").forEach((obj) => {
            //     canvas.remove(obj);
            // });

            // Update the URL based on your logic
            let newGraphicURL = `images/graphic/${customizeInfo["graphic"].value}.svg`;

            await generateGraphicImage(newGraphicURL);
            // canvas.renderAll();
        }
        console.log("objectarray", objectarray);
        setShowloader(true);
        // var dataURLpng = canvas.toDataURL({
        //     format: "png",
        //     quality: 10,
        //     multiplier: 6,
        // });
        // const modifiedSVG = base64ToSVG(
        //     dataURLpng,
        //     canvas.width,
        //     canvas.height
        // );
        // console.log(modifiedSVG);

        // console.log("dataURLpng", dataURLpng);
        var modifiedSVG = canvas.toSVG();
        // console.log(dataURL);
        // let modifiedSVG;

        // console.log(modifiedSVG);

        // var blob = new Blob([dataURL], {
        //     type: "image/svg+xml;charset=utf-8",
        // });
        // var url = URL.createObjectURL(blob);

        // var link = document.createElement("a");
        // link.download = `canvas.svg`;
        // link.href = url;
        // link.click();

        // if (customizeInfo.selected === "graphic") {
        //     modifiedSVG = await replaceImageURLWithBase64(dataURL);
        // } else {
        //     modifiedSVG = await dataURL;
        // }

        // modifiedSVG = await dataURL;

        // var blob = new Blob([modifiedSVG], {
        //     type: "image/svg+xml;charset=utf-8",
        // });
        // var url = URL.createObjectURL(blob);

        // var link = document.createElement("a");
        // link.download = `canvas.svg`;
        // link.href = url;
        // link.click();
        //         if (dataURL) {
        //             navigate("/thankyou");
        //         }
        //         console.log({
        //             name: userName,
        //             size: selectedSize,
        //             canvasuri: dataURL,
        //         });
        // console.log(modifiedSVG);
        setUsagetime({
            ...usagetime,
            end: new Date(),
        });

        const timeDifference =
            usagetime.start.getTime() - usagetime.end.getTime();
        console.log("timeDifference", timeDifference);
        // console.log(
        //     "LLOGGGGGGGGGGGGGGGGG",
        //     JSON.stringify(userDetails),
        //     selectedItem,
        //     // customizeInfo["graphic"].value.toString(),
        //     JSON.stringify(modifiedSVG),
        //     timeDifference
        // );
        const itemdetails = {
            selectedtype: customizeInfo.selected,
            selectedgraphic: customizeInfo["graphic"].value,
        };
        console.log("itemdetails", itemdetails);
        axios
            .post(`${process.env.REACT_APP_API_URL}/api/savesvg`, {
                userDetails: JSON.stringify(userDetails),
                itemname: selectedItem,
                // graphicname: customizeInfo["graphic"].value.toString(),
                canvasuri: modifiedSVG,
                timeDiff: timeDifference,
                itemdetails: JSON.stringify(itemdetails),
            })
            .then((response) => {
                console.log(response.data);
                setShowloader(false);

                navigate("/thankyou");
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const canvasRef = useRef(null);

    const rightWrapperRef = useRef(null);

    // creates and saves the canvas element
    useEffect(() => {
        if (canvas) {
            canvas.dispose();
            setCanvas(null);
        }
    }, [customizeInfo.selected]);

    // creates and saves the canvas element
    useEffect(() => {
        setCustomizeInfo((prevState) => ({
            ...prevState,
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
        }));
    }, [customizeInfo.selected]);

    useEffect(() => {
        let canvasWidth, canvasHeight;
        if (customizeInfo.selected === "text") {
            canvasWidth = 60;
            canvasHeight = 150;
        } else if (customizeInfo.selected === "monogram") {
            canvasWidth = 150;
            canvasHeight = 150;
        } else if (customizeInfo.selected === "graphic") {
            canvasWidth = 100;
            canvasHeight = 180;
        }

        setCanvas(
            new fabric.Canvas("demo", {
                targetFindTolerance: 5,
                width: canvasWidth,
                height: canvasHeight,
            })
        );
    }, [customizeInfo.selected]);
    const trimCanvasToText = () => {
        if (canvas) {
            const pathObject = canvas.item(0); // Assuming the path object is the first item added to the canvas
            if (pathObject && pathObject.type === "path") {
                const boundingBox = pathObject.getBoundingRect();

                // Adjust the canvas size
                // canvas.setWidth(boundingBox.width); // Uncomment if you also want to adjust the width
                canvas.setHeight(boundingBox.height + 40);

                // Render the changes
                canvas.renderAll();
            }
        }
    };
    // For text
    useEffect(() => {
        if (canvas) {
            if (objectadding) {
                const objectarray = canvas.getObjects();

                let textstr;

                if (customizeInfo["text"].font === 5) {
                    let text = customizeInfo["text"].value.toLowerCase();
                    textstr = text.charAt(0).toUpperCase() + text.slice(1);
                } else {
                    textstr = customizeInfo["text"].value.toUpperCase();
                }

                let fontToUse =
                    loadedFonts[fontlist[customizeInfo["text"].font]];

                if (!fontToUse) {
                    console.error("Font not loaded or not found.");
                    return;
                }

                let pathObject, pathData;

                if (customizeInfo.selected === "graphic") {
                    pathData = fontToUse
                        .getPath(
                            textstr,
                            0,
                            0,
                            customizeInfo["text"].font === 5 ? 22 : 16
                        )
                        .toPathData();
                    pathObject = new fabric.Path(pathData, {
                        fill: "#A5A5A5",
                        angle: 0,
                    });
                    canvas.centerObject(pathObject);
                    pathObject.set({
                        top: 120, // Adjust the positioning as needed
                    });
                } else {
                    pathData = fontToUse
                        .getPath(
                            textstr,
                            0,
                            0,
                            customizeInfo["text"].font === 5
                                ? canvastextfont1.font1
                                : canvastextfont1.font2
                        )
                        .toPathData();
                    pathObject = new fabric.Path(pathData, {
                        fill: "#A5A5A5",
                        angle: 90,
                    });
                    canvas.centerObject(pathObject);
                    // pathObject.set({
                    //     top: 20, // Adjust the positioning as needed
                    // });
                    // Set the font size based on width
                    const textWidth = pathObject.width;
                    const canvasWidth = canvas.height;
                    const desiredWidth = canvasWidth - 40;
                    // 264 canvas height
                    let newFontSize =
                        (desiredWidth / textWidth) *
                        (customizeInfo["text"].font === 5
                            ? canvastextfont1.font1
                            : canvastextfont1.font2);
                    console.log(
                        "text widths",
                        textWidth,
                        canvasWidth,
                        desiredWidth,
                        newFontSize
                    );
                    if (
                        customizeInfo["text"].font === 5 &&
                        newFontSize < 58 &&
                        newFontSize != canvastextfont1.font1
                    ) {
                        setCanvastextfont1((prevState) => ({
                            ...prevState,
                            font1: newFontSize,
                        }));
                    } else if (
                        newFontSize < 50 &&
                        newFontSize != canvastextfont1.font2
                    ) {
                        setCanvastextfont1((prevState) => ({
                            ...prevState,
                            font2: newFontSize,
                        }));
                    }
                    pathObject.set("fontSize", newFontSize);
                }
                // Remove existing text
                canvas.getObjects("text").forEach((obj) => {
                    canvas.remove(obj);
                });

                pathObject.set("type", "text");
                canvas.add(pathObject);
            }
        }
    }, [customizeInfo["text"], loadedFonts, canvastextfont1]);

    console.log("customizeInfo", customizeInfo);
    // For monogram
    useEffect(() => {
        if (canvas) {
            if (objectadding) {
                const objectarray = canvas.getObjects();
                objectarray.forEach(function (object) {
                    canvas.remove(object);
                });
                // if (customizeInfo["monogram"].font === 3) {
                //     setCustomizeInfo((prevState) => ({
                //         ...prevState,
                //         monogram: {
                //             ...prevState.monogram,
                //             value: "",
                //         },
                //     }));
                //     canvas.clear();
                // }
                const text = customizeInfo["monogram"].value.toUpperCase();
                const characters = text.split("");

                characters.forEach((char, index) => {
                    let charPathData;
                    let options;
                    let fontToUse =
                        loadedFonts[fontlist[customizeInfo["monogram"].font]];

                    if (!fontToUse) {
                        console.error("Font not loaded or not found.");
                        return;
                    }
                    if (customizeInfo["monogram"].font === 1) {
                        // charPathData = loadedFonts[
                        //     fontlistmonogramlcr[index + 1]
                        // ]
                        //     .getPath(char, 0, 0, 88)
                        //     .toPathData();

                        // let charPath = new fabric.Path(charPathData, {
                        //     fill: "#A5A5A5",
                        // });
                        // canvas.add(charPath);
                        // canvas.centerObject(charPath);

                        // charPath.set({
                        //     left: 38 + index * 25,
                        //     top: index === 1 ? 10 : 13,
                        // });
                        charPathData = loadedFonts[
                            fontlistmonogram[customizeInfo["monogram"].font]
                        ]
                            .getPath(char, 0, 0, 54)
                            .toPathData();

                        let charPath = new fabric.Path(charPathData, {
                            fill: "#A5A5A5",
                        });
                        canvas.add(charPath);
                        canvas.centerObject(charPath);

                        charPath.set({
                            width: 50,
                            left: 15 + index * 35,
                            top: 0,
                        });
                    } else if (customizeInfo["monogram"].font === 2) {
                        charPathData = loadedFonts[
                            fontlistmonogram[customizeInfo["monogram"].font]
                        ]
                            .getPath(char, 0, 0, 70)
                            .toPathData();

                        let charPath = new fabric.Path(charPathData, {
                            fill: "#A5A5A5",
                        });
                        canvas.add(charPath);
                        canvas.centerObject(charPath);

                        charPath.set({
                            width: 50,
                            left: 30 + index * 20,
                            top: 0,
                        });
                    } else if (customizeInfo["monogram"].font === 3) {
                        charPathData = loadedFonts[
                            fontlistmonogram[customizeInfo["monogram"].font]
                        ]
                            .getPath(char, 0, 0, 120)
                            .toPathData();

                        let charPath = new fabric.Path(charPathData, {
                            fill: "#A5A5A5",
                        });
                        canvas.add(charPath);
                        canvas.centerObject(charPath);

                        charPath.set({
                            width: 50,
                            left: index === 0 ? 25 : 75,
                            top: 15,
                        });
                        if (index === 0) {
                            const customLetter = "I";
                            const selectedFont =
                                fontlistmonogram[customizeInfo.monogram.font];

                            // Get path data for the custom letter 'I'
                            const pathData = loadedFonts[selectedFont]
                                .getPath(customLetter, 0, 0, 150)
                                .toPathData();

                            // Create a path object
                            const charPath = new fabric.Path(pathData, {
                                fill: "#A5A5A5",
                            });

                            // Adjust the positioning based on your requirements
                            charPath.set({
                                width: 50,
                                left: 50,
                                top: 7,
                            });

                            // Add the path object to the canvas
                            canvas.add(charPath);
                        }
                    }
                });
            }
        }
    }, [customizeInfo["monogram"], loadedFonts]);

    // for graphic
    // useEffect(() => {
    //     if (customizeInfo.selected === "graphic" && canvas) {
    //         if (objectadding) {
    //             // canvas.clear();

    //             let imgurl = `images/graphic/${customizeInfo["graphic"].value}.png`;
    //             const desiredHeight = 80;
    //             // Remove existing graphics
    //             canvas.getObjects("graphic").forEach((obj) => {
    //                 canvas.remove(obj);
    //             });
    //             fabric.Image.fromURL(imgurl, (img) => {
    //                 img.set({
    //                     // scaleX: 96 / img.width,
    //                     // scaleY: 96 / img.height,
    //                     selectable: false, // allow object to be selected/dragged
    //                     evented: false,
    //                     hasRotatingPoint: false,
    //                     lockUniScaling: false, // Maintain aspect ratio while scaling
    //                     objectCaching: false,
    //                 });
    //                 img.scaleToHeight(desiredHeight);
    //                 img.set("type", "graphic");
    //                 // canvas.selection = false;
    //                 canvas.add(img);
    //                 canvas.centerObject(img);
    //                 img.set({
    //                     top: 30,
    //                 });
    //             });
    //         }
    //     }
    // }, [customizeInfo["graphic"]]);
    const generateGraphicImage = async (svgData) => {
        return new Promise((resolve, reject) => {
            const desiredHeight = 80;
            const allowedWidth = 100;
            // Remove existing graphics
            canvas.getObjects("graphic").forEach((obj) => {
                canvas.remove(obj);
            });

            fabric.loadSVGFromURL(svgData, (objects, options) => {
                const svg = new fabric.Group(objects, options);
                // if (customizeInfo["graphic"].value != 4) {
                //     // Traverse through the SVG elements and set the color for path elements
                //     svg.getObjects().forEach((element) => {
                //         if (element instanceof fabric.Path) {
                //             element.set("fill", "#A5A5A5");
                //         }
                //     });
                // }
                svg.set({
                    selectable: false,
                    evented: false,
                    hasRotatingPoint: false,
                    lockUniScaling: false,
                    objectCaching: false,
                });

                svg.scaleToHeight(desiredHeight);
                // Assuming svg is your fabric.Path or fabric.Group containing the SVG
                const currentWidth = svg.width * svg.scaleX;

                if (currentWidth > allowedWidth) {
                    // Scale to width if it exceeds the allowed width
                    svg.scaleToWidth(allowedWidth);
                }
                svg.set({ type: "graphic" });
                canvas.add(svg).centerObject(svg);
                svg.set({
                    top: 20,
                });
                resolve(svg); // Resolve with the created svg object
            });
        });
    };
    useEffect(() => {
        if (customizeInfo.selected === "graphic" && canvas && objectadding) {
            // Assuming customizeInfo["graphic"].value is the SVG data
            // const svgData = customizeInfo.graphic.value;
            let svgData = `images/graphic/gray-${customizeInfo["graphic"].value}.svg`;
            generateGraphicImage(svgData);
        }
    }, [customizeInfo.graphic, objectadding, canvas]);
    console.log(
        "graphic stuff",
        loadedFonts,
        !Object.keys(loadedFonts).length,
        customizeInfo["graphic"].value != null
    );
    return (
        <>
            {showloader && <LoaderAnimation />}

            <Layout>
                <Layouttop>
                    {!designfinalised && (
                        <>
                            <div className="topselectionheading">
                                ENGRAVING TYPE (TAP ONE OF THE BELOW OPTIONS)
                            </div>
                            <div className="topselection">
                                <div className="tab">
                                    <img
                                        src={`images/common/text${
                                            customizeInfo.selected === "text"
                                                ? "_sel"
                                                : ""
                                        }.png`}
                                        onClick={() =>
                                            setCustomizeInfo((prevState) => ({
                                                ...prevState,
                                                selected: "text",
                                            }))
                                        }
                                        alt=""
                                    />
                                </div>
                                <div className="tab">
                                    <img
                                        src={`images/common/monogram${
                                            customizeInfo.selected ===
                                            "monogram"
                                                ? "_sel"
                                                : ""
                                        }.png`}
                                        onClick={() =>
                                            setCustomizeInfo((prevState) => ({
                                                ...prevState,
                                                selected: "monogram",
                                            }))
                                        }
                                        alt=""
                                    />
                                </div>
                                <div className="tab">
                                    <img
                                        src={`images/common/graphic${
                                            customizeInfo.selected === "graphic"
                                                ? "_sel"
                                                : ""
                                        }.png`}
                                        onClick={() =>
                                            setCustomizeInfo((prevState) => ({
                                                ...prevState,
                                                selected: "graphic",
                                            }))
                                        }
                                        alt=""
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    {designfinalised && (
                        <div className="topselectionheading final">
                            CONFIRM YOUR CHOICES
                        </div>
                    )}
                </Layouttop>

                <LayoutCenterStyled
                    className={`${designfinalised ? "confirmview" : ""}`}
                >
                    <LeftWrapper>
                        <img
                            src={`images/items/${selectedItem.type}_outline.png`}
                            className={`imgbg imgbg${selectedItem.type}`}
                            alt=""
                        />
                        <img
                            src={canvaspreview}
                            className={`canvaspreview cp${selectedItem.type} ${customizeInfo.selected}`}
                            alt=""
                        />
                        <TopWrapper
                            className={`type${selectedItem.type} ${
                                customizeInfo.selected === "graphic"
                                    ? "graphiccustomise"
                                    : customizeInfo.selected
                            }`}
                        >
                            <canvas ref={canvasRef} id="demo" />
                        </TopWrapper>
                    </LeftWrapper>
                    <RightWrapper
                        className={`${
                            customizeInfo.selected === "graphic"
                                ? "graphicrighwrapper"
                                : customizeInfo.selected
                        }`}
                    >
                        {customizeInfo.selected === "text" && (
                            <Textbox>
                                <div className="headingsmall">
                                    ADD CUSTOM TEXT
                                </div>
                                <input
                                    type="text"
                                    className="smlipt"
                                    value={customizeInfo["text"].value}
                                    maxLength={12}
                                    disabled={
                                        loadedFonts &&
                                        !Object.keys(loadedFonts).length
                                    }
                                    onChange={(e) =>
                                        setCustomizeInfo((prevState) => ({
                                            ...prevState,
                                            text: {
                                                ...prevState.text,
                                                value: e.target.value,
                                            },
                                        }))
                                    }
                                />
                                <div className="charmax">
                                    (12 CHARACTERS MAX)
                                </div>
                                <div className="flexwrapper">
                                    {[1, 2, 3, 4, 5].map((item, index) => {
                                        index = index + 1;
                                        return (
                                            <div
                                                className={`box box${index} ${
                                                    customizeInfo["text"]
                                                        .font === index
                                                        ? "active"
                                                        : ""
                                                }`}
                                                style={{
                                                    fontFamily: fontlist[index],
                                                }}
                                                key={index}
                                                onClick={() =>
                                                    setCustomizeInfo(
                                                        (prevState) => ({
                                                            ...prevState,
                                                            text: {
                                                                ...prevState.text,
                                                                font: index,
                                                            },
                                                        })
                                                    )
                                                }
                                            >
                                                Aa
                                            </div>
                                        );
                                    })}
                                </div>
                            </Textbox>
                        )}
                        {customizeInfo.selected === "monogram" && (
                            <Monogrambox>
                                <div className="headingsmall">
                                    ADD YOUR MONOGRAM
                                </div>
                                <input
                                    type="text"
                                    className="smlipt"
                                    value={customizeInfo["monogram"].value}
                                    onChange={(e) =>
                                        setCustomizeInfo((prevState) => ({
                                            ...prevState,
                                            monogram: {
                                                ...prevState.monogram,
                                                value: e.target.value,
                                            },
                                        }))
                                    }
                                    maxLength={
                                        customizeInfo["monogram"].font === 3
                                            ? 2
                                            : 3
                                    }
                                />
                                <div className="flexwrapper">
                                    <div
                                        className={`box box1 ${
                                            customizeInfo["monogram"].font === 1
                                                ? "active"
                                                : ""
                                        }`}
                                        style={{
                                            fontFamily: fontlistmonogram[1],
                                        }}
                                        onClick={() =>
                                            setCustomizeInfo((prevState) => ({
                                                ...prevState,
                                                monogram: {
                                                    ...prevState.monogram,
                                                    font: 1,
                                                },
                                            }))
                                        }
                                    >
                                        ABC
                                    </div>

                                    <div
                                        className={`box box2 ${
                                            customizeInfo["monogram"].font === 2
                                                ? "active"
                                                : ""
                                        }`}
                                        style={{
                                            fontFamily: fontlistmonogram[2],
                                        }}
                                        onClick={() =>
                                            setCustomizeInfo((prevState) => ({
                                                ...prevState,
                                                monogram: {
                                                    ...prevState.monogram,
                                                    font: 2,
                                                },
                                            }))
                                        }
                                    >
                                        ABC
                                    </div>
                                    <div
                                        className={`box box3 ${
                                            customizeInfo["monogram"].font === 3
                                                ? "active"
                                                : ""
                                        }`}
                                        style={{
                                            fontFamily: fontlistmonogram[3],
                                        }}
                                        onClick={() =>
                                            setCustomizeInfo((prevState) => ({
                                                ...prevState,
                                                monogram: {
                                                    ...prevState.monogram,
                                                    font: 3,
                                                    value: "",
                                                },
                                            }))
                                        }
                                    >
                                        <span className="chr1">A</span>
                                        <span className="chr2">I</span>
                                        <span className="chr3">B</span>
                                    </div>
                                </div>
                            </Monogrambox>
                        )}

                        {customizeInfo.selected === "graphic" && (
                            <div className="graphicflex">
                                <Graphichbox>
                                    <div className="headingsmall">
                                        CHOOSE YOUR GRAPHIC
                                    </div>

                                    <div className="flexwrapper">
                                        {/* 3, 4, 5, 6, 7, 8, 9, 10 */}
                                        {[
                                            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                                            12, 13, 14, 15, 16,
                                        ].map((item, index) => {
                                            return (
                                                <div
                                                    className={`box  ${
                                                        customizeInfo["graphic"]
                                                            .value === item
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    key={index}
                                                    onClick={() =>
                                                        setCustomizeInfo(
                                                            (prevState) => ({
                                                                ...prevState,
                                                                graphic: {
                                                                    value: item,
                                                                },
                                                            })
                                                        )
                                                    }
                                                >
                                                    <div className="imgOuter">
                                                        <img
                                                            src={`images/graphic/${item}.svg`}
                                                            alt=""
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Graphichbox>
                            </div>
                        )}
                    </RightWrapper>
                </LayoutCenterStyled>

                {designfinalised ? (
                    <LayoutFooter>
                        <button
                            className="btnglobal"
                            onClick={() => setDesignfinalised(false)}
                        >
                            <img src="images/common/button_back.png" alt="" />
                        </button>

                        <div className="btncenter">
                            <img src="images/common/logo.png" alt="" />
                        </div>

                        <button className="btnglobal" onClick={downloadimage}>
                            <img src="images/common/button_next.png" alt="" />
                        </button>
                    </LayoutFooter>
                ) : (
                    <LayoutFooter>
                        <Link className="nav-link" to="/choose">
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
                            className="btnglobal"
                            style={
                                !(
                                    customizeInfo["text"].value.length > 0 ||
                                    customizeInfo["monogram"].value.length >
                                        0 ||
                                    customizeInfo["graphic"].value > 0
                                )
                                    ? { pointerEvents: "none", opacity: 0.8 }
                                    : null
                            }
                            onClick={() => setDesignfinalised(true)}
                        >
                            <img src="images/common/button_next.png" alt="" />
                        </button>
                    </LayoutFooter>
                )}
            </Layout>
        </>
    );
};

const InfoOverlay = styled.div`
    background: #e5e5e5;
    .ovrly {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 99;
    }
`;
const Textbox = styled.div`
    .flexwrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 38px;
        .box {
            border-radius: 50%;
            font-size: 5vh;
            width: 10vh;
            height: 10vh;
            margin-right: 2%;
            // border: 1px solid #707070;
            background: #fff;
            display: flex;
            align-items: center;
            color: #000;
            justify-content: center;
            &.active {
                // background: #e34026;
                background: #fce432;
                filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
            }
        }
    }
`;

const Graphichbox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .flexwrapper {
        display: flex;
        align-items: center;
        margin-top: 18px;
        flex-flow: wrap;
        max-width: 40vw;
        .box {
            width: 25%;
            margin-bottom: 16px;
            display: Flex;
            justify-content: center;
            .imgOuter {
                height: 8vh;
                width: 8vh;
                padding: 5px;
                box-sizing: border-box;
                border: 2px solid #fff;
                border-radius: 50%;
                background: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            img {
                height: 100%;
                width: 100%;
                object-fit: contain;
                // border: 2px solid transparent;
                // overflow: visible;
            }
            border: 2px solid rgba(0, 0, 0, 0);
            box-sizing: border-box;
            &.active {
                .imgOuter {
                    // filter: blur(0 0 10px #000);
                    background: #fce432;
                    border: 2px solid rgba(0, 0, 0, 0.7);
                    img {
                        // border: 2px solid rgba(0, 0, 0, 0.7);
                        border-radius: 50%;
                    }
                }
            }
        }
    }
`;

const Monogrambox = styled(Textbox)`
    .smlipt {
        font-size: 5.5vh;
        width: 220px;
    }
    .box {
        font-size: 5vh !important;
        font-weight: 400;
        &.box1 {
            font-size: 4.2vh !important;
            span {
                margin: 0 2px;
            }
            // .chr1 {
            //     font-family: MONOGRAMOS_left;
            // }
            // .chr2 {
            //     font-family: MONOGRAMOS_center;
            // }
            // .chr3 {
            //     font-family: MONOGRAMOS_right;
            // }
        }
        &.box2 {
            letter-spacing: 2px;
        }
        &.box3 {
            font-size: 9vh !important;
            letter-spacing: 2px;
            span {
                margin-top: -27px;
            }
            .chr2 {
                margin-top: -31px;
                font-size: 11vh !important;
            }
        }
        &.active {
            // background: transparent !important;
            // border: 3px solid #fff;
        }
    }
    .flexwrapper {
        justify-content: center;
        .box {
            width: 12vh;
            height: 12vh;
        }
    }
`;
const LeftWrapper = styled.div`
    position: absolute;
    top: 9vh;
    left: 0px;
    height: 100%;
    width: 30vw;
    // transform: translateY(-50%);
    .imgbg {
        height: 70vh;
        width: auto;
        position: absolute;
        left: 50%;
        transform: translateX(calc(-50% - 0px));

        top: -14.7vh;
        &.imgbg30oz {
            height: 70vh;
            transform: translateX(calc(-50% - -18px));
            top: -14.7vh;
        }
        &.imgbg40oz {
            height: 70vh;
            transform: translateX(calc(-50% - -18px));
            top: -14.7vh;
        }
        &.imgbgiceflow {
            height: 70vh;
            transform: translateX(calc(-50% - -6px));
            top: -15.7vh;
        }

        // &.imgbg2 {
        //     width: 54%;
        //     top: -12%;
        //     right: 5%;
        // }
    }
`;
const RightWrapper = styled.div`
    position: absolute;
    // left: 5%;
    right: 0;
    width: 64vw;
    padding-right: 8vw;
    box-sizing: border-box;
    // &.graphicrighwrapper {
    //     width: 64vw;
    // }
    .headingsmall {
        text-align: center;
    }
    .charmax {
        text-align: center;
        font-size: 22px;
        margin-top: 20px;
    }
    &.text {
        ${Textbox} {
            width: 45vw;
            margin: auto;
            .headingsmall {
                text-align: center;
            }
        }
    }
    &.monogram {
        ${Monogrambox} {
            width: 45vw;
            margin: auto;
            .headingsmall {
                text-align: center;
            }
            .smlipt {
                font-size: 12vh;
            }
        }
    }

    .graphicflex {
        display: flex;
        .headingsmall {
            word-wrap: normal;
        }
        // ${Graphichbox} {
        //     width: 50%;
        // }
    }
    .headingsmall {
        font-size: 52px;
        color: #1e1e1e;
        margin: 0;
        margin-bottom: 2.7vh;
        .red {
            color: #d94e3a;
        }
    }

    .smlipt {
        font-size: 50px;
        text-transform: uppercase;
        font-weight: 600;
        padding: 5px 16px;
        width: 100%;
        box-sizing: border-box;
        text-align: center;
    }
`;
const TopWrapper = styled.div`
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    align-items: flex-start;
    justify-content: Center;
    top: 14vh;
    position: relative;
    // width: fit-content;
    // &.graphiccustomise {
    //     top: 150px;
    // }
    &.typeiceflow {
        .canvas-container {
            top: 0px !important;
        }
    }
    &.type30oz {
        left: 60px !important;
        // top: -41px !important;
    }
    &.type40oz {
        left: 60px !important;
        top: 7vh !important;
    }
    &.monogram {
        .canvas-container {
            top: 40px;
        }
    }
    canvas {
        width: 100%;
        height: 100%;
    }
    &.screen2 {
        margin-top: -20px;
        transform: scale(0.9);
    }
    &.screen1 {
        transform: scale(0.96);
    }
    &.screen3 {
        transform: scale(1.1);
        margin-top: 80px;
    }
`;
const LayoutCenterStyled = styled(LayoutCenter)`
    height: 55vh;
    max-height: 55vh;
    min-height: 55vh;
    position: absolute;
    box-sizing: border-box;
    top: 20vh;
    // transform: translateY(calc(-50% + 50px));
    padding: 50px 0;

    .canvaspreview {
        display: none;
    }
    &.confirmview {
        .heightbgfix {
            height: 322px;
            width: 100%;
            position: absolute;
            background: #dd00ff;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .imgbgiceflow {
            transform: translateX(calc(-50% - 0px)) !important;
            top: -17.7vh !important;
            height: 60vh !important;
            .canvas-container {
                top: 0px !important;
            }
        }
        .imgbg30oz {
            transform: translateX(calc(-50% - 34px)) !important;
            top: -17.7vh !important;
            height: 60vh !important;
        }
        .imgbg40oz {
            transform: translateX(calc(-50% - 34px)) !important;
            top: -17.7vh !important;
            height: 60vh !important;
            .canvaspreview {
                top: 24px !important;
            }
        }
        .canvaspreview {
            display: block;

            width: auto;
            position: absolute;
            left: 50%;
            transform: translateX(calc(-50% - 0px));
            top: 100px;
            &.cp30oz {
                top: 20px;
            }
            &.cp40oz {
                top: 20px;
            }
            &.cpiceflow {
                top: 25px !important;
                left: 175px;
            }
            &.graphic {
                height: 180px;
            }
            &.text {
                height: 120px;
            }
            &.monogram {
                height: 150px;
                top: 140px;
            }
        }

        ${LeftWrapper} {
            pointer-events: none;
            left: 50%;
            transform: translate(-50%, -50%) scale(1);
            transform-origin: top;
            top: 42vh;
            ${TopWrapper} {
                display: none;
            }
        }
        ${RightWrapper} {
            display: none;
        }
    }
`;

const Layout = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
    background: url("./images/common/bg.png");
    background-size: calc(100% - 20px) calc(100% - 20px);
    background-position: center center;
    background-repeat: no-repeat;
    box-sizing: border-box;
    overflow: hidden;
    min-height: 100vh;
    height: 100%;
    width: 100vw;
    ${Layouttop} {
        flex-direction: column;
    }
    .topselectionheading {
        color: #302d2b;
        font-size: 32px;
        font-weight: 500;
        margin-top: -6px;
        margin-bottom: 12px;
        &.final {
            font-size: 64px;
        }
    }
    .topselection {
        display: flex;
        justify-content: center;
        .tab {
            img {
                height: 70px;
            }
        }
    }
    .customize {
        background: #2c3296;
        width: 100vw;
        color: #fff;
        font-size: 40px;
        font-family: Emberbold;
        letter-spacing: 3px;
        margin: 0;
        text-align: center;
        font-weight: 100;
        padding: 8px 0;
        // padding-bottom: 0px;
        margin-bottom: 20px;
        filter: drop-shadow(0 3px 6px #000);
    }
    .text_heading {
        position: relative;
        top: -20px;
        width: auto;
        height: 14vh;
    }
`;

export default Customize;
