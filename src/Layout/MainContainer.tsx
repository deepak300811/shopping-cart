import { collection, getDocs } from "firebase/firestore";
import { useContext } from "react";
import { useEffect } from "react";
import ProductCard from "../Components/ProductCard";
import { db } from "../firebase"; // Assuming this is where you configure Firestore
import { App } from "../store/Context";
import {
  setProductList,
  handleProductSelection,
  handleRemoveOneProduct,
  handleRemoveProductCompletely,
  startLoader,
  stopLoader,
  setError,
  unsetError,
} from "../store/actionCreators";
import { useCallback } from "react";
import { NavList, Product } from "../types";
import Home from "../icons/Home";
import { useState } from "react";
import AddressPage from "../Pages/Address";
import Address from "../icons/Address";
import CartWithNumer from "../Components/Cart";
import CheckoutPage from "../Pages/Checkout";
import Loader from "../Components/Loader";
import ErrorModal from "../Components/ErrorModal";
import { generic_error } from "../constants";
const MainContainer = () => {
  const { state, dispatch } = useContext(App);
  const [selectedPage, setSelectedPage] = useState("HOMEPAGE");

  const fetchProducts = useCallback(async () => {
    try {
      dispatch(startLoader());
      const productCollection = collection(db, "products");
      const productSnapshot = await getDocs(productCollection); // Fetch data one time
      let index = 0;
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        quantity: 0,
        indexNumber: index++,
        name: doc.data().name,
        originalPrice: doc.data().originalPrice,
        photoLink: doc.data().photoLink,
        description: doc.data().description,
        stock: doc.data().stock,
        discountedPrice: doc.data().discountedPrice,
      }));
      console.log("Fetched productList=", productList);
      dispatch(setProductList(productList));
    } catch (error) {
      dispatch(stopLoader());
      dispatch(
        setError(generic_error, () => {
          dispatch(unsetError());
          fetchProducts();
        })
      );
      console.error("Error fetching products: ", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts(); // Call the fetch function
  }, []); // Empty dependency array for one-time fetch

  const handleButtonClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement; // Explicitly cast target to HTMLElement
    const itemClickedId = target.getAttribute("data-index");
    console.log("itemClickedId=", itemClickedId);
    if (itemClickedId) {
      dispatch(handleProductSelection(itemClickedId));
    }
  }, []);
  console.log("state=", state);
  const handleProductRemoval = (index: number, removalType: string) => {
    if (removalType === "ONE") {
      dispatch(handleRemoveOneProduct(index));
    } else {
      dispatch(handleRemoveProductCompletely(index));
    }
  };

  const getNavBar = useCallback(() => {
    let navItems: NavList = [];
    if (selectedPage === "HOMEPAGE" && state?.totalNoOfSelectedProdcuts && state?.selectedAddressIndex > -1) {
      navItems = [
        {
          linkName: "Home",
          icon: <Home />,
          isSelected: false,
          handleClick: () => setSelectedPage("HOMEPAGE"),
        },
        {
          linkName: "Address",
          icon: <Address />,
          isSelected: false,
          handleClick: () => setSelectedPage("ADDRESS"),
        },
        {
          linkName: "Checkout",
          icon: <CartWithNumer itemsInCart={state?.totalNoOfSelectedProdcuts} />,
          isSelected: false,
          handleClick: () => setSelectedPage("CHECKOUT"),
        },
      ];
    } else if (selectedPage === "HOMEPAGE" && state?.totalNoOfSelectedProdcuts) {
      navItems = [
        {
          linkName: "Continue",
          icon: null,
          isSelected: false,
          isButton: true,
          handleClick: () => setSelectedPage("HOMEPAGE"),
        },
      ];
    } else if (selectedPage === "HOMEPAGE" && state?.selectedAddressIndex > -1) {
      navItems = [
        {
          linkName: "Home",
          icon: <Home />,
          isSelected: false,
          handleClick: () => setSelectedPage("HOMEPAGE"),
        },
        {
          linkName: "Address",
          icon: <Address />,
          isSelected: false,
          handleClick: () => setSelectedPage("ADDRESS"),
        },
      ];
    } else if (selectedPage === "ADDRESS" && state?.selectedAddressIndex > -1) {
      navItems = [
        {
          linkName: "Home",
          icon: <Home />,
          isSelected: false,
          handleClick: () => setSelectedPage("HOMEPAGE"),
        },
        {
          linkName: "Address",
          icon: <Address />,
          isSelected: false,
          handleClick: () => setSelectedPage("ADDRESS"),
        },
        {
          linkName: "Checkout",
          icon: <CartWithNumer itemsInCart={state?.totalNoOfSelectedProdcuts} />,
          isSelected: false,
          handleClick: () => setSelectedPage("CHECKOUT"),
        },
      ];
    } else if (selectedPage === "ADDRESS" && state?.selectedAddressIndex === -1) {
      navItems = [
        {
          linkName: "Home",
          icon: <Home />,
          isSelected: false,
          handleClick: () => setSelectedPage("HOMEPAGE"),
        },
        {
          linkName: "Address",
          icon: <Address />,
          isSelected: false,
          handleClick: () => setSelectedPage("ADDRESS"),
        },
      ];
    } else if (selectedPage === "CHECKOUT") {
      navItems = [
        {
          linkName: "Home",
          icon: <Home />,
          isSelected: false,
          handleClick: () => setSelectedPage("HOMEPAGE"),
        },
        {
          linkName: "Address",
          icon: <Address />,
          isSelected: false,
          handleClick: () => setSelectedPage("ADDRESS"),
        },
        {
          linkName: "Checkout",
          icon: <CartWithNumer itemsInCart={state?.totalNoOfSelectedProdcuts} />,
          isSelected: false,
          handleClick: () => setSelectedPage("CHECKOUT"),
        },
      ];
    }
    return (
      <nav className="navbar w-full">
        <section className=" flex w-full justify-center">
          {navItems?.map((item) => {
            if (item.isButton) {
              return (
                <button className="continue-button" onClick={() => setSelectedPage("ADDRESS")}>
                  Continue
                </button>
              );
            } else {
              return (
                <div className="navbar-item" onClick={item.handleClick}>
                  {item.icon}
                  <p>{item.linkName}</p>
                </div>
              );
            }
          })}
        </section>
      </nav>
    );
  }, [selectedPage, state?.totalNoOfSelectedProdcuts, state?.selectedAddressIndex]);

  const renderComponent = (page: string) => {
    if (page === "HOMEPAGE") {
      return (
        <div className="product-container roboto" onClick={handleButtonClick}>
          {state?.productList?.map((product: Product) => (
            <ProductCard
              id={product.id}
              name={product.name}
              originalPrice={product.originalPrice}
              discountedPrice={product?.discountedPrice}
              stock={product?.stock}
              photoLink={product?.photoLink}
              description={product?.description}
              quantity={product?.quantity || 0}
              key={product.id}
              onRemoveProduct={handleProductRemoval}
              indexNumber={product.indexNumber}
            />
          ))}
        </div>
      );
    } else if (page === "ADDRESS") {
      return <AddressPage />;
    } else if (page === "CHECKOUT" && state?.totalNoOfSelectedProdcuts > 0) {
      return (
        <div onClick={handleButtonClick}>
          <CheckoutPage onRemoveProduct={handleProductRemoval} handleHomepageRedirection={() => setSelectedPage("HOME")} />
        </div>
      );
    } else {
      setSelectedPage("HOMEPAGE");
    }
  };
  return (
    <main className="main-container">
      {state.isLoading && <Loader />}
      {state.errorMessageIfApplicable.error.length > 0 && <ErrorModal />}
      {renderComponent(selectedPage)}

      {state?.totalNoOfSelectedProdcuts !== 0 && getNavBar()}
    </main>
  );
};

export default MainContainer;
