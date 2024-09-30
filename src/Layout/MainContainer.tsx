import ProductCard from "../Components/ProductCard";
import { useCallback } from "react";
import { NavList, Product } from "../types";
import Home from "../icons/Home";
import AddressPage from "../Pages/Address";
import Address from "../icons/Address";
import CartWithNumer from "../Components/Cart";
import CheckoutPage from "../Pages/Checkout";
import Loader from "../Components/Loader";
import ErrorModal from "../Components/ErrorModal";
import { useMainContainerHook } from "../hooks/useMainContainer";
const MainContainer = () => {
  const { state, selectedPage, setSelectedPage, handleButtonClick, handleProductRemoval } = useMainContainerHook();

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
