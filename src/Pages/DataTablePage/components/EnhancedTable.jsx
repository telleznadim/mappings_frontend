import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import EnhancedTableHead from "./EnhancedTableHead";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmationDialog from "./ConfirmationDialog/ConfirmationDialog";

const DEFAULT_ORDER = "asc";
const DEFAULT_ORDER_BY = "id";
const DEFAULT_ROWS_PER_PAGE = 10;

// ------------ Main Component ------------
const EnhancedTable = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [paddingHeight, setPaddingHeight] = useState(0);
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [nrows, setNrows] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigateToEditPage = (id) => {
    // console.log(id);
    // 👇️ navigate to /contacts
    navigate(`/edit/inventory-posting-group/${id}`);
  };

  const handleGetInventoryPostingGroup = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/get_inventory_posting_group_table",
        {
          params: {
            limit: rowsPerPage,
            offset: page * rowsPerPage,
            order_by: orderBy,
            order: order,
          },
        }
      );
      setLoading(false);
      // console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [order, orderBy, page, rowsPerPage]);

  const handleDelete = async (id) => {
    setLoading(true);
    // console.log("Handle delete", id);
    try {
      const response = await axios.delete(
        `http://localhost:5000/delete_inventory_posting_group/${id}`
      );
      setLoading(false);
      console.log(response);
      refreshData();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleRequestSort = useCallback(
    (event, newOrderBy) => {
      const isAsc = orderBy === newOrderBy && order === "asc";
      const toggledOrder = isAsc ? "desc" : "asc";
      setOrder(toggledOrder);
      setOrderBy(newOrderBy);
    },
    [order, orderBy]
  );

  const handleChangePage = useCallback(
    (event, newPage) => {
      // console.log("handleChangePage");
      // console.log("handleChangePage_Page# ", page);
      // console.log("newPage# ", newPage);
      setPage(newPage);

      // Avoid a layout jump when reaching the last page with empty rows.
      const numEmptyRows =
        newPage > 0 ? Math.max(0, (1 + newPage) * rowsPerPage - nrows) : 0;

      const newPaddingHeight = 53 * numEmptyRows;
      setPaddingHeight(newPaddingHeight);
    },
    [rowsPerPage, nrows]
  );

  const handleChangeRowsPerPage = useCallback((event) => {
    // console.log("handleChangeRowsPerPage");
    const updatedRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(updatedRowsPerPage);
    setPage(0);
    // There is no layout jump to handle on the first page.
    setPaddingHeight(0);
  }, []);

  const refreshData = useCallback(async () => {
    // console.log("refreshData");
    // console.log("RefreshData_Page# ", page);
    const response = await handleGetInventoryPostingGroup();
    setHeaders(
      Object.keys(response.data[0]).map((key) => ({
        id: key,
        numeric: typeof response.data[0][key] === "number",
        disablePadding: false,
        label: key.toUpperCase(),
      }))
    );
    setRows(response.data);
    setNrows(response.attributes.total_rows);
    setLoading(false);

    // let rowsOnMount = stableSort(response.data, getComparator(order, orderBy));
    // rowsOnMount = rowsOnMount.slice(
    //   page * rowsPerPage,
    //   page * rowsPerPage + rowsPerPage
    // );
    // console.log(rowsOnMount);
    // setVisibleRows(rowsOnMount);
  }, [handleGetInventoryPostingGroup]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <Box sx={{ width: "100%" }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar title="Inventory Posting Group" />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"small"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={nrows}
              headCells={headers}
            />
            <TableBody>
              {rows
                ? rows.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          align="right"
                        >
                          {row.id}
                        </TableCell>
                        <TableCell align="right">
                          {row.inventory_group}
                        </TableCell>
                        <TableCell align="right">
                          {row.inventory_posting_group}
                        </TableCell>
                        <TableCell align="right">
                          {row.inventory_posting_group_description}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => navigateToEditPage(row.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <ConfirmationDialog
                            id={row.id}
                            handleDelete={handleDelete}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                : null}
              {paddingHeight > 0 && (
                <TableRow
                  style={{
                    height: paddingHeight,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 15, 25]}
          component="div"
          count={nrows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default EnhancedTable;
