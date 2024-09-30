import { useEffect } from "react";
import { ReactNode } from "react";
import ReactDOM from "react-dom";
const BackdropPortal = ({ children }: { children: ReactNode }) => {
  const portalRoot = document.getElementById("portal-root");

  // Ensure that the portalRoot is not null before creating the portal
  if (portalRoot === null) {
    console.error("Portal root element (#portal-root) is not found in the DOM.");
    return null; // Early return if the portal root doesn't exist
  }


  // Use useEffect to add/remove the no-scroll class
  useEffect(() => {
    // Add the class to disable scrolling
    document.body.classList.add('no-scroll');

    // Clean up function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []); // Empty dependency array ensures this runs once on mount and unmount

 

  return ReactDOM.createPortal(<div className="backdrop fixed top-0 right-0 z-10 flex w-screen items-center justify-center overflow-hidden">{children}</div>, portalRoot);
};

export default BackdropPortal;
