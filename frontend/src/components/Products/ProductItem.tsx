import React, { useState } from "react";
import { DataView } from "primereact/dataview";
import { Product } from "../../store/redux/products-slice";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";

type ProductItemProps = { product: Product };

const ProductItem: React.FC<ProductItemProps> = (props) => {
  const [visible, setVisible] = useState(false);
  const header = (
    <div>
      <img alt="ProductDetail" src={props.product.image} />
    </div>
  );
  const footer = (
    <>
      <Button
        label="Delete"
        severity="secondary"
        icon="pi pi-times"
        style={{ marginLeft: "0.5em" }}
      />
    </>
  );

  const gridItem = () => {
    return (
      <div
        className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2 w-2 gap-2"
        key={props.product.id}
      >
        <div className="p-4 border-1 surface-border bg-green-500 border-round ">
          <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="flex align-items-center gap-2"></div>
          </div>
          <div className="text-xl text-100 text-center font-bold">
            {props.product.title}
          </div>
          <div className="flex flex-column align-items-center gap-3 py-5">
            <img
              className="w-9 shadow-2 border-round"
              src={props.product.image}
              alt={props.product.title}
            />
          </div>
          <div className="flex align-items-center justify-content-between">
            <span className="text-xl text-100 font-semibold">
              €{props.product.price}
            </span>
            <span className="text-xl text-100 font-semibold">
              <Button icon="pi pi-bars" onClick={() => setVisible(true)} />
              <Dialog
                modal
                maximized
                visible={visible}
                onHide={() => setVisible(false)}
                style={{ width: "auto" }}
              >
                <Card
                  title={props.product.title}
                  header={header}
                  footer={footer}
                  subTitle="Product Detail"
                  className="md:w-25rem"
                >
                  <p className="m-0">{props.product.description}</p>
                </Card>
              </Dialog>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return <DataView value={[props.product]} itemTemplate={gridItem} />;
};

export default ProductItem;

export { ProductItem };
