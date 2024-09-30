import { useEffect } from "react";
import waitingGif from "../../assets/waiting.gif"; // Correctly import the gif

type Proptypes={
    handleRedirection:()=>void;
}

const Redirect = (props:Proptypes) => {
    const {handleRedirection} = props;

    useEffect(() => {
      setTimeout(()=>{
        handleRedirection()
      },5000)
    }, [])
    

  return (
    <div className="backdrop absolute top-0 right-0 z-10 flex h-screen w-screen items-center justify-center overflow-hidden">
      <div className="w-80-percent rounded bg-white flex flex-column items-center p-4">
        <div className="">
          <img src={waitingGif} alt="Loading..." className="w-full" /> {/* Use img instead of video */}
        </div>
        <p>Payment Successful </p>
        <p>You are being redirected...</p>
      </div>
    </div>
  );
};

export default Redirect;
