// src/api/assetHistory.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/assetHistory';

export const getAssets = () => axios.get(API_URL);
export const createAsset = (asset) => axios.post(API_URL, asset);
export const updateAsset = (id, updatedAsset) => axios.put(`${API_URL}/${id}`, updatedAsset);
export const deleteAsset = (id) => axios.delete(`${API_URL}/${id}`);
