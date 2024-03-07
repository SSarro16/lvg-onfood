import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import type { Product } from "../store/products-slice";
import ProductsList from "../components/Products/ProductsList";

export default function HomePage() {
  const products = useSelector((state: RootState) => state.products.products);

  const [wipProducts, setWipProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [unavailableProducts, setUnavailableProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof products === "object") {
      console.log(products);
      products.map((product) => {
        if (product.quantity > 0) {
          setAvailableProducts((prevState) => {
            const alrCheckedId = prevState.some((element) => {
              if (element.id === product.id) {
                return true;
              }
              return false;
            });
            if (alrCheckedId === true) {
              return prevState;
            } else {
              prevState.push(product);
              return prevState;
            }
          });
        } else {
          if (product.estimatedCompletedTime > 0) {
            setWipProducts((prevState) => {
              const alrCheckedId = prevState.some((element) => {
                if (element.id === product.id) {
                  return true;
                }
                return false;
              });
              if (alrCheckedId === true) {
                return prevState;
              } else {
                prevState.push(product);
                return prevState;
              }
            });
          } else {
            setUnavailableProducts((prevState) => {
              const alrCheckedId = prevState.some((element) => {
                if (element.id === product.id) {
                  return true;
                }
                return false;
              });
              if (alrCheckedId === true) {
                return prevState;
              } else {
                prevState.push(product);
                return prevState;
              }
            });
          }
        }
      });
    }
  }, [products]);

  return (
    <>
      <div>
        <Header
          title={"Benvenuti al LVG Online Food"}
          message={
            "Qui potrai prenotare e visionare tutti i prodotti offerti dal nostro servizio di gastronomia e sarai aggiornato anche sui prodotti che sono in lavorazione"
          }
        />
      </div>
      <div style={{ display: "flex" }}>
        <section>
          <h2>Product list in lavorazione...</h2>
          <ProductsList products={availableProducts} />
          <h2>Prodotti non disponibili</h2>
          <ProductsList products={unavailableProducts} />
        </section>
        <aside>
          <h3>Prodotti WIP in lavorazione...</h3>
          <ProductsList products={wipProducts} />
        </aside>
      </div>
    </>
  );
}
