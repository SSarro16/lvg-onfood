import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const LoadingPage: React.FC<{ text: string }> = (props) => {
  return (
    <>
      <div className="text-center">
        {props.text}
        <div>
          <ProgressSpinner
            style={{ width: "50px", height: "50px" }}
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration=".5s"
          />
        </div>
      </div>
    </>
  );
};

export default LoadingPage;
