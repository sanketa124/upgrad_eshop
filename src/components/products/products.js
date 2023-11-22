import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import SearchAppBar from "../../common/navbar/navbar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ProductCard from "../../common/productcard/ProductCard";
import { useEffect } from "react";
import { LS_ESHOP_ACCESS_TOKEN } from "../../common/constants";
import { useNavigate } from "react-router-dom";
import { ROUTE_LOGIN } from "../../common/routes";
import { useState } from "react";

const defaultTheme = createTheme();

export default function Products() {
  const navigate = useNavigate();
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    if (!localStorage.getItem(LS_ESHOP_ACCESS_TOKEN)) {
      navigate(ROUTE_LOGIN);
    } else {
      fetchProductCategories();
      fetchProducts();
    }
  }, [localStorage.getItem(LS_ESHOP_ACCESS_TOKEN)]);

  const fetchProductCategories = async () => {
    const response = await fetch("http://0.0.0.0:8080/product-categories");
    const result = await response.json();
    if (result?.data) {
      setProductCategories(["all", ...result.data]);
    }
  };

  const fetchProducts = async () => {
    const response = await fetch("http://0.0.0.0:8080/products");
    const result = await response.json();
    if (result?.data) {
      setProducts(result.data);
    }
  };

  // let prodTransactionType = 'modified ';

  // let activeOrder = {};
  // let activeAddress = {};

  // function ConditionalRenderDialog(){
  //   if(firstTime > 1){
  //     return;
  //   }else{
  //     firstTime++;
  //   }
  //   console.log('doc referrer', document.referrer);
  //   if(document.referrer == window.location.origin + '/'){
  //     return (<PositionedSnackbar message={'User Logged In'} typeOfSnackBar={'success'}/>)
  //   }else if(document.referrer == window.location.origin + '/order/confirm'){
  //     return (<PositionedSnackbar message={'Order Placed Successfully'} typeOfSnackBar={'success'}/>)
  //   }else if(document.referrer == window.location.origin + '/product/upsert'){
  //     if(prodTransactionType == 'modified'){
  //       return (<PositionedSnackbar message={'Product Modified Succesfully'} typeOfSnackBar={'success'}/>)
  //     }else{
  //       return (<PositionedSnackbar message={'Product Added Succesfully'} typeOfSnackBar={'success'}/>)
  //     }
  //   }else{
  //     return (<PositionedSnackbar message={'Product Deleted Succesfully'} typeOfSnackBar={'success'}/>)
  //   }
  // }

  return (
    <ThemeProvider theme={defaultTheme}>
      <SearchAppBar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            minWidth: "max-content",
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <ConditionalRenderDialog /> */}

          <ToggleButtonGroup
            value={category}
            exclusive
            onChange={(e) => setCategory(e.target.value)}
            aria-label="category"
          >
            {productCategories.map((ctg, index) => {
              return (
                <ToggleButton
                  value={ctg}
                  key={index}
                  selected={ctg === category}
                >
                  {ctg}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </Box>
      </Container>
      <Box sx={{ margin: 5, maxWidth: "16rem" }}>
        <FormControl fullWidth>
          <InputLabel id="sort-label">Sort By:</InputLabel>
          <Select
            labelId="sort-label"
            id="sort-product"
            value={sort}
            label="Select..."
            onChange={(e) => setSort(e.target.value)}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="price-high-to-low">Price High to Low</MenuItem>
            <MenuItem value="price-low-to-high">Price Low to High</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box
        style={{
          display: "flex",
          width: "100%",
          flexWrap: "wrap",
          gap: 40,
          justifyContent: "center",
          padding: "2rem 8rem",
        }}
      >
        <CustomProductCard
          category={category}
          sort={sort}
          products={products}
        />
      </Box>
    </ThemeProvider>
  );
}

function CustomProductCard({ category, sort, products }) {
  let allProducts = products.map((prod) => {
    return <ProductCard product={prod} key={prod.id} />;
  });

  if (sort === "default" && category === "all") {
    return <div style={{ display: "contents" }}> {allProducts} </div>;
  }

  let filteredActiveProducts = [];
  if (category !== "all") {
    filteredActiveProducts = products.filter((prods) => {
      return prods.category === category;
    });
  }

  if (sort !== "default") {
    let filteredSoFar =
      filteredActiveProducts.length > 0 ? filteredActiveProducts : products;
    if (sort === "price-high-to-low") {
      filteredActiveProducts = filteredSoFar.sort((a, b) =>
        a.price > b.price ? -1 : b.price > a.price ? 1 : 0
      );
    } else if (sort === "price-low-to-high") {
      filteredActiveProducts = filteredSoFar.sort((a, b) =>
        a.price > b.price ? 1 : b.price > a.price ? -1 : 0
      );
    } else {
      filteredActiveProducts = filteredSoFar.sort((a, b) =>
        a.id > b.id ? 1 : b.id > a.id ? -1 : 0
      );
    }
  }

  let allActiveFilteredProducts = filteredActiveProducts.map((prod) => {
    return <ProductCard product={prod} key={prod.id} />;
  });

  return (
    <div style={{ display: "contents" }}> {allActiveFilteredProducts} </div>
  );
}
