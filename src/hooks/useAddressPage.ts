import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useCallback, useState, useContext, useEffect, useMemo } from "react";
import { generic_error } from "../constants";
import { db } from "../firebase";
import { addNewAddress, setAddressList, setError, setSelectedAddress, startLoader, stopLoader, unsetError } from "../store/actionCreators";
import { App } from "../store/Context";
import { Address, AddressForm } from "../types";

export const useAddressPage = () => {
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

  const handleErrorClick = useCallback(() => {
    dispatch(unsetError());
    fetchAddress();
  }, [dispatch]);

  const fetchAddress = useCallback(async () => {
    try {
      dispatch(startLoader());
      const addressCollection = collection(db, "address");
      const q = query(addressCollection, orderBy("createdAt", "desc"));
      const addressSnapshot = await getDocs(q);
      const addressList: Address[] = addressSnapshot.docs.map((doc) => ({
        id: doc.id,
        isSelected: false,
        addressLine1: doc.data().addressLine1 || "",
        addressLine2: doc.data().addressLine2 || "",
        city: doc.data().city || "",
        pin: doc.data().pin || "",
        receiverName: doc.data().receiverName || "",
        state: doc.data().state || "",
        country: doc.data().country || "",
      }));
      console.log("Fetched addressList=", addressList);
      dispatch(setAddressList(addressList));
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setError(generic_error, handleErrorClick));
      console.error("Error fetching addresses: ", error);
    }
  }, [dispatch, handleErrorClick]);

  useEffect(() => {
    if (state.addressList.length === 0) {
      fetchAddress();
    }
  }, [fetchAddress, state.addressList.length]);

  const formFields = useMemo(
    () => [
      { name: "receiverName", placeholder: "Enter Receiver's Name", type: "text", error: formErrors.receiverName },
      { name: "addressLine1", placeholder: "Address Line 1", type: "text", error: formErrors.addressLine1 },
      { name: "addressLine2", placeholder: "Address Line 2", type: "text", error: "" },
      { name: "city", placeholder: "City", type: "text", error: formErrors.city },
      { name: "state", placeholder: "State", type: "text", error: formErrors.state },
      { name: "pin", placeholder: "Pincode", type: "number", error: formErrors.pin },
      { name: "country", placeholder: "Country", type: "text", error: formErrors.country },
    ],
    [formErrors]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = useCallback(() => {
    const errors: any = {};
    if (!formData.receiverName.trim()) errors.receiverName = "Receiver's Name is required";
    if (!formData.addressLine1.trim()) errors.addressLine1 = "Address Line 1 is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.pin.trim()) errors.pin = "Pincode is required";
    if (!formData.country.trim()) errors.country = "Country is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      dispatch(startLoader());
      const tempFormData: Address = { ...formData };
      const res = await addDoc(collection(db, "address"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      const addedAddressId = res.id;
      tempFormData.id = addedAddressId;
      tempFormData.isSelected = true;

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
      dispatch(addNewAddress(tempFormData));
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setError(generic_error, () => {
        dispatch(unsetError());
      }));
    }
  };

  const handleAddressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const id = target.closest(".full-address")?.getAttribute("data-id");
    if (id) dispatch(setSelectedAddress(id));
  };

  return {
    enableNewAddition,
    setEnableNewAddition,
    formFields,
    formData,
    handleInputChange,
    handleFormSubmit,
    handleAddressClick,
    state,
  };
};
