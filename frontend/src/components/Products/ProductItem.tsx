import React, { useContext, useRef, useState } from "react";
import { DataView } from "primereact/dataview";
import { Product } from "../../store/redux/products-slice";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { fetchDeleteProduct } from "../../util/http";
import { AuthContext } from "../../store/context/auth-context";
import { Tag } from "primereact/tag";

type ProductItemProps = { product: Product };

const ProductItem: React.FC<ProductItemProps> = (props) => {
  const toast = useRef<Toast>(null);
  const [visible, setVisible] = useState(false);
  const { getToken } = useContext(AuthContext);

  const successHandler = () => {
    setVisible(false);
    toast.current?.show({
      severity: "success",
      summary: "Product Deleted",
      detail: "Product deleted successfully",
      life: 1000,
    });
  };

  const errorHandler = () => {
    setVisible(false);
    toast.current?.show({
      severity: "warn",
      summary: "Product Deletion Interrupted",
      detail: "Product deletion interrupted successfully",
      life: 1000,
    });
  };

  const accept = async () => {
    setVisible(false);
    const token = await getToken();
    if (token) {
      fetchDeleteProduct(token, props.product.id, {
        errorHandler,
        successHandler,
      });
    }
  };

  const reject = () => {
    setVisible(false);
  };

  const header = (
    <div>
      <img alt="Product Detail" src={props.product.image} />
    </div>
  );

  const confirm2 = () => {
    confirmDialog({
      message: "Do you want to delete this product?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    });
  };
  const footer = (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      <Button label="Edit" icon="pi pi-pencil"></Button>
      <Button
        label="Delete"
        severity="secondary"
        icon="pi pi-times"
        style={{ marginLeft: "0.5em" }}
        onClick={confirm2}
      ></Button>
    </>
  );

  const gridItem = () => {
    return (
      <div
        className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2 w-2 gap-2 inline"
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
              <Button
                className="bd-red"
                icon="pi pi-bars"
                onClick={() => setVisible(true)}
              />
              <Dialog
                maximized
                modal
                visible={visible}
                onHide={() => setVisible(false)}
              >
                <Card
                  title={props.product.title}
                  header={header}
                  footer={footer}
                  subTitle="Product Detail"
                  className="md:w-25rem"
                >
                  <p className="m-0">{props.product.description}</p>
                  <p className="m-0">
                    €{props.product.price} Qty: {props.product.quantity}
                  </p>
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
