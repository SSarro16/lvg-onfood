import React, { FormEvent, useContext, useRef, useState } from "react";
import { DataView } from "primereact/dataview";
import { Product } from "../../store/redux/products-slice";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { fetchDeleteProduct, fetchUpdateProduct } from "../../util/http";
import { Form, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

type ProductItemProps = { product: Product; token?: string };

type NewProductFormFields = {
  title: string;
  image: string;
  price: number;
  description: string;
  quantity: number;
  estimatedCompletedTime: number;
};

const defaultFormFields: NewProductFormFields = {
  title: "",
  image: "",
  price: 0,
  description: "",
  quantity: 0,
  estimatedCompletedTime: 0,
};

const ProductItem: React.FC<ProductItemProps> = (props) => {
  const toast = useRef<Toast>(null);
  // #PRODUCT DETAIL VISIBLE
  const [visible, setVisible] = useState(false);
  // #PRODUCT EDIT VISIBLE
  const [visibleEdit, setVisibleEdit] = useState(false);
  // #PRODUCT FORM FIELDS
  const [formFields, setFormFields] =
    useState<NewProductFormFields>(defaultFormFields);
  const { title, image, price, description, quantity, estimatedCompletedTime } =
    formFields;
  // #USE NAVIGATE
  const navigate = useNavigate();

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFormFields((prevState) => ({ ...prevState, [name]: value }));
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const successDeleteHandler = () => {
    setVisible(false);
    toast.current?.show({
      severity: "success",
      summary: "Product Deleted",
      detail: "Product deleted successfully",
      life: 1000,
    });
  };

  const errorDeleteHandler = () => {
    setVisible(false);
    toast.current?.show({
      severity: "warn",
      summary: "Product Deletion Interrupted",
      detail: "Product deletion interrupted successfully",
      life: 1000,
    });
  };

  const errorSavingHandler = () => {
    toast.current?.show({
      severity: "error",
      summary: "Edit Product Failed",
      detail: "Edit product failed !!",
      life: 3000,
    });
  };
  const successSavingHandler = () => {
    resetFormFields();
    setVisibleEdit(false);
    setVisible(true);
    navigate("/");
    toast.current?.show({
      severity: "success",
      summary: "Product Updated",
      detail: "Product updated successfully",
      life: 3000,
    });
  };

  const header = (
    <div>
      <img alt={props.product.title} src={props.product.image} />
    </div>
  );

  const confirm2 = () => {
    confirmDialog({
      tagKey: "deleteProduct",
      message: "Do you want to delete this product?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      acceptLabel: "Delete",
      async accept() {
        setVisible(false);
        if (props.token) {
          fetchDeleteProduct(props.token, props.product.id, {
            errorDeleteHandler,
            successDeleteHandler,
          });
        }
      },
      reject() {
        setVisible(false);
      },
    });
  };

  const editing = () => {
    setVisible(true);
    confirmDialog({
      tagKey: "editProduct",
      message: "Do you want to edit this product?",
      header: "Edit Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-warning",
      acceptLabel: "Go to edit",
      async accept() {
        setVisibleEdit(true);
        setVisible(false);
      },
      reject() {
        setVisible(false);
        setVisibleEdit(false);
      },
    });
  };

  const saving = () => {
    confirmDialog({
      tagKey: "savingProduct",
      message: "Do you want to save this edited product?",
      header: "Save Edit Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      acceptLabel: "Save",
      accept() {
        setVisible(false);
        if (props.token) {
          const bodyData: NewProductFormFields = {
            title,
            image,
            price,
            description,
            quantity,
            estimatedCompletedTime,
          };
          console.log("New Product form data: ", { bodyData });
          fetchUpdateProduct(props.token, props.product.id, bodyData, {
            errorSavingHandler,
            successSavingHandler,
          });
        }
      },
      reject() {
        setVisible(false);
      },
    });
  };

  const footer = (
    <>
      <Toast ref={toast} />
      <ConfirmDialog tagKey="deleteProduct" />
      <ConfirmDialog tagKey="editProduct" />
      <ConfirmDialog tagKey="savingProduct" />
      {props.token && (
        <>
          <Button
            label="Save"
            severity="success"
            icon="pi pi-check"
            onClick={saving}
            visible={visibleEdit}
            style={{ marginLeft: "0.5em" }}
          ></Button>
          <Button
            name="Edit"
            label="Edit"
            icon="pi pi-pencil"
            visible={visible}
            onClick={editing}
            style={{ marginLeft: "0.5em" }}
          ></Button>
          <Button
            name="Delete"
            label="Delete"
            severity="secondary"
            icon="pi pi-times"
            style={{ marginLeft: "0.5em" }}
            onClick={confirm2}
          ></Button>
        </>
      )}
    </>
  );

  const gridItem = () => {
    return (
      <div
        className="col-12 sm:col-6 lg:col-12 xl:col-4 gap-2"
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
                // maximized
                modal
                visible={visible}
                onHide={() => setVisible(false)}
              >
                <Card
                  title={props.product.title}
                  header={header}
                  footer={footer}
                  subTitle="Product Detail"
                  className="md:w-25rem w-20rem h-25rem"
                >
                  <p className="m-0 ">{props.product.description}</p>
                  <p className="m-0 ">Quantity: {props.product.quantity} pz</p>
                  <p className="m-0 text-right">{props.product.price}€</p>
                </Card>
              </Dialog>
              <Dialog
                // maximized
                modal
                visible={visibleEdit}
                onHide={() => setVisibleEdit(false)}
              >
                <Card
                  title="Edit Product Details"
                  footer={footer}
                  className="md:w-30rem w-40rem h-50rem text-center"
                >
                  <Form method="post">
                    <div>
                      <div className="gap-2 m-2">
                        <p className="text-white">Set a new image URL</p>
                        <InputText
                          id="image"
                          type="url"
                          name="image"
                          onChange={handleChange}
                          required
                          placeholder="Image URL"
                          className="p-inputtext-lg"
                        />
                      </div>
                      <div className="gap-2 m-2">
                        <p className="text-white">Set a new Title</p>
                        <InputText
                          id="title"
                          type="text"
                          name="title"
                          placeholder={props.product.title}
                          onChange={handleChange}
                          className="p-inputtext-lg"
                        />
                      </div>
                      <div className="gap-2 m-2">
                        <p className="text-white">Set a new Description</p>
                        <InputText
                          id="description"
                          type="textarea"
                          name="description"
                          onChange={handleChange}
                          placeholder={props.product.description}
                          className="p-inputtext-lg"
                        />
                      </div>
                      <div className="gap-2 m-2">
                        <p className="text-white">Set a new Price</p>
                        <InputNumber
                          id="price"
                          name="price"
                          mode="currency"
                          currency="EUR"
                          locale="it-IT"
                          placeholder="0,00€"
                          required
                          onValueChange={(e: any) =>
                            setFormFields({ ...formFields, price: e.value })
                          }
                          className="p-inputtext-lg"
                        />
                      </div>
                      <div className="gap-2 m-2 ">
                        <p className="text-white">Set a new Quantity</p>
                        <InputNumber
                          id="quantity"
                          name="quantity"
                          placeholder="0"
                          onValueChange={(e: any) =>
                            setFormFields({
                              ...formFields,
                              price: e.quantity,
                            })
                          }
                          className="p-inputtext-lg"
                        />
                      </div>
                      <div className="gap-2 m-2">
                        <p className="text-white">
                          Set a new Estimated Completed Time
                        </p>
                        <InputNumber
                          id="estimatedCompletedTime"
                          name="estimatedCompletedTime"
                          placeholder="0 seconds"
                          onValueChange={(e: any) =>
                            setFormFields({
                              ...formFields,
                              estimatedCompletedTime: e.estimatedCompletedTime,
                            })
                          }
                          className="p-inputtext-lg"
                        />
                      </div>
                    </div>
                  </Form>
                </Card>
              </Dialog>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DataView
      className="flex-initial flex align-items-center justify-content-center"
      value={[props.product]}
      itemTemplate={gridItem}
    />
  );
};

export default ProductItem;

export { ProductItem };
