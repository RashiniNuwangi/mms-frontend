import React, { useState, useEffect } from 'react';
import * as XLSX from "xlsx";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AttendanceEligibilityManage() {
    const [data, setData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);

    const expectedKeys = ["student_id", "course_id", "percentage", "eligibility"];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:9090/api/attendanceEligibility/getallattendance");
            setAttendanceData(response.data.content);
        } catch (error) {
            console.error("Error fetching data from API:", error);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);

            const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];

            // Header Validation
            if (!headers || !Array.isArray(headers) || headers.length === 0) {
                toast.warn("Failed to read headers from the uploaded file. Please ensure the file is properly formatted.");
                return;
            }

            if (!headers.every((key, index) => key === expectedKeys[index])) {
                toast.warn("The uploaded sheet is not related or formatted correctly. Please ensure the correct structure.");
                return;
            }

            // Data Validation
            if (parsedData.length === 0) {
                toast.warn("The uploaded file contains only headers. Please ensure there is data below the headers.");
                return;
            }

            setData(parsedData);
        };

        reader.onerror = (error) => {
            toast.error("Error reading file. Please try again.");
            console.error("Error reading file:", error);
        };

        // Changed from readAsArrayBuffer to readAsBinaryString
        reader.readAsBinaryString(file);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:9090/api/attendanceEligibility/insertbulkattendance", data);
            toast.success("Data submitted successfully!");
            fetchData();
            window.location.reload();
        } catch (error) {
            console.error("Error submitting data:", error);
            toast.error("Error submitting data. Please try again.");
        }
    };

    const downloadTemplate = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet([{ student_id: "", course_id: "", percentage: "", eligibility: "" }], { header: expectedKeys, skipHeader: false });
        XLSX.utils.book_append_sheet(wb, ws, "Attendance Eligibility Template");
        XLSX.writeFile(wb, "Attendance_Eligibility_Template.xlsx");
    };
    // clear data function
    const handleClearData = () => {
        setData([]);
        window.location.reload();
    }

    return (
        <div className='container'>
           
            <div className='py-4'>
                <div className="h2 mt-lg-5">Attendance</div>
                <div className='my-2' style={{ float: "right" }}>
                    <button onClick={downloadTemplate} className='btn btn-success mt-3'>Download Template</button>
                </div>
                <div>
                    <form onSubmit={onSubmit}>
                        <input type="file" className='btn btn-secondary mx-2 btn-sm my-1' accept='.xlsx, .xls' onChange={handleFileUpload} />
                        {data.length > 0 && (
                            <table className='table'>
                                <thead>
                                    <tr>
                                        {Object.keys(data[0]).map((key, index) => (
                                            <th key={index}>{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row, index) => (
                                        <tr key={index}>
                                            {Object.values(row).map((value, index) => (
                                                <td key={index}>{value}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <button type='submit' style={{width:"100px"}} className='btn btn-outline-success btn-sm my-1'>Submit</button>
                        <button type='button' style={{width:"100px",marginLeft:"10px"}} className=' btn btn-outline-danger btn-sm' onClick={handleClearData}>Clear</button>
                    </form>
                </div>
            </div>
            <ToastContainer />
            <div>
                <div className="h2 mt-lg-5">Attendance Data</div>
                {attendanceData.length > 0 && (
                    <table className='table'>
                        <thead>
                            <tr>
                                {Object.keys(attendanceData[0]).map((key, index) => (
                                    <th key={index}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, index) => (
                                        <td key={index}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
