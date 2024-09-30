import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useCallback } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import AddressCard from "../../Components/AddressCard";
import { generic_error } from "../../constants";
import { db } from "../../firebase";
import { addNewAddress, setAddressList, setError, setSelectedAddress, startLoader, stopLoader, unsetError } from "../../store/actionCreators";
import { App } from "../../store/Context";
import { Address, AddressForm } from "../../types";

const AddressPage = () => {
  const { state, dispatch } = useContext(App);
  const [enableNewAddition, setEnableNewAddition] = useState(false);

  const [formData, setFormData] = useState<AddressForm>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    pin: "",
    receiverName: "",
    state: "",
    country: "",
  });

  const [formErrors, setFormErrors] = useState({
    addressLine1: "",
    city: "",
    pin: "",
    receiverName: "",
    state: "",
    country: "",
  });


  const handleErrorClick= useCallback(()=>{dispatch(unsetError()); fetchAddress()},[])

 // Fetch addresses on component mount
 const fetchAddress = useCallback( async () => {
  try {
    dispatch(startLoader())
    // Query addresses ordered by `createdAt` in descending order
    const addressCollection = collection(db, "address");
    const q = query(addressCollection, orderBy("createdAt", "desc"));
    const addressSnapshot = await getDocs(q); // Fetch ordered data
    const addressList: Address[] = addressSnapshot.docs.map((doc) => ({
      id: doc.id,
      isSelected: false,
      addressLine1: doc.data().addressLine1 || "",  
      addressLine2: doc.data().addressLine2 || "",  
      city: doc.data().city || "",
      pin: doc.data().pin || "",
      receiverName: doc.data().receiverName || "",
      state: doc.data().state || "",
      country: doc.data().country || ""
    }));
    console.log("Fetched addressList=", addressList);
    dispatch(setAddressList(addressList));
  } catch (error) {
    dispatch(stopLoader())
    dispatch(setError(generic_error,handleErrorClick))
    console.error("Error fetching addresses: ", error);
  }
},[]);

 useEffect(() => {
  if(state.addressList.length===0){
    fetchAddress(); // Call the fetch function
  }
}, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset field-specific errors on input change
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Basic form validation
  const validateForm = () => {
    let errors: any = {};
    if (!formData.receiverName) errors.receiverName = "Receiver's Name is required";
    if (!formData.addressLine1) errors.addressLine1 = "Address Line 1 is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.state) errors.state = "State is required";
    if (!formData.pin) errors.pin = "Pincode is required";
    if (!formData.country) errors.country = "Country is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("Form has errors", formErrors);
      return;
    }
    try {
      dispatch(startLoader())
      // Add new address to the Firestore collection
      const tempFormData:Address={...formData}
      const res=await addDoc(collection(db, "address"), {
        ...formData,
        createdAt: serverTimestamp(), // Add the timestamp
      });
      const addedAddressId=res.id;
      tempFormData.id=addedAddressId;
      tempFormData.isSelected=true;
      console.log("Address added successfully=",res);

      // Optionally, reset the form and close the new address form
      setFormData({
        addressLine1: "",
        addressLine2: "",
        city: "",
        pin: "",
        receiverName: "",
        state: "",
        country: "",
      });
      setEnableNewAddition(false);
      dispatch(addNewAddress(tempFormData))

    } catch (error) {
      dispatch(stopLoader())
      dispatch(setError(generic_error,()=>{dispatch(unsetError())}))
      console.error("Error adding address: ", error);
    }
    console.log("Submitted formData:", formData);
    // Here you can dispatch an action to save the new address
  };

  const handleAddressClick = (e:React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const id = target.closest('.full-address')?.getAttribute('data-id');
    if (id) {
      console.log("clicked id=", id);
      dispatch(setSelectedAddress(id));
    }
  };
  return (
    <div className="address-container">
      <p className="page-heading">Select a delivery address</p>
      <div className="border-box pr-4 pl-4 pt-4 pb-4" onClick={handleAddressClick}>
        {state?.addressList?.map((address: Address) => {
          return <AddressCard key={address.id} {...address} />;
        })}
        <p className="flex items-center flex-row">
          <span className={`plus-sign ${enableNewAddition ? "cross" : ""}`}>
            +
          </span>
          <span
            className="new-address-link"
            onClick={() => setEnableNewAddition((prev) => !prev)}
          >
            {enableNewAddition ? "Cancel new address addition" : "Add a new address"}
          </span>
        </p>
        {enableNewAddition && (
          <form className="address-form" onSubmit={handleFormSubmit}>
            <div>
              <input
                name="receiverName"
                placeholder="Enter Receiver's Name"
                type="text"
                value={formData.receiverName}
                onChange={handleInputChange}
              />
              {formErrors.receiverName && (
                <p className="error-message">{formErrors.receiverName}</p>
              )}
            </div>

            <div>
              <input
                name="addressLine1"
                placeholder="Address Line 1"
                type="text"
                value={formData.addressLine1}
                onChange={handleInputChange}
              />
              {formErrors.addressLine1 && (
                <p className="error-message">{formErrors.addressLine1}</p>
              )}
            </div>
            <div>
            <input
              name="addressLine2"
              placeholder="Address Line 2"
              type="text"
              value={formData.addressLine2}
              onChange={handleInputChange}
            />
            </div>

            <div>
              <input
                name="city"
                placeholder="City"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
              />
              {formErrors.city && (
                <p className="error-message">{formErrors.city}</p>
              )}
            </div>

            <div>
              <input
                name="state"
                placeholder="State"
                type="text"
                value={formData.state}
                onChange={handleInputChange}
              />
              {formErrors.state && (
                <p className="error-message">{formErrors.state}</p>
              )}
            </div>

            <div>
              <input
                name="pin"
                placeholder="Pincode"
                type="number"
                value={formData.pin}
                onChange={handleInputChange}
              />
              {formErrors.pin && (
                <p className="error-message">{formErrors.pin}</p>
              )}
            </div>

            <div>
              <input
                name="country"
                placeholder="Country"
                type="text"
                value={formData.country}
                onChange={handleInputChange}
              />
              {formErrors.country && (
                <p className="error-message">{formErrors.country}</p>
              )}
            </div>

            <div className="submit-btn-container">

            <input type="submit" value="Use This Address" className="submit-btn primary-btn"  />
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default AddressPage;
