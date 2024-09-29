import { Address } from "../../types"

const AddressCard = (props:Address) => {
    const {addressLine1,addressLine2="",city,pin,state,receiverName, country, isSelected,id} = props
  return (
    <div className={`full-address p-2 flex items-center ${isSelected ? 'address-selected':""}`} data-id={id}>
      <section className="mr-4">
      <div className="radio-unselected">
      
          <div className={`radio-selected ${isSelected ? 'show':""}`}>

         </div>
       
      </div>
      </section>
      <section>
      <p> <span className="receiver-name">{receiverName}</span> <span>{addressLine1}</span><span>, {addressLine2}</span></p>
       <p><span>{city}, {state}, {pin}, {country}</span></p>
      </section>

    </div>
  )
}

export default AddressCard