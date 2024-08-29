import React from 'react'

export default function SAProfile() {
  return (
    <div className=' container' style={{marginTop:"70px"}}>
            <div className=' py-4'>
              
                <div style={{display:"flex"}}>
                </div> 
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh',marginTop:"40px"}}>
            <div className=' center' >
              <div className='row g-3'>

                <div className="card shadow m-4" style={{width: "18rem"}}>
                  <div className="card-body ">
                    <h5 className="card-title py-2">Student Management</h5>
                    {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                    <a href="/manageallstudents"  className="btn btn-primary btn-sm mt-2">To Form</a>
                  </div>
                </div>
                
                <div className="card shadow m-4" style={{width: "18rem"}}>
                  <div className="card-body ">
                    <h5 className="card-title py-2">Staff Management</h5>
                    {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                    <a href="/managestaff"  className="btn btn-primary btn-sm mt-2">To Form</a>
                  </div>
                </div>

                <div className="card shadow m-4" style={{width: "18rem"}}>
                  <div className="card-body ">
                    <h5 className="card-title py-2">Attendences</h5>
                    {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                    <a href="/attendencesysan"  className="btn btn-primary btn-sm mt-2">To Manage</a>
                  </div>
                </div>

              </div>

              <div className='row g-3 my-4'>

                <div className="card shadow m-4" style={{width: "18rem"}}>
                  <div className="card-body ">
                    <h5 className="card-title py-2">Medicals</h5>
                    {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                    <a href="/medicalsysan"  className="btn btn-primary btn-sm mt-2">To Manage</a>
                  </div>
                </div>
                
                <div className="card shadow m-4" style={{width: "18rem"}}>
                  <div className="card-body ">
                    <h5 className="card-title py-2">Course Module</h5>
                    {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                    <a href="/sysanicoursemodule"  className="btn btn-primary btn-sm mt-2">To Manage</a>
                  </div>
                </div>

                <div className="card shadow m-4" style={{width: "18rem"}}>
                  <div className="card-body ">
                    <h5 className="card-title py-2">Courses for Lecturers</h5>
                    {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                    <a href="/assignleccourse"  className="btn btn-primary btn-sm mt-2">To Manage Form </a>
                  </div>
                </div>
                
              </div>

              <div className='row g-3 my-4'>
                <div className="card shadow m-4" style={{width: "18rem"}}>
                  <div className="card-body ">
                    <h5 className="card-title py-2">Students Courses Registration</h5>
                    {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                    <a href="/screg"  className="btn btn-primary btn-sm mt-2">To Manage</a>
                  </div>
                </div>

                <div className="card shadow m-4" style={{width: "18rem"}}>
                  <div className="card-body ">
                    <h5 className="card-title py-2">Set Current Academic Year</h5>
                    {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                    <a  className="btn btn-primary btn-sm mt-2">To Manage</a>
                  </div>
                </div>

              </div>
            </div>
            </div>
        </div>
  )
}
