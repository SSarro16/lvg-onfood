import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../store/redux";
import type { Product } from "../store/redux/products-slice";
import ProductsList from "../components/Products/ProductsList";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Fieldset } from "primereact/fieldset";

export default function HomePage() {
  const products = useSelector((state: RootState) => state.products.products);
  const [visibleRight, setVisibleRight] = useState(false);
  const [wipProducts, setWipProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [unavailableProducts, setUnavailableProducts] = useState<Product[]>([]);

  const wipHeader = (
    <div className="pl-6 ">
      <h2>WIP Products</h2>
    </div>
  );

  useEffect(() => {
    if (typeof products === "object") {
      console.log(products);
      products.map((product) => {
        if (product.quantity > 0) {
          setAvailableProducts((prevState) => {
            const state = prevState;
            const alrCheckedId = prevState.some((element) => {
              if (element.id === product.id) {
                return true;
              }
              return false;
            });
            if (alrCheckedId === true) {
              return prevState;
            } else {
              state.push(product);
              return state;
            }
          });
        } else {
          if (product.estimatedCompletedTime > 0) {
            setWipProducts((prevState) => {
              const state = prevState;
              const alrCheckedId = prevState.some((element) => {
                if (element.id === product.id) {
                  return true;
                }
                return false;
              });
              if (alrCheckedId === true) {
                return prevState;
              } else {
                state.push(product);
                return state;
              }
            });
          } else {
            setUnavailableProducts((prevState) => {
              const state = prevState;
              const alrCheckedId = prevState.some((element) => {
                if (element.id === product.id) {
                  return true;
                }
                return false;
              });
              if (alrCheckedId === true) {
                return prevState;
              } else {
                state.push(product);
                return state;
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
      <div>
        <div className="right-0 absolute top-50 ">
          <Button
            icon="pi pi-arrow-left"
            onClick={() => setVisibleRight(true)}
            className="gap-2"
            severity="warning"
          >
            WIP
          </Button>
        </div>
        <section className="p-2 m-2">
          <Fieldset legend="Lista dei Prodotti" toggleable>
            <ProductsList products={availableProducts} />
          </Fieldset>
        </section>
        <section className="p-2 m-2">
          <Fieldset legend="Prodotti Non Disponibili" toggleable>
            <ProductsList products={unavailableProducts} />
          </Fieldset>
        </section>
        <Sidebar
          visible={visibleRight}
          header={wipHeader}
          className="w-7"
          position="right"
          onHide={() => setVisibleRight(false)}
        >
          <ProductsList products={wipProducts} />
        </Sidebar>
      </div>
    </>
  );
}
