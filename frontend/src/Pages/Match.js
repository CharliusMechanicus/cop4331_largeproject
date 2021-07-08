import React, { useState, useEffect } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function createData(name, email, phone_number) {
    return { name, email, phone_number};
  }
  
  const rows = [
    createData('Frozen yoghurt', 'aaa@gmail.com','656655'),
    createData('who ever', 'aaa@gmail.com','6565656'),
    createData('Foghurt', 'aaa@gmail.com', '656665'),
    createData('Froyoghurt', 'aaa@gmail.com','65656'),
    createData('Frourt', 'aaa@gmail.com','6565656465'),
  ];

function Match()
{
    return (
        <div class='match_list'>
            <span>Match List</span><br/>
            <TableContainer component={Paper}>
                <Table class='match_list' aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="center">email</TableCell>
                        <TableCell align="center">phone number</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">{row.phone_number}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Match;