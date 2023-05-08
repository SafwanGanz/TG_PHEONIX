import { readFileSync } from 'fs';
const { mongo_url } = JSON.parse(readFileSync('./config.json'))
import { connect } from 'mongoose';
    connect(mongo_url)
  .then(() => console.log('Connected!'));
