import { useParams } from "react-router-dom";

import EditForm from "./components/EditForm";
import Box from "@mui/material/Box";

const EditFormPage = () => {
  let { id } = useParams();
  return (
    <Box sx={{ px: 2, width: "100%" }}>
      <h1>Inventory Posting Group Edit Page</h1>
      <EditForm id={id} />
    </Box>
  );
};

export default EditFormPage;
