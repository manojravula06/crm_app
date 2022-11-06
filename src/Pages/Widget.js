import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";


const Widget = ({title,color,icon,ticketCount,pathColor}) => {
  return (
    <div className="col-xs-12 col-lg-3 col-md-6 my-1">
      <div className={`card bg-${color} text-center bg-opacity-25`}
        style={{ width: 15 + "rem" }}>
        
        <h4 className={`card-subtitle text-${color}  my-2 fw-bold`}>
        <i className={`bi bi-${icon} mx-2`}></i>{title}</h4>
        <hr />
        <div className="row mb-2 d-flex align-items-center">
          <div className={`col text-${color} fw-bold mx-4 display-5`}>
           {ticketCount}
          </div>
          <div className="col">
                {/* Size of circular bar */}
                <div style={{ width: 40, height: 40 }}>
                  {/* How to use ? 
                    Import from top
                    value={the count of tickets}
                    buildStyles({}) : a function that accepts obj. Obj takes css styles in key value format. Colors can be accepted in hex, rgpa, and text names
                  */}
                  <CircularProgressbar
                    value={ticketCount}
                    styles={buildStyles({
                      pathColor:`${pathColor}`
                    })}
                  />
                </div>
              </div>
        </div>
      </div>
    </div>
  );
};

export default Widget;
