import { useContext } from "react"
import { App } from "../../store/Context"
import BackdropPortal from "../BackdropPortal"


const ErrorModal = () => {
    const {state} = useContext(App)

  return (
      <BackdropPortal>
     <div className="w-80-percent flex-column flex items-center rounded bg-white p-4 error-height justify-center">
        <p className="mb-4 align-center ">{state?.errorMessageIfApplicable.error}</p>
        <button className="primary-btn w-70-percent p-1 bg-red text-white" onClick={state?.errorMessageIfApplicable.onClickFunction}>OK</button>
      </div>
      </BackdropPortal>

  )
}

export default ErrorModal