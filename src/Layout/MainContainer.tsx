import { collection, getDocs } from "firebase/firestore";
import { useContext } from "react";
import { useEffect } from "react";
import ProductCard from "../Components/ProductCard";
import { db } from "../firebase"; // Assuming this is where you configure Firestore
import { App } from "../store/Context";
import { setProductList, handleProductSelection, handleRemoveOneProduct, handleRemoveProductCompletely } from "../store/actionCreators";
import { useCallback } from "react";
import { Address as AddressType, NavList, Product } from "../types";
import Home from "../icons/Home";
import { useMemo } from "react";
import { useState } from "react";
import AddressPage from "../Pages/Address";
import Address from "../icons/Address";
import CartWithNumer from "../Components/Cart";
import CheckoutPage from "../Pages/Checkout";
const MainContainer = () => {
  const { state, dispatch } = useContext(App);
  const [selectedPage, setSelectedPage] = useState("HOMEPAGE");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
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
        console.error("Error fetching products: ", error);
      }
    };
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

  const getTotalItemsSelected = useMemo(() => {
    if (state?.productList?.length > 0) {
      let totalSelected = 0;
      state?.productList?.map((product: Product) => {
        totalSelected = totalSelected + product.quantity;
      });
      return totalSelected;
    }
    return 0;
  }, [state?.productList]);

  const getSelectedAdress = useMemo(() => {
    if (state?.addressList?.length > 0) {
      let selectedIndex = -1;
      selectedIndex = state?.addressList?.findIndex((address: AddressType) => address.isSelected);
      return selectedIndex;
    }
    return -1;
  }, [state?.addressList]);

  const getNavBar = () => {
    let navItems:NavList = [];
    if (selectedPage === "HOMEPAGE" && getTotalItemsSelected && getSelectedAdress > -1) {
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
          icon: <CartWithNumer itemsInCart={getTotalItemsSelected} />,
          isSelected: false,
          handleClick: () => setSelectedPage("CHECKOUT"),
        },
      ];
    } else if (selectedPage === "HOMEPAGE" && getTotalItemsSelected) {
      navItems = [
        {
          linkName: "Continue",
          icon: null,
          isSelected: false,
          isButton: true,
          handleClick: () => setSelectedPage("HOMEPAGE")
        },
      ];
    } else if (selectedPage === "HOMEPAGE" && getSelectedAdress > -1) {
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
    } else if (selectedPage === "ADDRESS" && getSelectedAdress > -1) {
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
          icon: <CartWithNumer itemsInCart={getTotalItemsSelected} />,
          isSelected: false,
          handleClick: () => setSelectedPage("CHECKOUT"),
        },
      ];
    } else if (selectedPage === "ADDRESS" && getSelectedAdress === -1) {
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
          icon: <CartWithNumer itemsInCart={getTotalItemsSelected} />,
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
                <button className="continue-button w-90-percent" onClick={() => setSelectedPage("ADDRESS")}>
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
  };

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
    } else if (page === "CHECKOUT" && getTotalItemsSelected > 0) {
      return (
        <div onClick={handleButtonClick}>
          <CheckoutPage onRemoveProduct={handleProductRemoval} noOfSelectedProducts={getTotalItemsSelected} handleHomepageRedirection={() => setSelectedPage("HOME")} />
        </div>
      );
    } else {
      setSelectedPage("HOMEPAGE");
    }
  };
  return (
    <main className="main-container">
      {renderComponent(selectedPage)}

      {getTotalItemsSelected !== 0 && getNavBar()}
    </main>
  );
};

export default MainContainer;
