import "../App.css";

import { useState } from 'react';
import { Form } from "react-router-dom";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import StyledEngineProvider from '@mui/material/StyledEngineProvider';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function PetDeletionButton({name}) {
  const [isOpen, setIsOpen] = useState(false);

  function handleClickOpen() {
    setIsOpen(true);
  }

  function handleClickClose() {
    setIsOpen(false);
  }

  const dialogText = "Do you really want to delete " + name + "?";

  return (
    <>
      <StyledEngineProvider injectFirst>
        <button className="menu_button" onClick={handleClickOpen}>
          <DeleteForeverIcon fontSize="inherit" />
        </button>

        <Dialog
          className="deletion_dialog"
          open={isOpen}
          onClose={handleClickClose}
          aria-describedby="petDeleteDialogDescription"
        >
          <DialogContent>
            <DialogContentText id="petDeleteDialogDescription">
              {dialogText} 
            </DialogContentText>
          </DialogContent>

          <DialogActions>
              <Form method="post" action={"/" +  name + "/delete"}>
                <input type="hidden" name="petName" value={name} />
                <button className="menu_button" type="submit" onClick={handleClickClose}>
                  <CheckIcon fontSize="inherit" />
                </button>
              </Form>

              <button className="menu_button" onClick={handleClickClose} autoFocus>
                <CloseIcon fontSize="inherit" />
              </button>
          </DialogActions>
        </Dialog>
      </StyledEngineProvider>
    </>
  );
}