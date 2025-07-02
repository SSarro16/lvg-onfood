import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../store/redux";
import type { Product } from "../store/redux/products-slice";
import ProductsList from "../components/Products/ProductsList";
import { Fieldset } from "primereact/fieldset";
import { useLang } from "../store/context/lang-context";

export default function HomePage() {
  const products = useSelector((state: RootState) => state.products.products);
  const [wipProducts, setWipProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [unavailableProducts, setUnavailableProducts] = useState<Product[]>([]);
  const {t: translate, lang} = useLang()

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
          title={translate('title_header')}
          message={translate('desc_header')}
        />
      </div>
      <div>
        <section className="p-2 m-2">
          <Fieldset legend={translate('product_disponible')} toggleable>
            <ProductsList products={availableProducts} />
          </Fieldset>
        </section>
        <section className="p-2 m-2">
          <Fieldset legend={translate('product_wip')} toggleable>
            <ProductsList products={wipProducts} />
          </Fieldset>
        </section>
        <section className="p-2 m-2">
          <Fieldset legend={translate('product_undisponible')} toggleable>
            <ProductsList products={unavailableProducts} />
          </Fieldset>
        </section>
      </div>
    </>
  );
}
