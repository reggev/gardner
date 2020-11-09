import { Express, Request as ERequest } from 'express';
import { DataSources } from './app';

export interface Request extends ERequest {
  dataSources: DataSources;
}

export interface PostRequest<Body = {}> extends ERequest {
  dataSources: DataSources;
  body: Body;
}

