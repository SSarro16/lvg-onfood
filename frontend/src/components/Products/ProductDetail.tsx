import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useActionData } from "react-router-dom";
import { Product } from "../../store/redux/products-slice";

type ProductItemProps = { product: Product };

const ProductDetail: React.FC<ProductItemProps> = (props) => {


  const header = (
    <img
      alt="ProductDetail"
      src={props.product.image}
    />
  );
  const footer = (
    <>
      <Button label="Save" icon="pi pi-check" />
      <Button
        label="Cancel"
        severity="secondary"
        icon="pi pi-times"
        style={{ marginLeft: "0.5em" }}
      />
    </>
  );

  return (
    <div className="card flex justify-content-center">
      <Card
        title={props.product.title}
        subTitle='Product Detail'
        footer={footer}
        header={header}
        className="md:w-25rem"
      >
        <p className="m-0">
          {props.product.description}
        </p>
      </Card>
    </div>
  );
};

export default ProductDetail;
