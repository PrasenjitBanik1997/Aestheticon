import React from 'react';
import { material } from '../../../library/material';

function AddStocks(props) {
    return (
        <div className='d-flex'>
            <material.TextField
                label="Supplier"
                size="small"
                variant='standard'
                sx={{ minWidth: 200, p:1 }}
            />
            <material.TextField
                label="Product"
                size="small"
                variant='standard'
                sx={{ minWidth: 200, p:1 }}
            />
            <material.TextField
                label="Units"
                size="small"
                variant='standard'
                sx={{ minWidth: 200, p:1 }}
            />
            <material.TextField
                label="Box/Vial"
                size="small"
                variant='standard'
                sx={{ minWidth: 200, p:1 }}
            />
            <material.TextField
                label="Date in"
                size="small"
                variant='standard'
                sx={{ minWidth: 200, p:1 }}
            />
            <material.TextField
                label="Date in"
                size="small"
                variant='standard'
                sx={{ minWidth: 200, p:1 }}
            />
            <material.TextField
                label="Date in"
                size="small"
                variant='standard'
                sx={{ minWidth: 200, p:1 }}
            />
            <material.TextField
                label="Date in"
                size="small"
                variant='standard'
                sx={{ minWidth: 200, p:1 }}
            />
            <material.TextField
                label="Date in"
                size="small"
                variant='standard'
                sx={{ minWidth: 200, p:1 }}
            />
            <material.TextField
                label="Date in"
                size="small"
                variant='standard'
                sx={{ minWidth: 200, p:1 }}
            />
        </div>
    );
}

export default AddStocks;