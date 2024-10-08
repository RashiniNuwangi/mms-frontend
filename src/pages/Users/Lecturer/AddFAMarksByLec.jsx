import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LecturerService from '../../../components/service/LecturerService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchAcademicYear, loadAcademicYearFromLocal, saveAcademicYearToLocal } from '../../../components/common/AcademicYearManagerSingleton';
import axios from 'axios';


export default function AddFAMarksByLec() {
    const { course_id, course_name } = useParams();
    const [evaluationCriteria, setEvaluationCriteria] = useState([]);
    // const [students, setStudents] = useState([]);
    const [regStudent, setRegStudent] = useState([]);
    const [level, setLevel] = useState('');
    const [semester, setSemester] = useState('');
    const [reversedata, setReversedata] = useState('');
    const [caMarks, setCaMarks] = useState([]);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [selectedCriteria, setSelectedCriteria] = useState({});
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [submitButtonErrorMSG, setSubmitButtonErrorMSG] = useState('');
    const [dataCAMarksAll, setDataCAMarksAll] = useState([]);
    const [uniqueAssigmentName, setUniqueAssigmentName] = useState([]);
    const [currentAcademicYear, setCurrentAcademicYear] = useState('');
    // const [getValAssessmentType, setGetValAssessmentType] = useState('');
    const [eligbilityBtnDisable, setEligbilityBtnDisable] = useState();
    
    const [finalizedBtnDisable, setFinalizedBtnDisable] = useState(false);
    const [academicDetails, setAcademicDetails] = useState(loadAcademicYearFromLocal);
    const [submitted, setSubmitted] = useState(false);
    const [markingTurnValaue, setMarkingTurnValaue] = useState([]);
    const [selectedAssessmentTypeValue,setSelectedAssessmentTypeValue] = useState([]);
    const [chooseTurnMarking,setChooseTurnMarking] = useState([]);
    const [choosFinalMarkVisibility,setChooseFinalMarkVisibility] = useState(false);
    const [finalMarkSelectioDivVisibility,setFinalMarkSelectioDivVisibility] = useState(false);
    const [selectedMarkingOption, setSelectedMarkingOption] = useState('');             //Store selected value of radio buttons
    const [finalMarkSelectButtonVisibility, setFinalMarkSelectButtonVisibility] = useState(false);
    const [academicYear, setAcademicYear] = useState();
    const [loader, setLoader] = useState(false);


    var selectedAssignmentName="";

    const handleFinalizedButtonVisibility = async ()=>{
        
            var result = false;
            try{
                result = await axios.get(`http://localhost:9090/api/grade/isFinalized/${course_id}/${currentAcademicYear}`)
                // setEligbilityBtnDisable(result.data)
                console.log(result.data)
            }catch(err){
                console.log(err)
            }

            if(result.data){
                setFinalizedBtnDisable(true);
            }else{
                setFinalizedBtnDisable(false);
            }

        

        

        



        
    }

    useEffect(()=>{
        handleFinalizedButtonVisibility();
    },[currentAcademicYear,course_id])


    useEffect(() => {
        const fetchAndSaveYear = async () => {
            const details = await fetchAcademicYear();
            if (details) {
                saveAcademicYearToLocal(details);
                setAcademicDetails(details);
            }
        };

        fetchAndSaveYear();

        // handleFinalizedButtonVisibility();
    }, []);



    useEffect(() => { 
        const fetchAllData = async () => {
            setLoader(true);
            try {
                // console.log("Fetching all data...");
                // Reverse the courseId string
                const reversedString = course_id.split("").reverse().join("");
                // console.log("Reversed string:", reversedString);

                // Extract characters at position 4 and 3 (considering 0-based index)
                const levelChar = reversedString.charAt(3); // Position 4
                const semesterChar = reversedString.charAt(2); // Position 3
                // console.log("Level character:", levelChar);
                // console.log("Semester character:", semesterChar);

                setReversedata(reversedString);
                setLevel(levelChar);
                setSemester(semesterChar);

                // Fetch Evaluation Criteria CA
                const evaluationCriteriaRes = await LecturerService.getEvaluationCriteriaFA(course_id);
                // console.log("Evaluation Criteria:", evaluationCriteriaRes.content);
                setEvaluationCriteria(evaluationCriteriaRes.content);
                setSelectedCriteria(evaluationCriteriaRes.content[0]); // Set initial selected criteria

                // Fetch Students with no marks
                // const notAddedStudentsRes = await LecturerService.getNotAddStudentsID(course_id);
                // console.log("Students with no marks:", notAddedStudentsRes.content);
                // setStudents(notAddedStudentsRes.content);

                var asInsideCurrentAcedemicYear ;

                const details = await fetchAcademicYear();
                if (details) {
                    saveAcademicYearToLocal(details);
                    setAcademicDetails(details);
                    asInsideCurrentAcedemicYear = details.current_academic_year;
                    setAcademicYear(details.current_academic_year);
                    console.log(asInsideCurrentAcedemicYear)
                }

                // Fetch all related students
                const allRelatedStudentsRes = await LecturerService.getAllRelatedStudentID(course_id,asInsideCurrentAcedemicYear);
                const allRelatedStudents = allRelatedStudentsRes.content;

                const uniqueStudentIds = new Set(allRelatedStudents.map(student => student.student_id));
                const studentArray = Array.from(uniqueStudentIds);

                
                console.log('Student IDs:', studentArray);

                setRegStudent(studentArray);

                
                

                // Fetch all data of FA Marks
                const allDataOfCAMarksRes = await LecturerService.getAllDataOfFAMarks(course_id, asInsideCurrentAcedemicYear);
                // console.log("All data of FA Marks:", allDataOfCAMarksRes);
                const allData = allDataOfCAMarksRes.content || [];
                // console.log(allData)
                setDataCAMarksAll([]);
                setDataCAMarksAll(allData);

                // Assuming allData is already fetched and stored in state
                const uniqueAssignmentNames = Array.from(new Set(allData.map(item => item.assignment_name)));
                setUniqueAssigmentName(uniqueAssignmentNames);
                
                // const academicYearDetails = await LecturerService.getAcademicYearDetails();
                // const setCurrentAcY = (academicYearDetails[0].current_academic_year);
                setCurrentAcademicYear(asInsideCurrentAcedemicYear);
                


                // Create initial CA marks entries
                const initialCaMarks = studentArray.map(student => ({
                    student_id: student, // Adjust based on actual student ID property
                    course_id: course_id,
                    academic_year: asInsideCurrentAcedemicYear,
                    level: levelChar,
                    semester: semesterChar,
                    assignment_name: '',
                    assignment_score: '',
                    evaluation_criteria_id: ''
                }));
                // console.log("Initial CA Marks:", initialCaMarks);
                setCaMarks(initialCaMarks);
            } catch (error) {
                // console.error("Error fetching data:", error);
            }
            setLoader(false);
        };
        // setDataCAMarksAll([]);
        fetchAllData();
        // handleFinalizedButtonVisibility();
    }, [course_id,submitted]);

    useEffect(() => {
        const isLastStudent = currentStudentIndex >= regStudent.length - 1;
        const isLastStudentScoreFilled = caMarks[currentStudentIndex]?.assignment_score !== '';
        setSubmitButtonErrorMSG(isLastStudent && isLastStudentScoreFilled ? '' : 'All students marks are not filled');
        setIsSubmitDisabled(!(isLastStudent && isLastStudentScoreFilled));

        // Disable button if no assignment name is selected

        // handleFinalizedButtonVisibility();

    }, [currentStudentIndex, regStudent.length, caMarks,selectedCriteria]);


    useEffect(() => {
        // Assuming evaluationCriteria is already populated with objects that have an assignment_name property
        // And uniqueAssigmentName is populated with strings
    
        // Sort uniqueAssigmentName array
        const sortedUniqueAssignmentNames = [...uniqueAssigmentName].sort();
    
        // Sort evaluationCriteria array based on assignment_name property
        const sortedEvaluationCriteria = [...evaluationCriteria].sort((a, b) => a.assignment_name.localeCompare(b.assignment_name));
    
        // Check if lengths are the same
        const isSameLength = sortedUniqueAssignmentNames.length === sortedEvaluationCriteria.length;
    
        let arraysAreSame = false;
    
        if (isSameLength) {
            // Compare contents
            arraysAreSame = sortedUniqueAssignmentNames.every((name, index) => 
                name === sortedEvaluationCriteria[index].assignment_name
            );
        }

        // handleFinalizedButtonVisibility();
    
        // console.log("Arrays are the same:", arraysAreSame);
        // Here you can set your state or variable based on arraysAreSame value
    }, [uniqueAssigmentName, evaluationCriteria]);


    const handleMarksChange = (e) => {
        // console.log("Handling marks change for student:", regStudent[currentStudentIndex]);
        const updatedCaMarks = caMarks.map((mark, index) =>
            index === currentStudentIndex
                ? {
                      ...mark,
                      assignment_score: e.target.value,
                      assignment_name: chooseTurnMarking[0],
                      evaluation_criteria_id: selectedCriteria.evaluationcriteria_id
                  }
                : mark
        );
        // console.log("Updated CA Marks:", updatedCaMarks);

        // Ensure we don't have any duplicate entries
        const uniqueCaMarks = [...new Map(updatedCaMarks.map(item => [JSON.stringify(item), item])).values()];


        setCaMarks(uniqueCaMarks);
    };

    const handleNextClick = () => {
        // console.log("Current student index:", currentStudentIndex);
        // setCurrentStudentIndex((prevIndex) => prevIndex + 1);
        if (currentStudentIndex < regStudent.length - 1) {
            setCurrentStudentIndex(prevIndex => prevIndex + 1);
        }
        
    };

    const handlePrevClick = () => {
        // console.log("Current student index:", currentStudentIndex);
        // setCurrentStudentIndex((prevIndex) => prevIndex - 1);
        if (currentStudentIndex > 0) {
            setCurrentStudentIndex(prevIndex => prevIndex - 1);
        }
        
    };

    const handleCriteriaChange = (e) => {
        selectedAssignmentName = e.target.value;
        setSelectedAssessmentTypeValue(prevValue => [...prevValue, selectedAssignmentName]);
        const criteria = evaluationCriteria.find(c => c.assignment_name === selectedAssignmentName);
        setSelectedCriteria(criteria);
    
        // Directly use the selected assignment name instead of relying on state
        if(selectedAssignmentName === 'End theory exam'){
            setMarkingTurnValaue([]);
            setMarkingTurnValaue(prevValue => [...prevValue,"1st Marking", "2nd Marking"]);
            setChooseFinalMarkVisibility(true);
        }else if (selectedAssignmentName === 'End practical exam'){
            setMarkingTurnValaue([]);
            setMarkingTurnValaue(prevValue => [...prevValue,"(Practical) 1st Marking"]);
            setChooseFinalMarkVisibility(false);
            setFinalMarkSelectioDivVisibility(false);
        }else{
            setMarkingTurnValaue([]);
            var getVal = "("+selectedAssignmentName+") 1st Marking";
            setMarkingTurnValaue(prevValue => [...prevValue,getVal]);
            setChooseFinalMarkVisibility(false);
            setFinalMarkSelectioDivVisibility(false);
        }
    };

    const handleMarkingTurnChange = (e) => {
        const selectedMarkingTurnName = e.target.value;

        setChooseTurnMarking(prevValue => [...prevValue, selectedMarkingTurnName]);

        if(selectedMarkingTurnName === 'Final Marks'){
            setFinalMarkSelectioDivVisibility(true);
        }else{
            setFinalMarkSelectioDivVisibility(false);
        }

        
    }

    const handleSubmit = async () => {
        try {
            // console.log("Submitting CA Marks:", caMarks);
            // const dataToSubmit = caMarks.filter((_, index) => index === currentStudentIndex);

            // Flatten the caMarks array to include all students' marks
                const flattenedCaMarks = caMarks.flatMap((mark, index) => [
                    { ...mark, student_id: mark.student_id }
                ]);

                // Filter out any empty marks (in case there were any)
                const filteredCaMarks = flattenedCaMarks.filter(m => m.assignment_score !== '');

            await LecturerService.insertCAMarks(filteredCaMarks);
            // console.log("CA Marks submitted successfully!");
            toast.success("FA Marks submitted successfully!");

            // Reset the current student index
            setCurrentStudentIndex(0);

            // Reset the current student index
            setCurrentStudentIndex(0);

            // Reset the caMarks array
            setCaMarks([]);

            // Reset the regStudent array
            setRegStudent([]);

            // Reset the uniqueAssigmentName array
            setUniqueAssigmentName([]);

            // Reset the dataCAMarksAll array
            setDataCAMarksAll([]);

            // Reset the submitted state
            setSubmitted(false);

            window.location.reload();
            

        } catch (error) {
            // console.error("Error submitting CA Marks:", error);
        }

        setInterval(() => {
            window.location.reload();
          }, 1000);

        // setSubmitted(true);
    };

    // console.log(caMarks[currentStudentIndex]?.student_id);
    // console.log(caMarks);


    // const handleCACalculation = async () => {
    //     const cirtiriaName =  await LecturerService.getCA(course_id);
    //     // console.log(cirtiriaName);

    //     const stMarksCA = await LecturerService.getMarksForCA(course_id,currentAcademicYear);






    //     caMarks.map((mark, index) => {           //maping student ID

            
    //         const student_id = mark.student_id;         //get student ID
    //         console.log(mark);
    //         console.log(student_id);

    //         var CAFinalMarks = 0;               //Final CA marks
    //         var CAFinalMarksMargin = 0;         //Final CA marks margin
    //         var CAFinalMarksTotal = 0;          //Final CA marks total
    //         var TotalCalculatedCAPresentageArr = [];            //Total calculated CA marks as percentage
    //         var percentageMarginArr = [];               // Standerd percentage margin array

            

    //         cirtiriaName.map((name, index) => {                                 //maping criteria names
    //             // console.log(name);
                
    //             const no_of_conducted = name[5];                //store no of conducted
    //             const no_of_taken = +name[6];                    //store no of taken
    //             const percentage = +name[7];                     //store percentage taken
    //             const assessment_type = name[4];                //store assessment type (Quiz,Assignment,Mid theory exam, Mid practical exam etc...)
    //             const selected_type_ofassessment = name[11];        //Joined table column name  (CA,Mid,Final)
    //             var markArray = [];             //array to store marks of a particular assessment type (Quiz,Assignment etc...)


                
                
    //             stMarksCA.map((stMark, index) => {                              //maping student marks
    //                 // console.log(stMark);

    //                 if (stMark[20] == 0) { //checking student has repeated the module
                        
    //                 }
                    
    //                 if(student_id === stMark[1] && assessment_type === stMark[11]){    //checking assessment type with student marks
    //                     if (selected_type_ofassessment === 'Mid' && stMark[5]==='AB') {            //checking assessment type is Mid    
    //                             CAFinalMarks = 'WH';            //With held the final CA marks
    //                     }
    //                     markArray.push(stMark[5]);          //push marks to an array
    //                 }
                    
    //             })
    //             // console.log("Before sort",markArray);

                
    //             var sumOfCAMarks = 0;                   //sum of marks of a particular assessment type (Quiz,Assignment etc...)
    //             var calculatedCAMark_as_Precentage = 0;             //calculated marks as percentage of a particular assessment type (Quiz,Assignment etc...)

    //             percentageMarginArr.push(+percentage);       //push standerd percentage to an array

    //             for (let i = 0; i < markArray.length; i++) {        //Loop to check AB marks and replace as 0
    //                 if (markArray[i] === 'AB') {                //checking AB marks in array of particular assignment
    //                     markArray[i] = 0;               //replace AB marks as 0
    //                 }
    //             }

    //             const sortedCAMarks = [...markArray].sort((a, b) => b - a).slice(0, no_of_taken);       //Sort marks and get maximum marks according to number of taken

    //             // console.log("After sort",sortedCAMarks);


    //             for (let i = 0; i < sortedCAMarks.length; i++) {          
    //                 sumOfCAMarks += +(sortedCAMarks[i]);           //get sum of marks of a particular assessment type (Quiz,Assignment etc...)
    //             }

    //             // console.log("Sum of taken", sumOfCAMarks)


    //             sumOfCAMarks = +(+(+sumOfCAMarks)/no_of_taken);  //get average of marks of a particular assessment type (Quiz,Assignment etc...)
    //             console.log("Avg of taken", sumOfCAMarks)
                



    //             calculatedCAMark_as_Precentage = +(+((+sumOfCAMarks)/100)*percentage).toFixed(3);        //get calculated marks as percentage of a particular assessment type (Quiz,Assignment etc...)
    //             console.log("Percentage of AVG:", calculatedCAMark_as_Precentage);

                

    //             TotalCalculatedCAPresentageArr.push(+calculatedCAMark_as_Precentage);        //push calculated marks as percentage of a particular assessment type (Quiz,Assignment etc...) to an array
                 

    //         })              //End of the criteria names map

    //         console.log("TotalCalculatedCAPresentageArr",TotalCalculatedCAPresentageArr);


    //         for (let i = 0; i < percentageMarginArr.length; i++) {                  //Loop to get sum of standerd percentage
    //             CAFinalMarksMargin += +(percentageMarginArr[i]);
    //         }

    //         CAFinalMarksMargin = +(+(+(+CAFinalMarksMargin)/2)-0.5).toFixed(3);               //get minimum percentage to pass the CA - margin

    //         for (let i = 0; i < TotalCalculatedCAPresentageArr.length; i++) {        //Loop to get sum of calculated marks as percentage of a particular assessment type (Quiz,Assignment etc...)
    //             CAFinalMarksTotal += +TotalCalculatedCAPresentageArr[i];      //get sum of calculated marks percentages the student has got
    //         }

    //         CAFinalMarksTotal = CAFinalMarksTotal.toFixed(3);          //convert to 3 decimal points
    //         console.log("Total CA Marks:",CAFinalMarksTotal);
            

            

    //         if(CAFinalMarks === 'WH'){          //checking final CA marks is with held

    //             CAFinalMarks='WH';              //With held the final CA marks

    //         }else{                    //checking final CA marks is not with held

    //             if(CAFinalMarksTotal>=CAFinalMarksMargin){          //checking student has got more than or equal to minimum percentage to pass the CA
    //                 CAFinalMarks='Eligible';        //Eligible for the final exam
    //             }else{
    //                 CAFinalMarks='Not eligible';        //Not eligible for the final exam
    //             }
    //         }


    //         console.log("Student : ",student_id," , CA Marks : ",CAFinalMarksTotal, ", Eligibility : ",CAFinalMarks);       //Print final CA marks

    //     });         //End of the student ID map
        
    // };

    const handleAbsent = async () => {
        const absentMarks = 'AB';
        
        const updatedCaMarks = caMarks.map((mark, index) =>
            index === currentStudentIndex
                ? {
                      ...mark,
                      assignment_score: absentMarks,
                      assignment_name: chooseTurnMarking[0],
                      evaluation_criteria_id: selectedCriteria.evaluationcriteria_id
                  }
                : mark
        );

        // Ensure we don't have any duplicate entries
        const uniqueCaMarks = [...new Map(updatedCaMarks.map(item => [JSON.stringify(item), item])).values()];

        // console.log("Updated CA Marks:", updatedCaMarks);
        setCaMarks(uniqueCaMarks);
    }

    const handleRadioChange = (event) => {                  //Function to handle radio change
        setSelectedMarkingOption(event.target.value);
        setFinalMarkSelectButtonVisibility(true);
         
    };

    const GenerateButtonFunctionality = async ()=>{

        const result = await LecturerService.GenerateFinalMarksFromEnd(selectedAssessmentTypeValue[0],course_id,selectedMarkingOption,academicYear);
        console.log(selectedAssessmentTypeValue[0]);
        console.log(course_id);
        console.log(selectedMarkingOption);
        console.log(academicYear);
        toast.success("Generating Final mark...")

        setInterval(() => {
            window.location.reload();
          }, 1000);
        

    }

    const CalculateRoundedMarks = async () => {
        try {
            const result = await axios.get(`http://localhost:9090/api/grade/calculateRoundedMark/${course_id}/${academicYear}`);
            toast.success("Marks Calculated successfully!");
            console.log(result);
            
        } catch (error) {
            
        }

        setInterval(() => {
            window.location.reload();
          }, 1000);
        
        
    }

    return (
        <div className='container' style={{marginTop:"70px"}}>
            <ToastContainer />
            {
                loader ? ( 

                    
                    <div style={{margin:"100px",display:"flex"}}>

                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className=' h4 mx-3' style={{color:"maroon"}}>Data is Loading...</div>
                    </div>
                    
                
                ) : (
                
                <>


            <div className='container' style={{ marginTop: "70px" }}>
                <h4>Final Assessment Marks Entry : <span style={{ color: "maroon" }}>{course_name} - {course_id}</span></h4>
                <br />
                {/* <h4>Level: {level}</h4>
                <h4>Semester: {semester}</h4>
                <h4>reversedata: {reversedata}</h4> */}
            </div>

            <div className=' row' >
            <div className=' col-8 p-4 shadow-lg' style={{marginRight:"20px"}}>
                <div>
                    <label className=' form-label'>Select Assessment Type:</label>
                    <select className="form-select" aria-label="Default select example" style={{ width: "350px" }} onChange={handleCriteriaChange}>
                        <option disabled selected>Select Final Assessment Type</option>
                        
                        {
                            evaluationCriteria.map((criteria, index) => (
                                <option key={index} >{criteria.assignment_name}</option>
                            ))
                        }
                    </select>
                </div>
                <div className=' mt-4'>
                    <label className=' form-label'>Select The Turn of Exam Marking</label>
                    <select className="form-select" aria-label="Default select example" style={{ width: "350px" }} onChange={handleMarkingTurnChange}>
                        <option disabled selected>Select Turn</option>
                        {
                            markingTurnValaue.map((turn, index) => (
                                <option key={index} >{turn}</option>
                            ))

                        }
                        {
                            choosFinalMarkVisibility ? <option>Final Marks</option> : null
                        }
                    </select>
                </div>
            
            

            
            <div style={{ marginTop: '70px'}}>
                {
                    finalMarkSelectioDivVisibility ? (                  //Radio button selection visibility
                        <>
                        <label style={{color:"blue",marginBottom:"30px"}}>Select one option to generate final marks from 1st marking and 2nd marking</label><br/>

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="1st Marking" onChange={handleRadioChange}></input>
                            <label className="form-check-label" >1st Marking</label>
                        </div>

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="2nd Marking" onChange={handleRadioChange}></input>
                            <label className="form-check-label" >2nd Marking</label>
                        </div>

                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="average" onChange={handleRadioChange}></input>
                            <label className="form-check-label" >Average of Both</label>
                        </div>

                        
                        </>
                    ):(
                        <>
                            {regStudent.length > 0 && (
                                <>
                                    {/* {console.log(regStudent[currentStudentIndex].id)} */}
                                    <label>
                                        Student ID : <span style={{ color: "maroon" }}> <b>{caMarks[currentStudentIndex]?.student_id}</b> </span>
                                        
                                    </label>


                                    <div style={{display:"flex",marginTop:"20px"}}>
                                        <div style={{display:"flex"}}>
                                            <label className=' form-label' style={{marginRight:"10px"}}>
                                                Marks :
                                            </label>
                                            <input className='form-control' style={{ width: '200px',maxHeight:"40px" }}
                                                placeholder={caMarks[currentStudentIndex]?.assignment_score === 'AB' ? 'AB' : 'Enter Marks'}
                                                type="number"
                                                value={caMarks[currentStudentIndex]?.assignment_score || ''}
                                                onChange={handleMarksChange}
                                            />
                                        </div>
                                        <div className=' mx-3'>
                                            <label htmlFor="" className=' form-label text-danger mx-4'>If This Student Absent Click Absent Button</label>
                                            <br />
                                            <button className=' btn btn-dark btn-sm mx-4' style={{width:"100px"}} onClick={handleAbsent}>Absent</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        
                        </>
                    )
                }

                
            </div>

            {
                finalMarkSelectioDivVisibility ? (                  //Disable next previous button and show calculate button
                    <div style={{ marginTop: '20px' }}>
                        
                        <button className='btn btn-dark btn-sm'  style={{width:"160px"}} disabled={!finalMarkSelectButtonVisibility} onClick={GenerateButtonFunctionality}>
                            Generate Final Marks
                        </button>
                    </div>
                ):(
                    <div style={{ marginTop: '20px' }}>
                        <button className='btn btn-outline-dark btn-sm'  style={{width:"100px"}} onClick={handlePrevClick} disabled={currentStudentIndex === 0}>
                            Previous
                        </button>
                        <button className='btn btn-outline-dark btn-sm'  onClick={handleNextClick} disabled={currentStudentIndex >= regStudent.length - 1} style={{ marginLeft: '10px' ,width:"100px"}}>
                            Next
                        </button>
                    <div style={{ marginTop: '20px' }}>
                {currentStudentIndex === regStudent.length - 1 && (
                    <p style={{color:"red"}}>Last Student ID...</p>
                )}
            </div>
            </div>
                )
            }
            
            </div>
            <div className=' col-3 shadow-lg p-4' >
                <div>
                    <label className=' form-label text-danger'  >{submitButtonErrorMSG}</label>
                    <br />
                    <button className='btn btn-outline-success btn-sm' style={{width:"100px"}} onClick={handleSubmit} disabled={isSubmitDisabled}>
                        Submit
                    </button>
                </div>
                <table className=' table mx-1'>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            caMarks.map((mark, index) => (
                                <tr key={index}>
                                    <td>{mark.student_id}</td>
                                    <td>{mark.assignment_score}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            </div>

            

            <div className=' row mt-5' >
                <h3>
                    All Students 
                </h3>
                <div className=''>
                    <table className=' table mx-1'>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                {
                                    uniqueAssigmentName.map((name, index) => (
                                        <th key={index}>{name}</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                regStudent.map((student, index) => (
                                    <tr key={index}>
                                        <td>{student}</td>
                                        {
                                            uniqueAssigmentName.map((name, index) => (
                                                <td key={index}>
                                                    {
                                                        dataCAMarksAll
                                                            .filter(item => item.student_id === student && item.assignment_name === name)
                                                            .map((item, index) => (
                                                                <span key={index}>{item.assignment_score}</span>
                                                            ))
                                                    }
                                                </td>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <button className=' btn btn-dark btn-sm' disabled={finalizedBtnDisable} onClick={CalculateRoundedMarks}>Final Assessment Finalized</button>
                            
                </div>
            </div>
            </>)}
            
        </div>
    );
}
