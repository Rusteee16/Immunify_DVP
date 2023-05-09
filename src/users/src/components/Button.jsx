import React from "react";

function Button(props) {
  return (
    <div className="passport-button">
      <span onClick={props.handleClick} className="form-Chip-label">
        {props.text}
      </span>
    </div>
  );
}

export default Button;




