import * as React from "react";
import styled from "styled-components";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { createGlobalStyle } from "styled-components";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { TRUE } from "sass";
import Switch from "@mui/material/Switch";
import Pagination from "@mui/material/Pagination";
import { PDFDocument, StandardFonts, rgb, PageSizes } from "pdf-lib";
import { fabric } from "fabric";
import LoaderAnimation from "../components/LoaderAnimation";
import { toast } from "react-toastify";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: teal;
    font-family: Open-Sans, Helvetica, Sans-Serif;
    background:#f3f3f3;
    overflow:scroll !important;
    .mybglayout{
      display:none !important;
    }
  }

`;

function createData(id: any, name: string, size: string) {
    return { id, name, size };
}

const rows = [createData(1, "asdf", "AS")];

interface Props {}
// const getSvgContent = (imageUrl) => {
//     // return "sfd";
//     return fetch(imageUrl).then((response) => {
//         if (!response.ok) {
//             throw new Error("HTTP error " + response.status);
//         }
//         return response.text();
//     });
// };

function SvgDisplayComponent({ imageUrl }) {
    const [svgContent, setSvgContent] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        getSvgContent(imageUrl)
            .then((content) => {
                setSvgContent(content);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [imageUrl]); // Re-run the effect if imageUrl changes

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    // console.log(svgContent);
    return <div dangerouslySetInnerHTML={{ __html: svgContent }} />;
}

// Assuming getSvgContent is defined as before
const getSvgContent = (imageUrl) => {
    return fetch(imageUrl).then((response) => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.text();
    });
};

const downloadit = (imageUrl) => {
    fetch(imageUrl)
        .then((response) => {
            return response.blob();
        })
        .then((modifiedSVG) => {
            // Create a temporary anchor element
            // const url = window.URL.createObjectURL(blob);
            var blob = new Blob([modifiedSVG], {
                type: "image/svg+xml;charset=utf-8",
            });

            var url = URL.createObjectURL(blob);
            console.log(blob);
            const link = document.createElement("a");
            link.href = url;

            // Extract the filename from the URL
            const filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

            // Set the download attribute and filename
            link.setAttribute("download", filename);
            document.body.appendChild(link);

            // Simulate a click on the anchor element to start the download
            link.click();

            // Clean up the temporary anchor element
            link.parentNode.removeChild(link);

            // // Set the downloaded image URL to display on the page
            // setImageUrl(url);
        })
        .catch((error) => {
            console.error("Error downloading image:", error);
        });
};

const InnerTableRow = ({ res }) => {
    const [isreceiptDownloading, setIsreceiptDownloading] =
        React.useState(false);
    const [status, setStatus] = React.useState<string>(res.status);
    const handleAcceptChange = (event: SelectChangeEvent) => {
        setStatus(String(event.target.value));
        axios
            .post(`${process.env.REACT_APP_API_URL}/api/savestatus`, {
                id: res.id,
                type: "status",
                status: String(event.target.value),
            })
            .then((response) => {
                console.log(response.data);
                toast.success(
                    `Status updated for ${res.userdetails?.firstName} for OrderId #${res.id}`,
                    {
                        position: "top-right",
                        autoClose: 2000, // Close the toast after 3000ms (3 seconds)
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        style: {
                            fontSize: "15px",
                            color: "rgba(0,0,0,0.7)",
                        },
                    }
                );
            })
            .catch((error) => {
                console.error(error);
            });
    };
    const canvasRef = React.useRef(null);
    const generatePrint = async () => {
        await document.fonts.load("16px Flama-Bold").then(async () => {
            // Initialize Fabric.js
            let widthcanvas = 1200;
            let heightcanvas = 1800;
            const canvas = new fabric.Canvas(canvasRef.current, {
                targetFindTolerance: 5,
                width: widthcanvas,
                height: heightcanvas,
            });

            // let widthcanvas = 1200;
            // let heightcanvas = 1800;
            canvas.backgroundColor = "white";
            // canvas.setWidth(200);
            // canvas.setHeight(300);
            // Create A4 size rectangle with black border
            const a4SizeRect = new fabric.Rect({
                width: widthcanvas - 50,
                height: heightcanvas - 50,
                originX: "left",
                originY: "top",
                top: 50 / 2, // Adjust the vertical position of the text
                left: 50 / 2,
                fill: "white", // You can change the fill color if needed
                stroke: "black",
                strokeWidth: 8, // Adjust border width as needed
                selectable: false,
                evented: false,
            });
            canvas.add(a4SizeRect);
            const fabrictext = "#" + res.id + "- " + res.userdetails?.firstName;
            console.log(fabrictext);
            // Add text at the bottom
            const text = new fabric.Text(fabrictext, {
                fontSize: 100,
                originX: "center",
                originY: "bottom",
                fontFamily: "Flama-Bold",
                top: heightcanvas / 2 - 180, // Adjust the vertical position of the text
                left: widthcanvas / 2, // Center horizontally
                selectable: false,
                evented: false,
            });
            canvas.add(text);
            // // Add text at the bottom
            // const text2 = new fabric.Text(`# ${res.id}`, {
            //     fontSize: 100,
            //     originX: "center",
            //     originY: "bottom",
            //     fontFamily: "Flama-Bold",
            //     top: text.top + text.height, // Adjust the vertical position of the text
            //     left: widthcanvas / 2, // Center horizontally
            //     selectable: false,
            //     evented: false,
            // });
            // canvas.add(text2);
            const text3 = new fabric.Text(
                `${res.itemname.type.toUpperCase()} - ${res.itemname.color.toUpperCase()}`,
                {
                    fontSize: 80,
                    originX: "center",
                    originY: "bottom",
                    fontFamily: "Flama-Bold",
                    top: text.top + text.height, // Adjust the vertical position of the text
                    left: widthcanvas / 2, // Center horizontally
                    selectable: false,
                    evented: false,
                }
            );
            canvas.add(text3);
            await fetch(res.canvasuri)
                .then((response) => response.text())
                .then((svgContent) => {
                    fabric.loadSVGFromString(svgContent, (objects, options) => {
                        const svg = new fabric.Group(objects, options);
                        svg.set({
                            top: text3.top + text3.height,
                            left: widthcanvas / 2,
                            selectable: false,
                            evented: false,
                        });

                        const desiredHeight = 400;
                        svg.scaleToHeight(desiredHeight);
                        svg.set({
                            left: svg.left - svg.width,
                        });
                        canvas.add(svg);
                    });
                })
                .catch((error) => console.error("Error fetching SVG:", error));
            // await fabric.Image.fromURL(res.canvasuri, async (base64Image) => {
            //     // canvas.centerObject(base64Image);
            //     base64Image.set({
            //         top: text3.top + text3.height, // Adjust the vertical position of the text
            //         left: widthcanvas / 2, // Center horizontally
            //         selectable: false,
            //         evented: false,
            //     });

            //     const desiredHeight = 400;
            //     base64Image.scaleToHeight(desiredHeight);
            //     // Translate the image by -50% of its width
            //     base64Image.set({
            //         left: base64Image.left - base64Image.width,
            //     });
            //     canvas.add(base64Image);
            //     //
            // });
            // Add objects to the canvas
            canvas.renderAll();
            // Optionally, you can render the canvas background as an image
        });
    };
    // React.useEffect(() => {
    //     generatePrint();
    // }, [res]);
    const downloadreceipt = async () => {
        await generatePrint();
        setIsreceiptDownloading(true);

        // Convert canvas to data URL
        const dataUrl = canvasRef.current.toDataURL({
            format: "png",
            multiplier: 1, // Increase multiplier for higher resolution
        });

        // Create a new HTML page containing the image
        const htmlContent = `<html><body style="width:100%;"><img src="${dataUrl}" style="width:100%;"/></body></html>`;
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        // Open the new HTML page in a new tab
        window.open(url, "_blank");

        setIsreceiptDownloading(false);
        console.log("receipt opened in a new tab");
    };
    return res.canvasuri.endsWith(".svg") ? (
        <TableRow
            key={res.id}
            sx={{
                "&:last-child td, &:last-child th": {
                    border: 0,
                },
            }}
        >
            <TableCell component="th" scope="row">
                {res.id}
            </TableCell>
            <TableCell align="center">{res.userdetails.firstName}</TableCell>
            <TableCell align="center">
                {res.itemname.type} - {res.itemname.color}
            </TableCell>
            <TableCell align="center">
                <SvgDisplayComponent imageUrl={res.canvasuri} />
            </TableCell>
            <TableCell align="center">
                <Button
                    variant="contained"
                    // disabled={!res.canvasuri.endsWith(".svg")}
                    onClick={() => downloadit(res.canvasuri)}
                >
                    Download
                </Button>
            </TableCell>
            <TableCell align="center">
                <div className="canvaswrapper" style={{ display: "none" }}>
                    <canvas ref={canvasRef} />
                </div>
                <Button variant="contained" onClick={() => downloadreceipt()}>
                    {isreceiptDownloading ? (
                        <>
                            <CircularProgress
                                style={{
                                    color: "white",
                                    height: "20px",
                                    width: "20px",
                                }}
                                thickness={3}
                            />
                        </>
                    ) : (
                        "Receipt"
                    )}
                </Button>
            </TableCell>
            <TableCell align="center">
                <FormControl fullWidth>
                    <Select
                        labelId="statusSelect"
                        id="statusSelect"
                        className={status}
                        defaultValue={status}
                        value={status}
                        onChange={handleAcceptChange}
                    >
                        <MenuItem value={"pending"}>Pending</MenuItem>
                        <MenuItem value={"complete"}>Complete</MenuItem>
                    </Select>
                </FormControl>
            </TableCell>
        </TableRow>
    ) : null;
};

