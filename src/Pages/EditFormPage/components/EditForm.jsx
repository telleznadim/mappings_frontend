import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import Grid from "@mui/material/Unstable_Grid2";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function EditForm(props) {
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [data, setData] = useState([]);
  const [inputValues, setInputValues] = useState({
    inventory_group: "",
    inventory_posting_group: "",
    inventory_posting_group_description: "",
  });

  const { id } = props;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const getData = () => {
    console.log(data);
  };

  const handleGetInventoryPostingGroup = (id) => {
    // console.log(id);
    setSaveLoading(true);
    axios
      .get(`http://localhost:5000/get_inventory_posting_group/${id}`)
      .then((response) => {
        // console.log(response.data);
        setData(response.data);
        // Exclude the 'id' field when copying data to inputValues
        const { id, ...rest } = response.data;
        setInputValues(rest);
        setSaveLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setSaveLoading(false);
      });
  };

  const handleSave = (id) => {
    // console.log(id);
    // console.log(inputValues);
    setSaveLoading(true);
    axios
      .put(
        `http://localhost:5000/update_inventory_posting_group/${id}`,
        inputValues
      )
      .then((response) => {
        console.log(response);
        setSaveLoading(false);
        setSaveSuccess(true);
      })
      .catch((error) => {
        console.log(error);
        setSaveLoading(false);
      });
  };

  useEffect(() => {
    handleGetInventoryPostingGroup(id);
  }, [id]);
  return (
    <Box sx={{ flexGrow: 100 }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={saveLoading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={2}>
        {saveSuccess ? (
          <Grid xs={12}>
            <Stack sx={{ width: "20%" }} spacing={2}>
              <Alert
                sx={{ mx: 1 }}
                variant="filled"
                severity="success"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setSaveSuccess(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                Save succesfully!!
              </Alert>
            </Stack>
          </Grid>
        ) : null}

        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "30ch" },
            display: "flex",
            flexWrap: "wrap",
          }}
          noValidate
          autoComplete="off"
        >
          <Grid xs={12}>
            <TextField
              defaultValue={id}
              id="outlined-read-only-input"
              label="Id"
              disabled
            />
            {data ? (
              <div>
                <TextField
                  required
                  //   value={data.inventory_group}
                  id="inventory_group"
                  label="Inventory Group"
                  name="inventory_group"
                  //   defaultValue={data.inventory_group}
                  value={inputValues.inventory_group}
                  onChange={handleInputChange}
                />
                <TextField
                  required
                  id="inventory_posting_group"
                  name="inventory_posting_group"
                  label="Inventory Posting Group"
                  value={inputValues.inventory_posting_group}
                  onChange={handleInputChange}
                />
                <TextField
                  required
                  id="inventory_posting_group_description"
                  name="inventory_posting_group_description"
                  label="Inventory Posting Group Description"
                  value={inputValues.inventory_posting_group_description}
                  onChange={handleInputChange}
                />
              </div>
            ) : null}
          </Grid>
          <Grid
            display="flex"
            justifyContent="center"
            alignItems="center"
            xs={12}
          >
            <Button
              onClick={() => handleSave(id)}
              variant="contained"
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
}
