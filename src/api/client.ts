import axios from 'axios';
import 'dotenv/config';

const client = axios.create();

export const NEOPLE_API_KEY = process.env.NEOPLE_API_KEY;

export default client;
