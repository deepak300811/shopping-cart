import MainContainer from "./Layout/MainContainer";
import AppContext from "./store/Context";

function ProductList() {
  return (
    <AppContext>
      <MainContainer/>
    </AppContext>

  );
}

export default ProductList;