const Admin: React.FC<Props> = () => {
    const [dbres, setDbres] = React.useState(null);
    const [dbsize, setDbsize] = React.useState(null);
    const [showadmin, setShowadmin] = React.useState(true);
    const [dropdownenabled, setDropdownenabled] = React.useState(false);
    const itemsPerPage = 50;
    const [currentData, setCurrentData] = React.useState(null);
    const [page, setPage] = React.useState(1);
    // console.log(dbsize)
    React.useEffect(() => {
        if (dbres) {
            setCurrentData(
                dbres.slice((page - 1) * itemsPerPage, page * itemsPerPage)
            );
        }
    }, [dbres, page]);
    console.log(dbres);

    React.useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/fetchdb`)
            .then((response) => {
                setDbres(response.data.reverse());
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    const handleChange = (event, value) => {
        setPage(value);
    };
    const [showloader, setShowloader] = React.useState(false);

    return (
        <>
            <GlobalStyle />
            {/* <button onClick={generatePDF}>PF</button> */}
            {showloader && <LoaderAnimation />}
            {showadmin && (
                <>
                    <Layout>
                        <div className="heading">
                            <h1>Admin Panel</h1>Laser
                        </div>

                        <TableContainer component={Paper}>
                            <Table
                                sx={{ minWidth: 650 }}
                                aria-label="simple table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell align="center">
                                            Name
                                        </TableCell>

                                        <TableCell align="center">
                                            Item Name
                                        </TableCell>
                                        <TableCell align="center">
                                            Preview
                                        </TableCell>
                                        <TableCell align="center">
                                            Download
                                        </TableCell>
                                        <TableCell align="center"></TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentData &&
                                        currentData.map((res) => {
                                            return (
                                                <InnerTableRow
                                                    key={res.id}
                                                    res={res}
                                                />
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div className="btmpagination">
                            <Pagination
                                count={Math.ceil(
                                    dbres ? dbres.length / itemsPerPage : null
                                )}
                                page={page}
                                onChange={handleChange}
                            />
                        </div>
                    </Layout>
                </>
            )}
        </>
    );
};
const Layout = styled.div`
    max-width: 1200px;
    margin: auto;
    background: #fff;
    padding: 24px;
    margin-top: 40px;
    border-radius: 12px;
    .canvaswrapper {
        // background: red;
        // height: 1800px;
    }
    .ddicon {
        background: transparent;
        padding: 0;
        border: 0;
        cursor: pointer;
        svg {
            transform: scale(2);
            path {
                fill: #fff;
            }
        }
    }
    .heading {
        background: linear-gradient(to top, #5d6dc3, #3c86d8);
        color: #fff;
        padding: 12px 20px;
        border-radius: 10px;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 600;
        margin-bottom: 14px;
        h1 {
            font-size: 22px;
        }
    }
    .canvaspreview {
        width: 140px;
        height: 140px;
        object-fit: contain;
    }
    .MuiTableHead-root {
        background: #f7f7f7 !important;
    }
    .MuiTableCell-root {
        padding-top: 14px !important;
        padding-bottom: 14px !important;
    }
    .btmpagination {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
`;

export default Admin;
