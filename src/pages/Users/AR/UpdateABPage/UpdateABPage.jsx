import React from 'react'
import { Redirect, useParams } from 'react-router-dom';
import './updateABPage.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import BackButton from '../../../../components/Users/AR/BackButton/BackButton';


export default function UpdateABPage() {
    const history = useHistory();

  

    

    const studentDetails = useParams();     //Get the student details from the URL
    const [newScore,setNewScore]=useState('');    //Use state to store the new score
    const [newGrade,setNewGrade]=useState('');    //Use state to store the new grade
    const [medicalListUploaded,setMedicalListUploaded]=useState(false);     //Use state to store whether the medical list is uploaded or not
    const [stateOfTheMedicalSubmission,setStateOfTheMedicalSubmission]=useState('');    //Use state to store the state of the medical submission
    const [stateOfTheMedicalSubmissionColor,setStateOfTheMedicalSubmissionColor]=useState('');    //Use state to store the color of the medical submission state

    const [loading,setLoading] = useState(false); //Use state to store the loading state


    let academicYearDetails = {             //Object to store the academic year details
        previous_academic_year:"",
        current_academic_year:"",
        current_semester:""
    }

    let existingGrade = {                    //Object to store the pervious grade details of the student
        id:"",
        student_id:"",
        course_id: "",
        level:"",
        semester:"",
        total_ca_mark:"",
        ca_eligibility:"",
        total_final_mark:"",
        total_rounded_mark:"",
        grade:"",
        gpv:"",


    }

    let updateMarksTableOject = {     //Object to store the updated marks data
        course_id: studentDetails.course_id,                        //Set the course id ininially
        student_id: studentDetails.student_id,                      //Set the student id initially
        new_score: newScore,                                        //Set the new score initially
        marks_table_exam_type: studentDetails.marks_table_exam_type,                        //Set the exam type in marks table  
        academic_year: studentDetails.academic_year,                //Set the academic year initially
        exam_type: studentDetails.exam_type                         //Set the exam type in evaluation criteria

    };



    const decrementACYear =(String)=>{
        const year = String.split("-");
        var preYear = parseInt(year[0])-1;
        var postYear = parseInt(year[1])-1;
         return (preYear+"-"+postYear);

    }






    const loadAllMedicalSubmissions = async() => {   //Function to load the medical submission details from the backend


        setLoading(true);

        try{
            const result = await axios.get(`http://localhost:9090/api/AssistantRegistrar/getAllMedicalSubmissionsByYear/${studentDetails.academic_year}`);   //Get all the medical submission details from the backend
        
        
            if(result.data.length>0){    //condition to check if the medical list is uploaded
            
                setMedicalListUploaded(true);   //Set the medicalListUploaded state to true if the medical list is uploaded
            

                const selectedStudentMedicalDetails = await axios.get(`http://localhost:9090/api/AssistantRegistrar/getSelectedStudentMedicalDetails/${studentDetails.student_id}/${studentDetails.course_id}/${studentDetails.academic_year}/${studentDetails.midORend}`);   //Get the selected student medical details from the backend
                if(selectedStudentMedicalDetails.data.length>0){    //condition to check whether the selected student has submitted a medical or not

                    await selectedStudentMedicalDetails.data.map((element)=>{       //Map the selected student medical details
                        
                        if (element['medical_state'].toLowerCase()==='Approved'.toLowerCase()){   //condition to check whether the medical submission is approved or not
                            setNewScore("MC");          //Set the new score to MC if the medical submission is approved
                            setStateOfTheMedicalSubmissionColor("green");     //Set the color of the medical submission state to green
                            setStateOfTheMedicalSubmission("Medical submission has approved.");    //Set the state of the medical submission
                        }else{
                            setNewScore("F");          //Set the new score to F if the medical submission is not approved
                            setStateOfTheMedicalSubmissionColor("red");    //Set the color of the medical submission state to red
                            setStateOfTheMedicalSubmission("Medical submission has rejected.");    //Set the state of the medical submission
                        }
                    })
                }
                else{
                    setNewScore("F");                 //Set the new score to F if the selected student has not submitted a medical
                    setStateOfTheMedicalSubmissionColor("red");    //Set the color of the medical submission state to red
                    setStateOfTheMedicalSubmission("Student has not submitted a medical.");    //Set the state of the medical submission

                }

            }else{
                setMedicalListUploaded(false);   //Set the medicalListUploaded state to false if the medical list is not uploaded   
                toast.error('Medical List is still not uploaded for the relevent academic year...',{autoClose:2000});    //Show a toast message 
        
            }
            setLoading(false);

        }catch(e){
            console.log(e)
        }

        

        
    };

    


    const updateGrade = async()=>{              //Function to update the student grade

        updateMarksTableOject.course_id = studentDetails.course_id;           //Set the course id update in marks
        updateMarksTableOject.student_id = studentDetails.student_id;         //Set the student id update in marks
        updateMarksTableOject.new_score = newScore;                           //Set the new score update in marks
        updateMarksTableOject.exam_type = studentDetails.exam_type;           //Set the exam type update in marks
        updateMarksTableOject.academic_year = studentDetails.academic_year;   //Set the academic year update in marks
        updateMarksTableOject.marks_table_exam_type = studentDetails.marks_table_exam_type;   //Set the exam type update in marks table
        

        

        try{
            setLoading(true);
            const selectedStudentGrade = await axios.get(`http://localhost:9090/api/AssistantRegistrar/findSelectedStudentGrade/${studentDetails.course_id}/${studentDetails.student_id}`);   //Get the selected student grade from the backend
            
            if(selectedStudentGrade.data.length>0){    //condition to check whether the selected student has a grade or not (Grade should be there )
                existingGrade.id=selectedStudentGrade.data[0].id;                                            //Set existing id in the grade table
                existingGrade.student_id=selectedStudentGrade.data[0].student_id;                            //Set existing student id in the grade table
                existingGrade.course_id=selectedStudentGrade.data[0].course_id;                              //Set existing course id in the grade table
                existingGrade.level= selectedStudentGrade.data[0].level;                                     //Set existing level in the grade table
                existingGrade.semester = selectedStudentGrade.data[0].semester;                              //Set existing semester in the grade table
                existingGrade.total_ca_mark = selectedStudentGrade.data[0].total_ca_mark;                    //Set existing total ca mark in the grade table
                existingGrade.ca_eligibility = selectedStudentGrade.data[0].ca_eligibility;                  //Set existing ca eligibility in the grade table
                existingGrade.total_final_mark = selectedStudentGrade.data[0].total_final_mark;              //Set existing total final mark in the grade table
                existingGrade.total_rounded_mark = selectedStudentGrade.data[0].total_rounded_mark;          //Set existing total rounded mark in the grade table
                existingGrade.grade = selectedStudentGrade.data[0].grade;                                    //Set existing grade in the grade table
                existingGrade.gpv = selectedStudentGrade.data[0].gpv;                                        //Set existing gpv in the grade table
            }
            setLoading(false);
        }catch(err){
            console.log(err);
        }


        




        try{
            setLoading(true);
            const academicDetails = await axios.get(`http://localhost:9090/api/AssistantRegistrar/getAcademicYearDetails`)              //Get academic year details to find current and previous academic year
            if(academicDetails.data.length>0){                                                                                    //condition to check whether the academic year details are available
                academicYearDetails.previous_academic_year = academicDetails.data[0].previous_academic_year;                //Set the previous academic year
                academicYearDetails.current_academic_year = academicDetails.data[0].current_academic_year;                  //Set the current academic year
                academicYearDetails.current_semester = academicDetails.data[0].current_semester;                            //Set the current semester

            }else{
                toast.error('Error with getting academic year details',{autoClose:2000});                         //if academicy year details are not available show a toast message
            }

            setLoading(false);
        }
        catch(error){
            toast.error(error,{autoClose:2000});             //if there is a error with getting academic year details show a toast message
            console.log(error);
        }

        

        try{

            setLoading(true);
            // const marksList =await axios.get(`http://localhost:9090/api/AssistantRegistrar/getSelectedStudentSelectedExamMarksBySelectedCourseAndSelectedAcademicYear/${studentDetails.student_id}/${studentDetails.course_id}/${academicYearDetails.previous_academic_year}/${studentDetails.exam_type}`);   //Get the selected student marks by selected course in previous academic year (to check whether the student is a propper student or not)
            
            const repeatStatus = await axios.get(`http://localhost:9090/api/AssistantRegistrar/checkStudentRepeatStatus/${studentDetails.student_id}/${studentDetails.course_id}/${studentDetails.academic_year}`);   //Get the repeat status of the student

            setLoading(false);

            console.log("lebgth" , repeatStatus.data[0])

            // if(repeatStatus.data.length>0){    //condition to check whether the repeat status is not available
                
                if(repeatStatus.data[0].is_repeat==0){    //condition to check whether the selected student dont have marks in previous academic year (meanse the student is a propper student)

                    console.log("propper")
                
                    /*---------------------------------------------------------------------Scenario for a propper student---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
                        
                    if (studentDetails.midORend.toLowerCase()=="Mid".toLowerCase()){                   //Condition to check whether the exam is a mid exam      - proper batch
                        if(newScore.toLowerCase()==="F".toLowerCase()){             //condition to check whether the new grade is F
                                existingGrade.ca_eligibility="Not eligible";     //Set the ca eligibility to not eligible
                                existingGrade.grade="F";     //Set the grade to F
                        }

                        else if(newScore.toLowerCase()==="MC".toLowerCase()){           //condition to check whether the new grade is MC

                            existingGrade.grade="MC";        //Set the grade to MC

                            if(existingGrade.ca_eligibility.toLowerCase()==="WH".toLowerCase()){            //condition to check whether the ca eligibility is pending
                                existingGrade.ca_eligibility="Eligible";                 //Set the ca eligibility to eligible
                            }
                        }

                        try{

                            setLoading(true);
                            const updateGradeResult= await axios.put(`http://localhost:9090/api/AssistantRegistrar/updateStudentFinalGrade`,existingGrade);   //Update the  grade of a propper student with the new grade and other details in Mid exam scenario 
                            toast.success('Final grade updated successfully',{autoClose:2000});     //Show a toast message
                            setLoading(false);
                            
                        }
                        catch(error){
                            toast.error(error,{autoClose:2000});        //Show a toast message
                            console.log(error);
                        }


                        try{
                            setLoading(true);
                            const update = await axios.put("http://localhost:9090/api/AssistantRegistrar/updateStudentScore" , updateMarksTableOject);   //Update the student AB exam score  with the new score (MC or F)
                            if(update.data<0){     //condition to check is there a error with updating the grade
                                toast.error('Error with updating AB score with new score',{autoClose:2000}); 
                            }else{
                                toast.success('New score updated successfully',{autoClose:2000});
                            }
                            setLoading(false);
                        }
                        catch(error){
                            toast.error(error,{autoClose:2000});
                            console.log(error);
                        }

                        setTimeout(() => {
                            history.goBack();     //Back to the previous page
                        }, 2000);

                        
                    } else if(studentDetails.midORend.toLowerCase()=="End".toLowerCase()){           //Condition to check whether the exam is a end exam - proper batch

                        var isMidAB = false;            //Store mid Absent status
                        
                        // if(studentDetails.exam_type.toLowerCase()=="End theory exam".toLowerCase()){            //Condition to check whether the exam is a theory exam
                            
                            try{
                                setLoading(true);
                                const midExamMarksList= await axios.get(`http://localhost:9090/api/AssistantRegistrar/getSelectedStudentSelectedExamMarksBySelectedCourseAndSelectedAcademicYear/${studentDetails.student_id}/${studentDetails.course_id}/${studentDetails.academic_year}/Mid`);   //Get the mid  exam results of the student in the current academic year
                            

                                setLoading(false);
                                
                            
                                if((!midExamMarksList.data.length>0) && existingGrade.ca_eligibility.toLocaleLowerCase() !=="Not eligible".toLocaleLowerCase()){    //condition if student don not have mid exam and have MC for end exam and ca eligibility is eligible
                                    
                                    if(updateMarksTableOject.new_score.toLowerCase() === 'F'.toLowerCase()){        //Check whether medical not approved (new score F )
                                        existingGrade.grade = "E*";                 //Set Grade to E*       
                                    }else if(updateMarksTableOject.new_score.toLowerCase() === 'MC'.toLowerCase()){             //Check whether medical approved (new score MC)
                                        existingGrade.grade="MC";                   //Set the grade to WH

                                    }

    
                                }else if(midExamMarksList.data.length>0 && existingGrade.ca_eligibility.toLocaleLowerCase() !=="Not eligible".toLocaleLowerCase() ){           // condition if student have one or more mid exams and 
                                    

                                    
                                    midExamMarksList.data.map((element)=>{                      //Map the mid exam marks list
                                        if(element.assignment_score.toLowerCase() === "AB".toLowerCase()){                   //Condition to check whether the student has a F grade in the mid exam
                                            isMidAB = true;       //Set the mid AB status to true
                                        }
                                    })

                                    




                                    var isMidFail = false;      //Variable to store mid fail pass status
                                    var isMidMC = false; //Variable
                                
                                    midExamMarksList.data.map((element)=>{                      //Map the mid exam marks list
                                        if(element.assignment_score.toLowerCase() === "F".toLowerCase()){                   //Condition to check whether the student has a F grade in the mid exam
                                            isMidFail = true;       //Set the mid fail status to true
                                        }
                                        if(element.assignment_score.toLowerCase() === "MC".toLowerCase()){                   //Condition to check whether the student has a F grade in the mid exam
                                            isMidMC = true;       //Set the mid fail status to true
                                        }
                                    })
    
                                    if(isMidMC==false){
                                        if(isMidFail == false){                     //Condition to check whether the student has passed the mid exam

                                            if(updateMarksTableOject.new_score.toLowerCase()==="MC".toLowerCase()){         //Check if the medical is accepted (new score MC)
                                                existingGrade.grade="MC";                   //Set the grade to WH
                                            }else if (updateMarksTableOject.new_score.toLowerCase()==="F".toLowerCase()){               //Check if the medical is not accepted (new score F)
                                                existingGrade.grade="E*";                   //Set the grade to E*
                                            }
    
                                        }
                                    }
                                    
        
                                    

                                    
                                }

                            }catch(err){
                                toast.error('Error with geting student mid marks',{autoClose:2000});
                                console.log(err);
                            }

                        if(isMidAB==true){                  //If there is any AB mid exam existing and try to update end exam status, alert is desplay and not going to change grade and mark
                           
                            toast.error("This student has absent for the mid exam also. Please first check the medical for that exam.")
                        
                        }else{

                            try{

                                setLoading(true);

                                const update = await axios.put("http://localhost:9090/api/AssistantRegistrar/updateStudentScore" , updateMarksTableOject);   //Update the student AB exam score  with the new score (MC or F)
                                if(update.data<0){     //condition to check is there a error with updating the grade
                                    toast.error('Error with updating AB score with new score',{autoClose:2000}); 
                                }else{
                                    toast.success('New score updated successfully',{autoClose:2000});
                                }
                                setLoading(false);
                            }
                            catch(error){
                                toast.error(error,{autoClose:2000});
                                console.log(error);
                            }

                            try{
                                setLoading(true);
                                const updateGradeResult= await axios.put(`http://localhost:9090/api/AssistantRegistrar/updateStudentFinalGrade`,existingGrade);         //Update the  grade of a propper student with the new grade and other details in End exam scenario
                                toast.success('Final grade updated successfully',{autoClose:2000});             //Show a toast message
                                setLoading(false);
                            }
                            catch(error){
                                toast.error("Error occured while updating Grade of this student");        //Show a toast message
                                console.log(error);
    
                            }

                            setTimeout(() => {
                                history.goBack();     //Back to the previous page
                            }, 2000);

                        }

                        
                    }
                
















                    
                }else if(repeatStatus.data[0].is_repeat==1){

                    console.log("Repeat")
                    //condition to check whether the selected student has marks in previous academic year (meanse the student is a repeated student or a student who has a WH grade)

                /*---------------------------------------------------------------------Scenario for a repeated or WH student---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
                    
                    var decrementedAcYear = decrementACYear(studentDetails.academic_year);    //Get the previous academic year of the selected student
                    
                    //-----------------------------------------------------------------------------New Start



                    if(studentDetails.midORend.toLowerCase()=="Mid".toLowerCase()){             // If exam is a mid exam for repeat student

                        //Get previous mid result
                        setLoading(true);
                        const previousMidExamResult =await axios.get(`http://localhost:9090/api/AssistantRegistrar/getSelectedStudentSelectedExamMarksBySelectedCourseAndSelectedAcademicYear/${studentDetails.student_id}/${studentDetails.course_id}/${decrementedAcYear}/Mid`);   //Get the selected student previous mid exam marks 
                        setLoading(false);
                        if(previousMidExamResult.data.length >0){       //If there are previous mid result

                            var isMidMC =true;
                            previousMidExamResult.data.map((element)=>{                      //Map the mid exam marks list and ensure all mid exams are not equal to MC
                                if(element.assignment_score.toLowerCase() != "MC".toLocaleLowerCase()){             //If any previousMidExamResult is equal to MC
                                    isMidMC=false;                                  // set mid exam mc status false
                                }
                            })

                            if(isMidMC==true && existingGrade.grade.toLowerCase()=="MC".toLowerCase()){          //If mid exams are MC previous grade also MC

                                if(newScore.toLowerCase()=="MC".toLowerCase()){         //If mid medical has approvrd

                                    existingGrade.grade="MC";                           //Grade will be MC

                                    if(existingGrade.ca_eligibility=="WH"){             //If Ca is Pending
                                        existingGrade.ca_eligibility="Eligible";            //CA also become Eligible
                                    }
                                }else if(newScore.toLowerCase()=="F".toLowerCase()){     // Mid medical rejected
                                    existingGrade.grade="F";
                                    existingGrade.ca_eligibility="Not eligible";
                                }
                            }
                        }


                        try{            //Try for update marks
                            setLoading(true);
                            const update = await axios.put("http://localhost:9090/api/AssistantRegistrar/updateStudentScore" , updateMarksTableOject);   //Update the student AB exam score  with the new score (MC or F)
                            if(update.data<0){     //condition to check is there a error with updating the grade
                                toast.error('Error with updating AB score with new score',{autoClose:2000}); 
                            }else{
                                toast.success('New score updated successfully',{autoClose:2000});
                            }
                            setLoading(false);
                        }
                        catch(error){
                            toast.error(error,{autoClose:2000});
                            console.log(error);
                        }


                        try{        //try for update Grade 

                            setLoading(true);
                            const updateGradeResult= await axios.put(`http://localhost:9090/api/AssistantRegistrar/updateStudentFinalGrade`,existingGrade);   //Update the  grade of a propper student with the new grade and other details in Mid exam scenario 
                            toast.success('Final grade updated successfully',{autoClose:2000});     //Show a toast message
                            setLoading(false);
                            
                        }
                        catch(error){
                            toast.error(error,{autoClose:2000});        //Show a toast message
                            console.log(error);
                        }

                        setTimeout(() => {
                            history.goBack();     //Back to the previous page
                        }, 2000);


                        
                        
                    }else if(studentDetails.midORend.toLowerCase()=="End".toLowerCase()){               //If exam is a end exam for repeat student

                        var AbMidAvailability = false;          //If students have AB for Mid exam it becomes true otherwise false
                        var midMarkMCAvailability = false; //If students have

                        setLoading(true);
                        //Get mid exam marks of the same subject
                        const midExamMarksList= await axios.get(`http://localhost:9090/api/AssistantRegistrar/getSelectedStudentSelectedExamMarksBySelectedCourseAndSelectedAcademicYear/${studentDetails.student_id}/${studentDetails.course_id}/${studentDetails.academic_year}/Mid`);   //Get the mid  exam results of the student in the current academic year
                        setLoading(false);

                        if(midExamMarksList.data.length > 0){       // IF there are mid exam marks
                            midExamMarksList.data.map((element)=>{                      //Map the mid exam marks list
                                if(element.assignment_score.toLowerCase() === "AB".toLowerCase()){                   //Condition to check whether the student has a AB score in the mid exam
                                    AbMidAvailability = true;       //Set the mid AB status to true
                                    
                                }
                                if(element.assignment_score.toLowerCase() === "MC".toLowerCase()){                   //Condition to check whether the student has a MC score in the mid exam
                                    midMarkMCAvailability = true;       //Set the mid MC status to true
                                    
                                }

                            })
                        }

                        setLoading(true);
                        const previousEndExamResult =await axios.get(`http://localhost:9090/api/AssistantRegistrar/getSelectedStudentSelectedExamMarksBySelectedCourseAndSelectedAcademicYear/${studentDetails.student_id}/${studentDetails.course_id}/${decrementedAcYear}/End`);   //Get the selected student previous end exam marks 
                        setLoading(false);

                        if(previousEndExamResult.data.length >0 ){
                            var isEndMC =true;
                            previousEndExamResult.data.map((element)=>{                      //Map the mid exam marks list and ensure all mid exams are not equal to MC
                                if(element.assignment_score.toLowerCase() != "MC".toLocaleLowerCase()){             //If any previousMidExamResult is equal to MC
                                    isEndMC=false;                                  // set mid exam mc status false
                                }
                            })
                        }



                        if(isEndMC==true && existingGrade.grade.toLowerCase()=="MC".toLowerCase()){          //If mid exams are MC previous grade also MC

                            if(newScore.toLowerCase()=="MC".toLowerCase()){         //If mid medical has approvrd

                                existingGrade.grade="MC";                           //Grade will be MC

                            }else if(newScore.toLowerCase()=="F".toLowerCase()){     // Mid medical rejected
                                
                                if(midMarkMCAvailability==false){           //If mid exam has not MC
                                    existingGrade.grade="E*";           // Change grade to E*
                                }


                            }
                        }


                        if(AbMidAvailability==true){                  //If there is any AB mid exam existing and try to update end exam status, alert is desplay and not going to change grade and mark
                           
                            toast.error("This student has absent for the mid exam also. Please first check the medical for that exam.")
                        
                        }else{

                            try{

                                setLoading(true);

                                const update = await axios.put("http://localhost:9090/api/AssistantRegistrar/updateStudentScore" , updateMarksTableOject);   //Update the student AB exam score  with the new score (MC or F)
                                if(update.data<0){     //condition to check is there a error with updating the grade
                                    toast.error('Error with updating AB score with new score',{autoClose:2000}); 
                                }else{
                                    toast.success('New score updated successfully',{autoClose:2000});
                                }
                                setLoading(false);
                            }
                            
                            catch(error){
                                toast.error(error,{autoClose:2000});
                                console.log(error);
                            }

                            try{
                                setLoading(true);
                                const updateGradeResult= await axios.put(`http://localhost:9090/api/AssistantRegistrar/updateStudentFinalGrade`,existingGrade);         //Update the  grade of a propper student with the new grade and other details in End exam scenario
                                toast.success('Final grade updated successfully',{autoClose:2000});             //Show a toast message
                                setLoading(false);
                            }
                            catch(error){
                                toast.error("Error occured while updating Grade of this student");        //Show a toast message
                                console.log(error);
    
                            }

                            setTimeout(() => {
                                history.goBack();     //Back to the previous page
                            }, 2000);

                        }



                    }

                    
                    
                    
                    
                    
                    //-----------------------------------------------------------------------------New End
                    
                    
                   /* var isMidAB = false;            //Store mid Absent status

                
                    if(studentDetails.midORend.toLowerCase()=="Mid".toLowerCase()){         //Scenario for repeat student mid exam

                        setLoading(true);
                        const previousMidExamResult =await axios.get(`http://localhost:9090/api/AssistantRegistrar/getSelectedStudentSelectedExamMarksBySelectedCourseAndSelectedAcademicYear/${studentDetails.student_id}/${studentDetails.course_id}/${decrementedAcYear}/Mid`);   //Get the selected student previous mid exam marks 
                        setLoading(false);

                    
                        if((!previousMidExamResult.data.length>0) && existingGrade.grade=="MC" && newScore=="F"){    //condition if student do not have mid exams and previous grade is WH and new medical is rejected
                        
                            if (studentDetails.midORend.toLowerCase()=="End".toLowerCase()){            //Check if the exam is a End exam
                                existingGrade.grade="E*";        //Set the grade to F
                            } else if (studentDetails.midORend.toLowerCase()=="Mid".toLowerCase()){             //Check if the exam is a Mid exam
                                existingGrade.grade="F";            //Set the grade to F
                                existingGrade.ca_eligibility="Not eligible";            //Set CA eligibility to not eligible
                            }
                            console.log(decrementedAcYear)
                            console.log(previousMidExamResult.data.length);
                            console.log(existingGrade.grade)


                        }else if(previousMidExamResult.data.length>0 && existingGrade.grade=="MC"){             //If there areprevious mid exams results and eprevious grade is MC
                            
                            var isMidMC =true;
                            previousMidExamResult.data.map((element)=>{                      //Map the mid exam marks list and ensure all mid exams are not equal to MC
                                if(element.assignment_score.toLowerCase() != "MC".toLocaleLowerCase()){             //If any previousMidExamResult is equal to MC
                                    isMidMC=false;                                  // set mid exam mc status false
                                }
                            })


                            if(studentDetails.midORend.toLowerCase()=="Mid".toLowerCase()){             //If exam is mid exam
                                if(newScore=="MC" && isMidMC==true){            //If new score is MC and all previous mid exams have MC
                                    existingGrade.grade="MC";               //Set new Grade to MC
                                }else if (newScore=="F" && isMidMC==false){             //If new score is F and any previous mid exam has F
                                    existingGrade.grade="E*";        //Set the grade to F
                                }

                            }

                           

                            

                        }
                    }else if(studentDetails.midORend.toLowerCase()=="End".toLowerCase()){       //Scenario for end exam repeat students

                        
                        const midExamMarksList= await axios.get(`http://localhost:9090/api/AssistantRegistrar/getSelectedStudentSelectedExamMarksBySelectedCourseAndSelectedAcademicYear/${studentDetails.student_id}/${studentDetails.course_id}/${studentDetails.academic_year}/Mid`);   //Get the mid  exam results of the student in the current academic year


                        if(midExamMarksList.data.length > 0){       // IF there are mid exam marks
                            midExamMarksList.data.map((element)=>{                      //Map the mid exam marks list
                                if(element.assignment_score.toLowerCase() === "AB".toLowerCase()){                   //Condition to check whether the student has a F grade in the mid exam
                                    isMidAB = true;       //Set the mid AB status to true
                                }
                            })
                        }

                        


                        
                        setLoading(true);
                        const previousEndExamResult =await axios.get(`http://localhost:9090/api/AssistantRegistrar/getSelectedStudentSelectedExamMarksBySelectedCourseAndSelectedAcademicYear/${studentDetails.student_id}/${studentDetails.course_id}/${decrementedAcYear}/End`);   //Get the selected student previous End exam marks 
                        setLoading(false);

                        if((!previousEndExamResult.data.length>0) && existingGrade.grade=="MC" && newScore=="F"){    //condition if student do not have End exams and previous grade is WH and new medical is rejected
                        
                            if (studentDetails.midORend.toLowerCase()=="End".toLowerCase()){        //If exam is a end exam
                                existingGrade.grade="E*";        //Set the grade to F
                            } else if (studentDetails.midORend.toLowerCase()=="Mid".toLowerCase()){             //If exam is a mid exam
                                existingGrade.grade="F";                //Set the grade to F
                                existingGrade.ca_eligibility="Not eligible";        //Set CA eligibility to  not eligible
                            }

                            

                        }else if(previousEndExamResult.data.length>0 && existingGrade.grade=="MC"){             //If there are end exams and new previous grade is MC

                            var isEndMC =true;
                            previousEndExamResult.data.map((element)=>{                      //Map the mid exam marks list      
                                if(element.assignment_score.toLowerCase() != "MC".toLocaleLowerCase()){             //If previous mid exam is not MC
                                    isEndMC=false;              //Set end MC to false
                                }
                            })


                            if(studentDetails.midORend.toLowerCase()=="Mid".toLowerCase()){         //If exam type is MID
                                if (newScore=="F" && isEndMC==false){       //If new score is F and previous mis is mot MC
                                    existingGrade.grade="E*";        //Set the grade to F
                                }

                            }


                            

                        }

                    }

                    if(isMidAB==true){                  //If there is any AB mid exam existing and try to update end exam status, alert is desplay and not going to change grade and mark
                           
                        toast.error("This student has absent for the mid exam also. Please first check the medical for that exam.")
                    
                    }else{
                        
                        try{

                            setLoading(true);

                            const update = await axios.put("http://localhost:9090/api/AssistantRegistrar/updateStudentScore" , updateMarksTableOject);   //Update the student AB exam score  with the new score (MC or F)
                            if(update.data<0){     //condition to check is there a error with updating the grade
                                toast.error('Error with updating AB score with new score',{autoClose:2000}); 
                            }else{
                                toast.success('New score updated successfully',{autoClose:2000});
                            }
                            setLoading(false);
                        }
                        catch(error){
                            toast.error(error,{autoClose:2000});
                            console.log(error);
                        }

                        try{
                            setLoading(true);
                            const updateGradeResult= await axios.put(`http://localhost:9090/api/AssistantRegistrar/updateStudentFinalGrade`,existingGrade);         //Update the  grade of a propper student with the new grade and other details in End exam scenario
                            toast.success('Final grade updated successfully',{autoClose:2000});             //Show a toast message
                            setLoading(false);
                        }
                        catch(error){
                            toast.error("Error occured while updating Grade of this student");        //Show a toast message
                            console.log(error);

                        }
                    }*/
                

                }

            // }else{
            //     toast.error('No records found to identify course registration details',{autoClose:2000});        //Show a toast message
            // }
            setLoading(false);
        }
        catch(error){
            toast.error(error,{autoClose:2000});
            console.log(error);
        }

        
        



        // setTimeout(() => {
        //     history.goBack();     //Back to the previous page
        // }, 2000);

    };

    const [user, setUser] = useState({});   //Use state to store user data
    const storedData = localStorage.getItem('user');    //Get user data from local storage
  




























    useEffect(()=>{

        if(storedData){   //Check if user is logged in
            setUser(JSON.parse(storedData));      //Set user data
            
            if(JSON.parse(storedData).role != "ar"){     //Check if user is not a valid type one
              localStorage.removeItem('user');        //Remove user data and re direct to login page
            }
            
          }else{                          //If user is not logged in
            history.push('/login');       //Redirect to login page
          }
      
        
        loadAllMedicalSubmissions();        //Load the medical submission details when the page is loaded
    },[]);



    


  return (
    <div>
        <div className="formBg" style={{width:"50%",minHeight:"200px",marginLeft:"auto",marginRight:"auto",marginTop:"90px",paddingLeft:"30px",paddingRight:"30px",paddingTop:"30px",paddingBottom:"10px",backgroundColor:"#f5f5f5",boxShadow:"0 0 10px rgba(0, 0, 0, 0.2)",borderRadius:"10px"}}>
            {
                loading ? (
                    <div className="d-flex justify-content-center" style={{marginTop:"20%"}}>
                        <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                        </div>
                        <label style={{marginLeft:"10px"}}> Loading data</label>
                    </div>
                ):(
                    medicalListUploaded ? (
                        <form>
                            <table className='dataTable' style={{width:"100%"}}>
                                <tbody>
                                    <tr>
                                        <td style={{paddingBottom:"10px"}}><label className="labelkey" style={{fontWeight:"bold"}}>Student ID: </label></td>
                                        <td style={{paddingBottom:"10px"}}> <label className='labelValue' style={{width:"100%",marginLeft:"auto",marginRight:"auto",paddingLeft:"10px",paddingTop:"2px",paddingBottom:"2px",backgroundColor:"#ffffff",borderRadius:"10px",border:"1px solid #a1a1a138",boxShadow:"0 0 10px rgba(0, 0, 0, 0.1)"}}>{studentDetails.student_id}</label> </td>
                                    </tr>
                                    <tr>
                                        <td style={{paddingBottom:"10px"}}><label className="labelkey"style={{fontWeight:"bold"}}>Course ID: </label></td>
                                        <td style={{paddingBottom:"10px"}}> <label className='labelValue' style={{width:"100%",marginLeft:"auto",marginRight:"auto",paddingLeft:"10px",paddingTop:"2px",paddingBottom:"2px",backgroundColor:"#ffffff",borderRadius:"10px",border:"1px solid #a1a1a138",boxShadow:"0 0 10px rgba(0, 0, 0, 0.1)"}}>{studentDetails.course_id}</label> </td>
                                    </tr>
                                    <tr>
                                        <td style={{paddingBottom:"10px"}}><label className="labelkey" style={{fontWeight:"bold"}}>Course name: </label></td>
                                        <td style={{paddingBottom:"10px"}}> <label className='labelValue' style={{width:"100%",marginLeft:"auto",marginRight:"auto",paddingLeft:"10px",paddingTop:"2px",paddingBottom:"2px",backgroundColor:"#ffffff",borderRadius:"10px",border:"1px solid #a1a1a138",boxShadow:"0 0 10px rgba(0, 0, 0, 0.1)"}}>{studentDetails.course_name}</label> </td>
                                    </tr>
                                    <tr>
                                        <td style={{paddingBottom:"10px"}}><label className="labelkey" style={{fontWeight:"bold"}}>Exam: </label></td>
                                        <td style={{paddingBottom:"10px"}}> <label className='labelValue' style={{width:"100%",marginLeft:"auto",marginRight:"auto",paddingLeft:"10px",paddingTop:"2px",paddingBottom:"2px",backgroundColor:"#ffffff",borderRadius:"10px",border:"1px solid #a1a1a138",boxShadow:"0 0 10px rgba(0, 0, 0, 0.1)"}}>{studentDetails.exam_type}</label> </td>
                                    </tr>
                                    <tr>
                                        <td style={{paddingBottom:"10px"}}><label className="labelkey" style={{fontWeight:"bold"}}>Exam type: </label></td>
                                        <td style={{paddingBottom:"10px"}}> <label className='labelValue' style={{width:"100%",marginLeft:"auto",marginRight:"auto",paddingLeft:"10px",paddingTop:"2px",paddingBottom:"2px",backgroundColor:"#ffffff",borderRadius:"10px",border:"1px solid #a1a1a138",boxShadow:"0 0 10px rgba(0, 0, 0, 0.1)"}}>{studentDetails.marks_table_exam_type}</label> </td>
                                    </tr>
                                    <tr>
                                        <td style={{paddingBottom:"10px"}}><label className="labelkey" style={{fontWeight:"bold"}}>Academic year: </label></td>
                                        <td style={{paddingBottom:"10px"}}> <label className='labelValue' style={{width:"100%",marginLeft:"auto",marginRight:"auto",paddingLeft:"10px",paddingTop:"2px",paddingBottom:"2px",backgroundColor:"#ffffff",borderRadius:"10px",border:"1px solid #a1a1a138",boxShadow:"0 0 10px rgba(0, 0, 0, 0.1)"}}>{studentDetails.academic_year}</label> </td>
                                    </tr>
                                    <tr>
                                        <td style={{paddingBottom:"10px"}}><label className="labelkey" style={{fontWeight:"bold"}}>Current score: </label></td>
                                        <td style={{paddingBottom:"10px"}}> <label className='labelValue' style={{width:"100%",marginLeft:"auto",marginRight:"auto",paddingLeft:"10px",paddingTop:"2px",paddingBottom:"2px",backgroundColor:"#ffffff",borderRadius:"10px",border:"1px solid #a1a1a138",boxShadow:"0 0 10px rgba(0, 0, 0, 0.1)"}}>{studentDetails.grade}</label> </td>
                                    </tr>
                                    <tr>
                                        <td style={{paddingBottom:"10px"}}><label className="labelkey" style={{fontWeight:"bold"}}>New score: </label></td>
                                        <td style={{paddingBottom:"10px"}}> <label className='labelValue' style={{width:"100%",marginLeft:"auto",marginRight:"auto",paddingLeft:"10px",paddingTop:"2px",paddingBottom:"2px",backgroundColor:"#ffffff",borderRadius:"10px",border:"1px solid #a1a1a138",boxShadow:"0 0 10px rgba(0, 0, 0, 0.1)",color:stateOfTheMedicalSubmissionColor,fontWeight:'bold'}} >{newScore}</label> </td>
                                    </tr>
                                    <tr>
                                        {stateOfTheMedicalSubmissionColor==="green" ? (
                                            <td colSpan={2} ><label className="statusLabel" style={{color:'#1f9e50',width:"100%",textAlign:"center",marginTop:"20px",fontSize:"18px",fontWeight:"bold"}}>{stateOfTheMedicalSubmission}</label></td>
                                        ):(
                                            <td colSpan={2} ><label className="statusLabel" style={{color:'#d31a1a',width:"100%",textAlign:"center",marginTop:"20px",fontSize:"18px",fontWeight:"bold"}}>{stateOfTheMedicalSubmission}</label></td>
                                        )}
                                        
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    ):(
                        <div className="alert alert-danger" role="alert" style={{marginTop:'100px',textAlign:'center',width:'80%',marginLeft:'auto',marginRight:'auto'}}>
                            <h5>Medical List is pending...</h5>
                        </div>
                    )
                )
                
            }
            <ToastContainer />
            <div className='right-aligned-div'><br/>
            <button className="btn btn-success btn-sm" onClick={updateGrade} >Update</button>&nbsp;&nbsp;
              <BackButton/> <br/>&nbsp;
            </div>  
        </div>
    </div>
  )
}
