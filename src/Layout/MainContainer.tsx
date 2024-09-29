import { collection, getDocs } from "firebase/firestore";
import { useContext } from "react";
import { useEffect } from "react";
import ProductCard from "../Components/ProductCard";
import { db } from "../firebase"; // Assuming this is where you configure Firestore
import { App } from "../store/Context";
import { setProductList, handleProductSelection, handleRemoveOneProduct, handleRemoveProductCompletely } from "../store/actionCreators";
import { useCallback } from "react";
import { Address as AddressType, Product, ProductList } from "../types";
import Home from "../icons/Home";
import Cart from "../icons/Cart";
import { useMemo } from "react";
import { useState } from "react";
import AddressPage from "../Pages/Address";
import Address from "../icons/Address";
const MainContainer = () => {
  const { state, dispatch } = useContext(App);
  const [selectedPage,setSelectedPage] = useState('HOMEPAGE')
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productCollection = collection(db, "products");
        const productSnapshot = await getDocs(productCollection); // Fetch data one time
        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          quantity: 0,
          ...doc.data(),
        }));
        console.log("Fetched productList=", productList);
        // setProducts(productList); // Update state with fetched data
        dispatch(setProductList(productList));
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };
    fetchProducts(); // Call the fetch function
  }, []); // Empty dependency array for one-time fetch

  const handleButtonClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement; // Explicitly cast target to HTMLElement
    const itemClickedId = target.getAttribute("data-id");
    console.log("itemClickedId=", itemClickedId);
    if (itemClickedId) {
      dispatch(handleProductSelection(itemClickedId));
    }
  }, []);
  console.log("state=", state);
  const handleProductRemoval = (id: string, removalType: string) => {
    if (removalType === "ONE") {
      dispatch(handleRemoveOneProduct(id));
    } else {
      dispatch(handleRemoveProductCompletely(id));
    }
  };

  const getTotalItemsSelected=useMemo(()=>{

    if(state?.productList?.length>0){
      let totalSelected=0;
      state?.productList?.map((product:Product)=>{
        totalSelected=totalSelected+ product.quantity
      })
      return totalSelected
    }
    return 0

  },[state?.productList])

  const getSelectedAdress=useMemo(()=>{

    if(state?.addressList?.length>0){
      let selectedIndex=-1;
      selectedIndex=state?.addressList?.findIndex((address:AddressType)=>address.isSelected)
      return selectedIndex
    }
    return -1

  },[state?.productList])

  const getNavBar = () => {
    let navItems = [];
    if (selectedPage === "HOMEPAGE" && getTotalItemsSelected) {
      navItems = [
        {
          linkName: "Continue",
          icon: null,
          isSelected: false,
          isButton: true,
        },
      ];
    }
    else if(selectedPage === "HOMEPAGE" && getSelectedAdress>-1){
      navItems = [
        {
          linkName: "Home",
          icon: <Home/>,
          isSelected: false,
        },
        {
          linkName:"Address",
          icon:<Address/>,
          isSelected:false
        }
      ];
    }
    else if(selectedPage === "ADDRESS"){
      navItems = [
        {
          linkName: "Home",
          icon: <Home/>,
          isSelected: false,
          handleClick:()=>setSelectedPage('HOMEPAGE')
        }
      ];
    }
    return (
      <nav className="navbar">
        <section className="w-full">
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
  };

  const renderComponent=(page:string)=>{
    if(page==='HOMEPAGE'){
      return    <div className="product-container roboto" onClick={handleButtonClick}>
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
        />
      ))}
    </div>
    }
    else if(page==='ADDRESS'){
      return <AddressPage/>
    }
  }
  return (
    <main className="main-container">
      {
        renderComponent(selectedPage)
      }
   

{
  getTotalItemsSelected!==0 && getNavBar()
}
    </main>
  );
};

export default MainContainer;
