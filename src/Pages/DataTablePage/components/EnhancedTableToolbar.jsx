import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

function EnhancedTableToolbar(props) {
  const navigate = useNavigate();
  const { title } = props;
  const navigateToAddPage = () => {
    navigate(`/add/inventory-posting-group`);
  };
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {title}
      </Typography>
      <Tooltip title="Add">
        <IconButton onClick={() => navigateToAddPage()}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

export default EnhancedTableToolbar;
