import React from 'react'
import TextField from '@mui/material/TextField';
import styles from "../page.module.css";
import Typography from '@mui/material/Typography';


const Gitlab = () => {
  return (
    <div className={styles.gitlab}>
        <Typography variant="h4" component="h2">Gitlab</Typography>
        <TextField id="outlined-basic" label="Org Gitlab URL" variant="outlined" />
        <TextField id="outlined-basic" label="Personal Access Token" variant="outlined" />
    </div>
  )
}

export default Gitlab