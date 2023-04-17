import AddForm from "./components/AddForm";
import Box from "@mui/material/Box";

const AddFormPage = () => {
  return (
    <Box sx={{ px: 2, width: "100%" }}>
      <h1>Inventory Posting Group Add Page</h1>
      <AddForm />
    </Box>
  );
};

export default AddFormPage;
