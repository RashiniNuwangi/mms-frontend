import React, { useEffect } from 'react'
import './homePageStudent.css'
import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';




export default function HomePageStudent() {

  const [user, setUser] = useState({});
  const storedData = localStorage.getItem('user');


  const history = useHistory();

  const [studentId, setStudentId] = useState(null); // authState.idToken.claims.sub
  const [studentName, setStudentName] =useState(null);    //Use state to store student name
  const [studentEmail, setStudentEmail] = useState(null);    //Use state to store student email
  const [studentRegisteredYear, setStudentRegisteredYear] = useState(null);   //Use state to store student registered year
  const [studentDepartmentId, setStudentDepartmentId] = useState(null);   //Use state to store student department id
  const [studentLevel, setStudentLevel] = useState(null);     //Use state to store student level
  const [studentSemester, setStudentSemester] = useState(null);     //Use state to store student semester
  const [studentSGPA, setStudentSGPA] = useState(null);     //Use state to store student GPA
  const [studentCGPA, setStudentCGPA] = useState(null);     //Use state to store student CGPA





  const getStudentDetails = async () => {         // load the student details

    if(studentEmail != null){       //Check if student email is not null

      try{
        const studentDetailsResult = await axios.get(`http://localhost:9090/api/Student/getStudentDetailsByEmail/${studentEmail}`)    //Calll Api to get student data
        setStudentId(studentDetailsResult.data.user_id);
        setStudentName(studentDetailsResult.data.name_with_initials);
        setStudentRegisteredYear(studentDetailsResult.data.registered_year);
        setStudentDepartmentId(studentDetailsResult.data.department_id);

        getStudentLevelSemester(studentDetailsResult.data.user_id);      // Load the student level and semester
        getLatestGPA(studentDetailsResult.data.user_id);       // Load the latest GPA

      }catch(error){
        console.error(`Error - ${error}`);
      }


    }
  }





   const getStudentLevelSemester = async (StuID) => {         // load the student level and semester
    try{
      const studentLevelSemester = await axios.get(`http://localhost:9090/api/Student/getStudentLevelAndSemester/${StuID}`)     //Call Api to get student level and semester
      setStudentLevel(studentLevelSemester.data.level);
      setStudentSemester(studentLevelSemester.data.semester);
    }catch(error){
      console.error(`Error - ${error}`);
    }
  
  }

  const getLatestGPA = async (StuID) => {         // load the latest GPA
    
    try{
        const latestGPAResponse = await axios.get(`http://localhost:9090/api/Student/getLatestGPA/${StuID}`)        //Call Api to get latest GPA
        setStudentSGPA(parseFloat(latestGPAResponse.data.sgpa).toFixed(2));
        setStudentCGPA(parseFloat(latestGPAResponse.data.cgpa).toFixed(2));

    }catch(error){
      console.error(`Error - ${error}`);
    }
  
  }


  useEffect(() => {
    if(storedData){
      setUser(JSON.parse(storedData));
    }else{
      setUser(null);
    }

    if(user != null){
      setStudentEmail(user.email);
    }
    getStudentDetails();
  }, [studentEmail,studentDepartmentId,studentLevel,studentSemester])


  


  return (
    
    <div className='student-home-page-main-div'>

      <div className='student-home-page-main-body'>


        <div className='row course-row-1'>
            <div className='col course-col-1'><label>Name - {studentName}</label></div>
            <div className='col course-col-1'><label>Index - {studentId}</label></div>
            <div className='col course-col-1'><label>Department - {studentDepartmentId}</label></div>
            <div className='col course-col-1'><label>Level - {studentLevel}</label></div>
        </div>

        <div className='row course-row-1'>
          {
            studentSGPA == null ? (
              null
            ):(
            <div className='course-col-1 custom-lable-1'><label>SGPA - {studentSGPA}</label></div>
            )
          }
          {
            studentCGPA == null ? (
              null
            ):(
            <div className='course-col-1 custom-lable-1'><label>CGPA - {studentCGPA}</label></div>
            )
          }
        </div>
          

        <div className='row course-row-2'>

          <div className='col grade-col-1'>

          <div className='row'>

            
            <div className="col mb-4"> 
              <div className="card text-center functionCard">
                <div className="card-body">
                    <br/><h5 className="card-title"> Medicals</h5><br/>
                  <a href="/studentMedicalView" className="btn btn-primary home-page-class-button">View</a>
                </div>
              </div>
            </div>

            <div className="col mb-4"> 
              <div className="card text-center functionCard">
                <div className="card-body">
                    <br/><h5 className="card-title"> CA Eligibility</h5><br/>
                  <a href="/studentEligibilityView" className="btn btn-primary home-page-class-button">View</a>
                </div>
              </div>
            </div>

            <div className="col mb-4"> 
              <div className="card text-center functionCard">
                <div className="card-body">
                    <br/><h5 className="card-title"> With-held Subjects</h5><br/>
                  <a href="/studentViewWithHeldSubjects" className="btn btn-primary home-page-class-button">View</a>
                </div>
              </div>
            </div>

            <div className="col mb-4"> 
              <div className="card text-center functionCard">
                <div className="card-body">
                    <br/><h5 className="card-title"> Published Marks Sheets</h5><br/>
                  <a href="/StudentViewMarkSheetList" className="btn btn-primary home-page-class-button">View</a>
                </div>
              </div>
            </div>

            <div className="col mb-4"> 
              <div className="card text-center functionCard">
                <div className="card-body">
                    <br/><h5 className="card-title"> Course Details</h5><br/>
                  <a href="/studentViewCourseDetails" className="btn btn-primary home-page-class-button">View</a>
                </div>
              </div>
            </div>

          </div>
            
        
          </div>

        </div>

      </div>

      
    </div>
    
  )
}
