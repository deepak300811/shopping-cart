import { useEffect } from "react";
import waitingGif from "../../assets/waiting.gif"; // Correctly import the gif
import BackdropPortal from "../BackdropPortal";

type Proptypes = {
  handleRedirection: () => void;
};

const Redirect = (props: Proptypes) => {
  const { handleRedirection } = props;

  useEffect(() => {
    setTimeout(() => {
      handleRedirection();
    }, 5000);
  }, []);

  return (
    <BackdropPortal>
      <div className="w-80-percent flex-column flex items-center rounded bg-white p-4">
        <div className="">
          <img src={waitingGif} alt="Loading..." className="w-full" /> {/* Use img instead of video */}
        </div>
        <p>Payment Successful </p>
        <p>You are being redirected...</p>
      </div>
    </BackdropPortal>
  );
};

export default Redirect;
